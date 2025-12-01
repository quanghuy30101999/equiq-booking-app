import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Typography } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileOutlined,
  HistoryOutlined,
  UserOutlined,
  LogoutOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'change-password',
      icon: <LockOutlined />,
      label: 'Đổi mật khẩu',
      onClick: () => navigate('/change-password'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    ...(user?.role === 'Admin'
      ? [
          {
            key: 'master',
            icon: <TeamOutlined />,
            label: 'Quản lý danh mục',
            children: [
              {
                key: '/master/employees',
                label: 'Nhân viên',
                onClick: () => navigate('/master/employees'),
              },
              {
                key: '/master/equipments',
                label: 'Thiết bị',
                onClick: () => navigate('/master/equipments'),
              },
            ],
          },
        ]
      : []),
    {
      key: '/equipment/booking',
      icon: <CalendarOutlined />,
      label: 'Đặt thiết bị',
      onClick: () => navigate('/equipment/booking'),
    },
    {
      key: '/certificates',
      icon: <FileOutlined />,
      label: 'Chứng chỉ công việc',
      onClick: () => navigate('/certificates'),
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: 'Lịch sử thay đổi',
      onClick: () => navigate('/history'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: collapsed ? 16 : 20,
            fontWeight: 'bold',
          }}
        >
          {collapsed ? 'EB' : 'Equiq Booking'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong style={{ fontSize: 18 }}>
            Hệ thống quản lý đặt thiết bị
          </Text>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
              <div>
                <div>{user?.name}</div>
                <div style={{ fontSize: 12, color: '#999' }}>{user?.role}</div>
              </div>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;