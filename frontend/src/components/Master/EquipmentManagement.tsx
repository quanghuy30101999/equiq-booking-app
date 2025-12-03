import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { masterService } from '../../services/masterService';
import { Equipment } from '../../types';

const { Option } = Select;

const EquipmentManagement: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  useEffect(() => {
    fetchEquipments(1, 10);
  }, []);

  const fetchEquipments = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await masterService.getEquipments(page, pageSize);
      if (response.success) {
        setEquipments(response.data.items);
        setPagination({
          current: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        });
      }
    } catch (error: any) {
      message.error('Tải danh sách thiết bị thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination: any) => {
    fetchEquipments(pagination.current, pagination.pageSize);
  };

  const showModal = (equipment?: Equipment) => {
    if (equipment) {
      setEditingEquipment(equipment);
      form.setFieldsValue(equipment);
    } else {
      setEditingEquipment(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingEquipment) {
        const response = await masterService.updateEquipment(editingEquipment.id, values);
        if (response.success) {
          message.success('Cập nhật thiết bị thành công!');
        }
      } else {
        const response = await masterService.createEquipment(values);
        if (response.success) {
          message.success('Thêm thiết bị thành công!');
        }
      }

      setModalVisible(false);
      form.resetFields();
      fetchEquipments(pagination.current, pagination.pageSize);
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      message.error(error.response?.data?.message || 'Thao tác thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await masterService.deleteEquipment(id);
      if (response.success) {
        message.success('Xóa thiết bị thành công!');
        fetchEquipments(pagination.current, pagination.pageSize);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Xóa thiết bị thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'green';
      case 'booked':
        return 'blue';
      case 'in_use':
        return 'orange';
      case 'maintenance':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Có sẵn';
      case 'booked':
        return 'Đã đặt';
      case 'in_use':
        return 'Đang sử dụng';
      case 'maintenance':
        return 'Bảo trì';
      default:
        return status;
    }
  };

  const columns = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Số serial',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
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
      render: (_: any, record: Equipment) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa thiết bị này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Quản lý thiết bị</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Thêm thiết bị
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={equipments}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Modal
        title={editingEquipment ? 'Sửa thông tin thiết bị' : 'Thêm thiết bị mới'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        okText={editingEquipment ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên thiết bị"
            rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập danh mục!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="serialNumber"
            label="Số serial"
            rules={[{ required: true, message: 'Vui lòng nhập số serial!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Option value="available">Có sẵn</Option>
              <Option value="booked">Đã đặt</Option>
              <Option value="in_use">Đang sử dụng</Option>
              <Option value="maintenance">Bảo trì</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EquipmentManagement;