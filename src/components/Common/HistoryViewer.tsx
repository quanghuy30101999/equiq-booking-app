import React, { useState, useEffect } from 'react';
import { Table, Select, Tag, Card } from 'antd';
import { historyService } from '../../services/historyService';
import { ChangeHistory } from '../../types';
import dayjs from 'dayjs';

const { Option } = Select;

const HistoryViewer: React.FC = () => {
  const [history, setHistory] = useState<ChangeHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [entityType, setEntityType] = useState<string>('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  useEffect(() => {
    fetchHistory(entityType, 1, 10);
  }, [entityType]);

  const fetchHistory = async (type: string, page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await historyService.getHistory(type || undefined, page, pageSize);
      if (response.success) {
        setHistory(response.data.items);
        setPagination({
          current: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination: any) => {
    fetchHistory(entityType, pagination.current, pagination.pageSize);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'green';
      case 'update':
        return 'blue';
      case 'delete':
        return 'red';
      default:
        return 'default';
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'create':
        return 'Tạo mới';
      case 'update':
        return 'Cập nhật';
      case 'delete':
        return 'Xóa';
      default:
        return action;
    }
  };

  const getEntityTypeText = (type: string) => {
    switch (type) {
      case 'equipment':
        return 'Thiết bị';
      case 'booking':
        return 'Đặt thiết bị';
      case 'user':
        return 'Người dùng';
      case 'certificate':
        return 'Chứng chỉ';
      default:
        return type;
    }
  };

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'changedAt',
      key: 'changedAt',
      width: 180,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      title: 'Loại',
      dataIndex: 'entityType',
      key: 'entityType',
      width: 120,
      render: (type: string) => getEntityTypeText(type),
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (action: string) => (
        <Tag color={getActionColor(action)}>{getActionText(action)}</Tag>
      ),
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'changedBy',
      key: 'changedBy',
      width: 150,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Giá trị cũ',
      dataIndex: 'oldValue',
      key: 'oldValue',
      width: 200,
      ellipsis: true,
      render: (value: string) => value || '-',
    },
    {
      title: 'Giá trị mới',
      dataIndex: 'newValue',
      key: 'newValue',
      width: 200,
      ellipsis: true,
      render: (value: string) => value || '-',
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Lịch sử thay đổi</h2>
          <Select
            style={{ width: 200 }}
            placeholder="Lọc theo loại"
            allowClear
            value={entityType || undefined}
            onChange={(value) => setEntityType(value || '')}
          >
            <Option value="">Tất cả</Option>
            <Option value="equipment">Thiết bị</Option>
            <Option value="booking">Đặt thiết bị</Option>
            <Option value="user">Người dùng</Option>
            <Option value="certificate">Chứng chỉ</Option>
          </Select>
        </div>
      </Card>

      <Table
        columns={columns}
        dataSource={history}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default HistoryViewer;