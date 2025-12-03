import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { masterService } from '../../services/masterService';
import { Employee } from '../../types';

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  useEffect(() => {
    fetchEmployees(1, 10);
  }, []);

  const fetchEmployees = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await masterService.getEmployees(page, pageSize);
      if (response.success) {
        setEmployees(response.data.items);
        setPagination({
          current: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        });
      }
    } catch (error: any) {
      message.error('Tải danh sách nhân viên thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination: any) => {
    fetchEmployees(pagination.current, pagination.pageSize);
  };

  const showModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      form.setFieldsValue(employee);
    } else {
      setEditingEmployee(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingEmployee) {
        const response = await masterService.updateEmployee(editingEmployee.id, values);
        if (response.success) {
          message.success('Cập nhật nhân viên thành công!');
        }
      } else {
        const response = await masterService.createEmployee(values);
        if (response.success) {
          message.success('Thêm nhân viên thành công!');
        }
      }

      setModalVisible(false);
      form.resetFields();
      fetchEmployees(pagination.current, pagination.pageSize);
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
      const response = await masterService.deleteEmployee(id);
      if (response.success) {
        message.success('Xóa nhân viên thành công!');
        fetchEmployees(pagination.current, pagination.pageSize);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Xóa nhân viên thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Employee) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa nhân viên này?"
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
        <h2>Quản lý nhân viên</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Thêm nhân viên
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={employees}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Modal
        title={editingEmployee ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        okText={editingEmployee ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng nhập vai trò!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="department"
            label="Phòng ban"
            rules={[{ required: true, message: 'Vui lòng nhập phòng ban!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;