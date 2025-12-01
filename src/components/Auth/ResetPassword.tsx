import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const { Title, Text } = Typography;

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      const response = await authService.resetPassword(values.email);
      if (response.success) {
        message.success('Email đặt lại mật khẩu đã được gửi!');
        setSent(true);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Gửi email thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>
          Đặt lại mật khẩu
        </Title>
        <Text style={{ display: 'block', textAlign: 'center', marginBottom: 32, color: '#666' }}>
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu
        </Text>

        {!sent ? (
          <Form name="reset-password" onFinish={onFinish} layout="vertical">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block size="large">
                Gửi email đặt lại mật khẩu
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login">Quay lại đăng nhập</Link>
            </div>
          </Form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <Text style={{ color: '#52c41a', fontSize: 16 }}>
              Email đã được gửi! Vui lòng kiểm tra hộp thư của bạn.
            </Text>
            <div style={{ marginTop: 24 }}>
              <Link to="/login">Quay lại đăng nhập</Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;