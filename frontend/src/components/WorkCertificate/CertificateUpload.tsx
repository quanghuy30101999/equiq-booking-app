import React, { useState, useEffect } from 'react';
import { Table, Button, Upload, Modal, Space, message, Tag, Progress, Popconfirm } from 'antd';
import { UploadOutlined, EyeOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { certificateService } from '../../services/certificateService';
import { WorkCertificate } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import dayjs from 'dayjs';

const CertificateUpload: React.FC = () => {
  const [certificates, setCertificates] = useState<WorkCertificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const { user } = useAuth();

  useEffect(() => {
    fetchCertificates(1, 10);
  }, []);

  const fetchCertificates = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await certificateService.getCertificates(page, pageSize);
      if (response.success) {
        setCertificates(response.data.items);
        setPagination({
          current: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        });
      }
    } catch (error: any) {
      message.error('Tải danh sách chứng chỉ thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination: any) => {
    fetchCertificates(pagination.current, pagination.pageSize);
  };

  const handleUpload = async (file: File) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!allowedTypes.includes(file.type)) {
      message.error('Chỉ hỗ trợ file PDF và Excel!');
      return false;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const response = await certificateService.uploadCertificate(file, (progress) => {
        setUploadProgress(progress);
      });

      if (response.success) {
        message.success('Tải lên chứng chỉ thành công!');
        fetchCertificates(pagination.current, pagination.pageSize);
        setUploadProgress(0);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Tải lên thất bại!');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }

    return false;
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await certificateService.deleteCertificate(id);
      if (response.success) {
        message.success('Xóa chứng chỉ thành công!');
        fetchCertificates(pagination.current, pagination.pageSize);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Xóa thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setLoading(true);
      const response = await certificateService.approveCertificate(id);
      if (response.success) {
        message.success('Phê duyệt thành công!');
        fetchCertificates(pagination.current, pagination.pageSize);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Phê duyệt thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    Modal.confirm({
      title: 'Lý do từ chối',
      content: (
        <textarea
          id="rejectReason"
          placeholder="Nhập lý do từ chối..."
          style={{ width: '100%', minHeight: 100 }}
        />
      ),
      onOk: async () => {
        const reason = (document.getElementById('rejectReason') as HTMLTextAreaElement)?.value;
        if (!reason) {
          message.warning('Vui lòng nhập lý do từ chối!');
          return;
        }

        try {
          setLoading(true);
          const response = await certificateService.rejectCertificate(id, reason);
          if (response.success) {
            message.success('Đã từ chối!');
            fetchCertificates(pagination.current, pagination.pageSize);
          }
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Từ chối thất bại!');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleView = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'blue';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
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
      default:
        return status;
    }
  };

  const columns = [
    {
      title: 'Tên file',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: 'Người tải lên',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Loại file',
      dataIndex: 'fileType',
      key: 'fileType',
    },
    {
      title: 'Ngày tải lên',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: WorkCertificate) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record.fileUrl)}
          >
            Xem
          </Button>
          {user?.role === 'Admin' && record.status === 'pending' && (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
              >
                Duyệt
              </Button>
              <Button
                type="link"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject(record.id)}
              >
                Từ chối
              </Button>
            </>
          )}
          {(user?.role === 'Admin' || record.userId === user?.id) && (
            <Popconfirm
              title="Bạn có chắc muốn xóa chứng chỉ này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Quản lý chứng chỉ công việc</h2>
        <Upload
          beforeUpload={handleUpload}
          showUploadList={false}
          accept=".pdf,.xlsx,.xls"
        >
          <Button type="primary" icon={<UploadOutlined />} loading={loading}>
            Tải lên chứng chỉ
          </Button>
        </Upload>
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <Progress percent={uploadProgress} style={{ marginBottom: 16 }} />
      )}

      <Table
        columns={columns}
        dataSource={certificates}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default CertificateUpload;