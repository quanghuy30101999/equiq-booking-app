import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Typography } from 'antd';
import {
  CalendarOutlined,
  FileOutlined,
  TeamOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { equipmentService } from '../services/equipmentService';
import { certificateService } from '../services/certificateService';
import { EquipmentUsageHistory, WorkCertificate } from '../types';
import dayjs from 'dayjs';
import JA from '../constants/ja';

const { Title } = Typography;

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
        return JA.booking.pending;
      case 'approved':
        return JA.booking.approved;
      case 'rejected':
        return JA.booking.rejected;
      case 'completed':
        return JA.booking.completed;
      default:
        return status;
    }
  };

  const bookingColumns = [
    {
      title: JA.booking.equipment,
      dataIndex: 'equipmentName',
      key: 'equipmentName',
    },
    {
      title: JA.booking.startDate,
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => dayjs(date).format('YYYY/MM/DD'),
    },
    {
      title: JA.booking.endDate,
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => dayjs(date).format('YYYY/MM/DD'),
    },
    {
      title: JA.booking.status,
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
  ];

  const certificateColumns = [
    {
      title: JA.certificate.fileName,
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: JA.certificate.uploadDate,
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      render: (date: string) => dayjs(date).format('YYYY/MM/DD'),
    },
    {
      title: JA.certificate.status,
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>
        <DashboardOutlined /> {JA.dashboard.title}
      </Title>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 16 }}>
        {JA.dashboard.welcomeBack}, {user?.name}!
      </p>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={JA.dashboard.totalBookings}
              value={myBookings.length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={JA.dashboard.pendingApprovals}
              value={myBookings.filter(b => b.status === 'pending').length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={JA.certificate.title}
              value={myCertificates.length}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={JA.user.role}
              value={user?.role === 'Admin' ? JA.user.admin : JA.user.individual}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title={JA.dashboard.recentBookings} style={{ marginBottom: 16 }}>
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
          <Card title={JA.dashboard.recentCertificates} style={{ marginBottom: 16 }}>
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
