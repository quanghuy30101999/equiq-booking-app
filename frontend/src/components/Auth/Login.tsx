import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginCredentials } from '../../types';
import JA from '../../constants/ja';

const { Title } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: LoginCredentials) => {
    setLoading(true);
    try {
      const loggedInUser = await login(values);
      // Admin → Dashboard, Individual → Home
      if (loggedInUser.role === 'Admin') {
        navigate('/dashboard');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          {JA.auth.login}
        </Title>
        <Form
          name="login"
          initialValues={{ method: '2FA' }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="loginId"
            rules={[{ required: true, message: JA.auth.loginRequired }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={JA.auth.loginId}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: JA.auth.passwordRequired }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={JA.auth.password}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              {JA.auth.login}
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Link to="/register">{JA.auth.register}</Link>
            <span style={{ margin: '0 8px' }}>|</span>
            <Link to="/reset-password">{JA.auth.forgotPassword}</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;