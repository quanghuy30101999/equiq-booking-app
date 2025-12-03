import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Typography, Badge } from 'antd';
import {
  HomeOutlined,
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileOutlined,
  HistoryOutlined,
  UserOutlined,
  LogoutOutlined,
  LockOutlined,
  ToolOutlined,
  BellOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import JA from '../../constants/ja';

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
      label: JA.profile.viewProfile,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'change-password',
      icon: <LockOutlined />,
      label: JA.auth.changePassword,
      onClick: () => navigate('/change-password'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: JA.auth.logout,
      onClick: handleLogout,
    },
  ];

  // Menu cho Admin
  const adminMenuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: JA.nav.dashboard,
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'master',
      icon: <TeamOutlined />,
      label: JA.nav.master,
      children: [
        {
          key: '/master/users',
          label: JA.nav.users,
          onClick: () => navigate('/master/users'),
        },
        {
          key: '/master/employees',
          label: JA.nav.employees,
          onClick: () => navigate('/master/employees'),
        },
        {
          key: '/master/equipments',
          label: JA.nav.equipments,
          onClick: () => navigate('/master/equipments'),
        },
        {
          key: '/master/contractors',
          label: JA.nav.contractors,
          onClick: () => navigate('/master/contractors'),
        },
      ],
    },
    {
      key: 'schedule',
      icon: <CalendarOutlined />,
      label: JA.nav.schedule,
      children: [
        {
          key: '/equipment/booking',
          label: JA.nav.bookingList,
          onClick: () => navigate('/equipment/booking'),
        },
        {
          key: '/equipment/calendar',
          label: JA.nav.calendar,
          onClick: () => navigate('/equipment/calendar'),
        },
        {
          key: '/equipment/board',
          label: JA.nav.boardMode,
          onClick: () => navigate('/equipment/board'),
        },
      ],
    },
    {
      key: '/certificates',
      icon: <FileOutlined />,
      label: JA.nav.certificates,
      onClick: () => navigate('/certificates'),
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: JA.nav.history,
      onClick: () => navigate('/history'),
    },
  ];

  // Menu cho Individual
  const individualMenuItems = [
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: JA.nav.home,
      onClick: () => navigate('/home'),
    },
    {
      key: '/equipment/booking',
      icon: <CalendarOutlined />,
      label: JA.nav.myBookings,
      onClick: () => navigate('/equipment/booking'),
    },
    {
      key: '/equipment/calendar',
      icon: <CalendarOutlined />,
      label: JA.nav.calendar,
      onClick: () => navigate('/equipment/calendar'),
    },
    {
      key: '/certificates',
      icon: <FileOutlined />,
      label: JA.nav.certificates,
      onClick: () => navigate('/certificates'),
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: JA.nav.history,
      onClick: () => navigate('/history'),
    },
  ];

  const menuItems = user?.role === 'Admin' ? adminMenuItems : individualMenuItems;

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
          {collapsed ? '重機' : '重機予約システム'}
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
            重機予約管理システム
          </Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Badge count={0} showZero={false}>
              <BellOutlined
                style={{ fontSize: 20, cursor: 'pointer' }}
                onClick={() => navigate('/notifications')}
              />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                <div>
                  <div>{user?.name}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>
                    {user?.role === 'Admin' ? JA.user.admin : JA.user.individual}
                  </div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
