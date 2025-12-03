import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import JA from '../../constants/ja';

interface Contractor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

const ContractorManagement: React.FC = () => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadContractors();
  }, []);

  const loadContractors = async () => {
    setLoading(true);
    try {
      // TODO: API call
      const mockData: Contractor[] = [
        {
          id: '1',
          name: '大林組',
          contactPerson: '田中太郎',
          email: 'tanaka@obayashi.co.jp',
          phone: '03-1234-5678',
          address: '東京都港区',
          createdAt: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          name: '鹿島建設',
          contactPerson: '佐藤次郎',
          email: 'sato@kajima.co.jp',
          phone: '03-2345-6789',
          address: '東京都中央区',
          createdAt: '2024-01-15T00:00:00Z',
        },
      ];
      setContractors(mockData);
    } catch (error) {
      message.error(JA.error.networkError);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingContractor(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (contractor: Contractor) => {
    setEditingContractor(contractor);
    form.setFieldsValue(contractor);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: API call
      message.success(JA.contractor.deleteSuccess);
      loadContractors();
    } catch (error) {
      message.error(JA.error.networkError);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingContractor) {
        // TODO: API call
        message.success(JA.contractor.updateSuccess);
      } else {
        // TODO: API call
        message.success(JA.contractor.createSuccess);
      }

      setModalVisible(false);
      loadContractors();
    } catch (error) {
      message.error(JA.error.networkError);
    }
  };

  const columns: ColumnsType<Contractor> = [
    {
      title: JA.contractor.name,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: JA.contractor.contactPerson,
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: JA.contractor.email,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: JA.contractor.phone,
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: JA.contractor.address,
      dataIndex: 'address',
      key: 'address',
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
            title={JA.contractor.deleteConfirm}
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
        <h2>{JA.contractor.title}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {JA.contractor.addContractor}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={contractors}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingContractor ? JA.contractor.editContractor : JA.contractor.addContractor}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={JA.common.save}
        cancelText={JA.common.cancel}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={JA.contractor.name}
            rules={[{ required: true, message: JA.error.required }]}
          >
            <Input placeholder={JA.contractor.name} />
          </Form.Item>

          <Form.Item
            name="contactPerson"
            label={JA.contractor.contactPerson}
            rules={[{ required: true, message: JA.error.required }]}
          >
            <Input placeholder={JA.contractor.contactPerson} />
          </Form.Item>

          <Form.Item
            name="email"
            label={JA.contractor.email}
            rules={[
              { required: true, message: JA.error.required },
              { type: 'email', message: JA.error.invalidEmail },
            ]}
          >
            <Input placeholder={JA.contractor.email} />
          </Form.Item>

          <Form.Item
            name="phone"
            label={JA.contractor.phone}
            rules={[{ required: true, message: JA.error.required }]}
          >
            <Input placeholder={JA.contractor.phone} />
          </Form.Item>

          <Form.Item
            name="address"
            label={JA.contractor.address}
          >
            <Input.TextArea placeholder={JA.contractor.address} rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContractorManagement;
