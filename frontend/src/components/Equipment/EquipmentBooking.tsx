import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Select, DatePicker, Input, Space, message, Tag } from 'antd';
import { PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { equipmentService } from '../../services/equipmentService';
import { masterService } from '../../services/masterService';
import { EquipmentUsageHistory, Equipment } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

const EquipmentBooking: React.FC = () => {
  const [bookings, setBookings] = useState<EquipmentUsageHistory[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const { user } = useAuth();

  useEffect(() => {
    fetchBookings(1, 10);
    fetchEquipments();
  }, []);

  const fetchBookings = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await equipmentService.getUsageHistory(page, pageSize);
      if (response.success) {
        setBookings(response.data.items);
        setPagination({
          current: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        });
      }
    } catch (error: any) {
      message.error('Tải danh sách đặt thiết bị thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipments = async () => {
    try {
      const response = await masterService.getEquipments(1, 100);
      if (response.success) {
        setEquipments(response.data.items.filter(e => e.status === 'available'));
      }
    } catch (error: any) {
      message.error('Tải danh sách thiết bị thất bại!');
    }
  };

  const handleTableChange = (pagination: any) => {
    fetchBookings(pagination.current, pagination.pageSize);
  };

  const showModal = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const bookingData = {
        equipmentId: values.equipmentId,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        purpose: values.purpose,
      };

      const response = await equipmentService.createBooking(bookingData);
      if (response.success) {
        message.success('Đặt thiết bị thành công!');
        setModalVisible(false);
        form.resetFields();
        fetchBookings(pagination.current, pagination.pageSize);
        fetchEquipments();
      }
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      message.error(error.response?.data?.message || 'Đặt thiết bị thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setLoading(true);
      const response = await equipmentService.approveBooking(id);
      if (response.success) {
        message.success('Phê duyệt thành công!');
        fetchBookings(pagination.current, pagination.pageSize);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Phê duyệt thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    Modal.confirm({
      title: 'Lý do từ chối',
      content: (
        <Input.TextArea
          id="rejectReason"
          placeholder="Nhập lý do từ chối..."
          rows={4}
        />
      ),
      onOk: async () => {
        const reason = (document.getElementById('rejectReason') as HTMLTextAreaElement)?.value;
        if (!reason) {
          message.warning('Vui lòng nhập lý do từ chối!');
          return;
        }

        try {
          setLoading(true);
          const response = await equipmentService.rejectBooking(id, reason);
          if (response.success) {
            message.success('Đã từ chối!');
            fetchBookings(pagination.current, pagination.pageSize);
          }
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Từ chối thất bại!');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'blue';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ duyệt';
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const columns = [
    {
      title: 'Thiết bị',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
    },
    {
      title: 'Người đặt',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Mục đích',
      dataIndex: 'purpose',
      key: 'purpose',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: EquipmentUsageHistory) => {
        if (user?.role === 'Admin' && record.status === 'pending') {
          return (
            <Space size="middle">
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
              >
                Duyệt
              </Button>
              <Button
                type="link"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject(record.id)}
              >
                Từ chối
              </Button>
            </Space>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Đặt thiết bị</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Đặt thiết bị mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={bookings}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Modal
        title="Đặt thiết bị mới"
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        okText="Đặt"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="equipmentId"
            label="Thiết bị"
            rules={[{ required: true, message: 'Vui lòng chọn thiết bị!' }]}
          >
            <Select placeholder="Chọn thiết bị">
              {equipments.map((equipment) => (
                <Option key={equipment.id} value={equipment.id}>
                  {equipment.name} - {equipment.serialNumber}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Thời gian sử dụng"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
          >
            <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="purpose"
            label="Mục đích sử dụng"
            rules={[{ required: true, message: 'Vui lòng nhập mục đích!' }]}
          >
            <TextArea rows={4} placeholder="Nhập mục đích sử dụng thiết bị..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EquipmentBooking;