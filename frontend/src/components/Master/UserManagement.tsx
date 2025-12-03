import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Tag, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import JA from '../../constants/ja';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Individual';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await userService.getUsers();
      // if (response.success) {
      //   setUsers(response.data.items);
      // }

      // Mock data for now
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@example.com',
          name: '管理者',
          role: 'Admin',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          lastLogin: '2024-12-03T10:00:00Z',
        },
        {
          id: '2',
          email: 'user@example.com',
          name: '一般ユーザー',
          role: 'Individual',
          status: 'active',
          createdAt: '2024-01-02T00:00:00Z',
          lastLogin: '2024-12-02T15:30:00Z',
        },
      ];
      setUsers(mockUsers);
    } catch (error) {
      message.error(JA.error.networkError);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      // await userService.deleteUser(id);
      message.success(JA.user.deleteSuccess);
      loadUsers();
    } catch (error) {
      message.error(JA.error.networkError);
    }
  };

  const handleResetPassword = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      // await userService.resetPassword(id);
      message.success(JA.user.resetSuccess);
    } catch (error) {
      message.error(JA.error.networkError);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingUser) {
        // TODO: Replace with actual API call
        // await userService.updateUser(editingUser.id, values);
        message.success(JA.user.updateSuccess);
      } else {
        // TODO: Replace with actual API call
        // await userService.createUser(values);
        message.success(JA.user.createSuccess);
      }

      setModalVisible(false);
      loadUsers();
    } catch (error) {
      message.error(JA.error.networkError);
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: JA.user.email,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: JA.user.username,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: JA.user.role,
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'Admin' ? 'red' : 'blue'}>
          {role === 'Admin' ? JA.user.admin : JA.user.individual}
        </Tag>
      ),
    },
    {
      title: JA.user.status,
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? JA.user.active : JA.user.inactive}
        </Tag>
      ),
    },
    {
      title: JA.user.lastLogin,
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date: string) => date ? dayjs(date).format('YYYY/MM/DD HH:mm') : '-',
    },
    {
      title: JA.user.createdAt,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY/MM/DD'),
    },
    {
      title: JA.common.actions,
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {JA.common.edit}
          </Button>
          <Popconfirm
            title={JA.user.resetPasswordConfirm}
            onConfirm={() => handleResetPassword(record.id)}
            okText={JA.common.confirm}
            cancelText={JA.common.cancel}
          >
            <Button type="link" icon={<ReloadOutlined />}>
              {JA.user.resetPassword}
            </Button>
          </Popconfirm>
          <Popconfirm
            title={JA.user.deleteConfirm}
            onConfirm={() => handleDelete(record.id)}
            okText={JA.common.confirm}
            cancelText={JA.common.cancel}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              {JA.common.delete}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>{JA.user.title}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {JA.user.addUser}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingUser ? JA.user.editUser : JA.user.addUser}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={JA.common.save}
        cancelText={JA.common.cancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label={JA.user.email}
            rules={[
              { required: true, message: JA.error.required },
              { type: 'email', message: JA.error.invalidEmail },
            ]}
          >
            <Input placeholder={JA.user.email} />
          </Form.Item>

          <Form.Item
            name="name"
            label={JA.user.username}
            rules={[{ required: true, message: JA.error.required }]}
          >
            <Input placeholder={JA.user.username} />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label={JA.auth.password}
              rules={[
                { required: true, message: JA.error.required },
                { min: 6, message: JA.error.minLength.replace('{min}', '6') },
              ]}
            >
              <Input.Password placeholder={JA.auth.password} />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label={JA.user.role}
            rules={[{ required: true, message: JA.error.required }]}
          >
            <Select placeholder={JA.user.role}>
              <Select.Option value="Admin">{JA.user.admin}</Select.Option>
              <Select.Option value="Individual">{JA.user.individual}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label={JA.user.status}
            rules={[{ required: true, message: JA.error.required }]}
          >
            <Select placeholder={JA.user.status}>
              <Select.Option value="active">{JA.user.active}</Select.Option>
              <Select.Option value="inactive">{JA.user.inactive}</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
