import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import {
  CalendarOutlined,
  FileOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { equipmentService } from '../services/equipmentService';
import { certificateService } from '../services/certificateService';
import { EquipmentUsageHistory, WorkCertificate } from '../types';
import dayjs from 'dayjs';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [myBookings, setMyBookings] = useState<EquipmentUsageHistory[]>([]);
  const [myCertificates, setMyCertificates] = useState<WorkCertificate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [bookingsResponse, certificatesResponse] = await Promise.all([
        equipmentService.getMyBookings(),
        certificateService.getMyCertificates(),
      ]);

      if (bookingsResponse.success) {
        setMyBookings(bookingsResponse.data.slice(0, 5));
      }
      if (certificatesResponse.success) {
        setMyCertificates(certificatesResponse.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
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

  const bookingColumns = [
    {
      title: 'Thiết bị',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
  ];

  const certificateColumns = [
    {
      title: 'Tên file',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: 'Ngày tải lên',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
  ];

  return (
    <div>
      <h1>Chào mừng, {user?.name}!</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Đây là tổng quan về hoạt động của bạn trong hệ thống
      </p>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số đặt thiết bị"
              value={myBookings.length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang chờ duyệt"
              value={myBookings.filter(b => b.status === 'pending').length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chứng chỉ đã tải lên"
              value={myCertificates.length}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Vai trò"
              value={user?.role}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Đặt thiết bị gần đây" style={{ marginBottom: 16 }}>
            <Table
              columns={bookingColumns}
              dataSource={myBookings}
              rowKey="id"
              loading={loading}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Chứng chỉ gần đây" style={{ marginBottom: 16 }}>
            <Table
              columns={certificateColumns}
              dataSource={myCertificates}
              rowKey="id"
              loading={loading}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;