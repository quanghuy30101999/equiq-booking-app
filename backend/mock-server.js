const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS to allow frontend from any origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Load mock data
let mockData = JSON.parse(fs.readFileSync(path.join(__dirname, 'mock-db.json'), 'utf-8'));

// Save data function
const saveData = () => {
  fs.writeFileSync(path.join(__dirname, 'mock-db.json'), JSON.stringify(mockData, null, 2));
};

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { loginId, password } = req.body;
  const user = mockData.users.find(u => u.email === loginId);

  if (user && user.password === password) {
    const token = 'mock-jwt-token-' + user.id;
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt
        },
        token
      },
      message: 'Đăng nhập thành công'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Email hoặc mật khẩu không đúng'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name, role } = req.body;

  const existingUser = mockData.users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email đã được sử dụng'
    });
  }

  const newUser = {
    id: String(Date.now()),
    email,
    password,
    name,
    role: role || 'Individual',
    createdAt: new Date().toISOString()
  };

  mockData.users.push(newUser);
  saveData();

  const token = 'mock-jwt-token-' + newUser.id;
  res.json({
    success: true,
    data: {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        createdAt: newUser.createdAt
      },
      token
    },
    message: 'Đăng ký thành công'
  });
});

app.post('/api/auth/reset-password', (req, res) => {
  res.json({
    success: true,
    message: 'Email đặt lại mật khẩu đã được gửi'
  });
});

app.post('/api/auth/change-password', (req, res) => {
  res.json({
    success: true,
    message: 'Đổi mật khẩu thành công'
  });
});

// Master - Employees
app.get('/api/master/employees', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const total = mockData.employees.length;
  const start = (page - 1) * pageSize;
  const items = mockData.employees.slice(start, start + pageSize);

  res.json({
    success: true,
    data: { items, total, page, pageSize }
  });
});

app.get('/api/master/employees/:id', (req, res) => {
  const employee = mockData.employees.find(e => e.id === req.params.id);

  if (employee) {
    res.json({ success: true, data: employee });
  } else {
    res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên' });
  }
});

app.post('/api/master/employees', (req, res) => {
  const newEmployee = {
    id: String(Date.now()),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mockData.employees.push(newEmployee);
  saveData();

  res.json({ success: true, data: newEmployee, message: 'Thêm nhân viên thành công' });
});

app.put('/api/master/employees/:id', (req, res) => {
  const index = mockData.employees.findIndex(e => e.id === req.params.id);

  if (index !== -1) {
    mockData.employees[index] = {
      ...mockData.employees[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    saveData();
    res.json({ success: true, data: mockData.employees[index], message: 'Cập nhật nhân viên thành công' });
  } else {
    res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên' });
  }
});

app.delete('/api/master/employees/:id', (req, res) => {
  mockData.employees = mockData.employees.filter(e => e.id !== req.params.id);
  saveData();
  res.json({ success: true, message: 'Xóa nhân viên thành công' });
});

// Master - Equipments
app.get('/api/master/equipments', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const total = mockData.equipments.length;
  const start = (page - 1) * pageSize;
  const items = mockData.equipments.slice(start, start + pageSize);

  res.json({
    success: true,
    data: { items, total, page, pageSize }
  });
});

app.get('/api/master/equipments/:id', (req, res) => {
  const equipment = mockData.equipments.find(e => e.id === req.params.id);

  if (equipment) {
    res.json({ success: true, data: equipment });
  } else {
    res.status(404).json({ success: false, message: 'Không tìm thấy thiết bị' });
  }
});

app.post('/api/master/equipments', (req, res) => {
  const newEquipment = {
    id: String(Date.now()),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mockData.equipments.push(newEquipment);
  saveData();

  res.json({ success: true, data: newEquipment, message: 'Thêm thiết bị thành công' });
});

app.put('/api/master/equipments/:id', (req, res) => {
  const index = mockData.equipments.findIndex(e => e.id === req.params.id);

  if (index !== -1) {
    mockData.equipments[index] = {
      ...mockData.equipments[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    saveData();
    res.json({ success: true, data: mockData.equipments[index], message: 'Cập nhật thiết bị thành công' });
  } else {
    res.status(404).json({ success: false, message: 'Không tìm thấy thiết bị' });
  }
});

app.delete('/api/master/equipments/:id', (req, res) => {
  mockData.equipments = mockData.equipments.filter(e => e.id !== req.params.id);
  saveData();
  res.json({ success: true, message: 'Xóa thiết bị thành công' });
});

// Equipment Bookings
app.get('/api/equipment/history', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const total = mockData.bookings.length;
  const start = (page - 1) * pageSize;
  const items = mockData.bookings.slice(start, start + pageSize);

  res.json({
    success: true,
    data: { items, total, page, pageSize }
  });
});

app.get('/api/equipment/my-bookings', (req, res) => {
  const bookings = mockData.bookings.filter(b => b.userId === '2');
  res.json({ success: true, data: bookings });
});

// Get ALL bookings (for calendar view)
app.get('/api/equipment/bookings', (req, res) => {
  res.json({ success: true, data: mockData.bookings });
});

app.post('/api/equipment/bookings', (req, res) => {
  const { equipmentId, startDate, endDate, purpose } = req.body;
  const equipment = mockData.equipments.find(e => e.id === equipmentId);

  const newBooking = {
    id: String(Date.now()),
    equipmentId,
    equipmentName: equipment?.name || 'Unknown Equipment',
    userId: '2',
    userName: 'Normal User',
    startDate,
    endDate,
    purpose,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mockData.bookings.push(newBooking);
  saveData();

  res.json({ success: true, data: newBooking, message: 'Đặt thiết bị thành công' });
});

// Update booking (for drag-and-drop)
app.put('/api/equipment/bookings/:id', (req, res) => {
  const index = mockData.bookings.findIndex(b => b.id === req.params.id);

  if (index !== -1) {
    mockData.bookings[index] = {
      ...mockData.bookings[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    saveData();
    res.json({ success: true, data: mockData.bookings[index], message: 'Cập nhật booking thành công' });
  } else {
    res.status(404).json({ success: false, message: 'Không tìm thấy booking' });
  }
});

app.post('/api/equipment/bookings/:id/approve', (req, res) => {
  const index = mockData.bookings.findIndex(b => b.id === req.params.id);

  if (index !== -1) {
    mockData.bookings[index].status = 'approved';
    mockData.bookings[index].updatedAt = new Date().toISOString();
    saveData();
    res.json({ success: true, data: mockData.bookings[index], message: 'Phê duyệt thành công' });
  } else {
    res.status(404).json({ success: false, message: 'Không tìm thấy booking' });
  }
});

app.post('/api/equipment/bookings/:id/reject', (req, res) => {
  const index = mockData.bookings.findIndex(b => b.id === req.params.id);

  if (index !== -1) {
    mockData.bookings[index].status = 'rejected';
    mockData.bookings[index].updatedAt = new Date().toISOString();
    saveData();
    res.json({ success: true, data: mockData.bookings[index], message: 'Từ chối thành công' });
  } else {
    res.status(404).json({ success: false, message: 'Không tìm thấy booking' });
  }
});

app.delete('/api/equipment/bookings/:id', (req, res) => {
  mockData.bookings = mockData.bookings.filter(b => b.id !== req.params.id);
  saveData();
  res.json({ success: true, message: 'Xóa đặt thiết bị thành công' });
});

// Certificates
app.get('/api/certificates', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const total = mockData.certificates.length;
  const start = (page - 1) * pageSize;
  const items = mockData.certificates.slice(start, start + pageSize);

  res.json({
    success: true,
    data: { items, total, page, pageSize }
  });
});

app.get('/api/certificates/my-certificates', (req, res) => {
  const certificates = mockData.certificates.filter(c => c.userId === '2');
  res.json({ success: true, data: certificates });
});

app.post('/api/certificates/upload', (req, res) => {
  const newCertificate = {
    id: String(Date.now()),
    userId: '2',
    userName: 'Normal User',
    fileName: req.body.fileName || 'uploaded-file.pdf',
    fileUrl: 'https://example.com/files/' + Date.now() + '.pdf',
    fileType: 'application/pdf',
    uploadDate: new Date().toISOString(),
    status: 'pending'
  };

  mockData.certificates.push(newCertificate);
  saveData();

  res.json({ success: true, data: newCertificate, message: 'Tải lên thành công' });
});

app.post('/api/certificates/:id/approve', (req, res) => {
  const index = mockData.certificates.findIndex(c => c.id === req.params.id);

  if (index !== -1) {
    mockData.certificates[index].status = 'approved';
    saveData();
    res.json({ success: true, data: mockData.certificates[index], message: 'Phê duyệt thành công' });
  } else {
    res.status(404).json({ success: false, message: 'Không tìm thấy certificate' });
  }
});

app.post('/api/certificates/:id/reject', (req, res) => {
  const index = mockData.certificates.findIndex(c => c.id === req.params.id);

  if (index !== -1) {
    mockData.certificates[index].status = 'rejected';
    saveData();
    res.json({ success: true, data: mockData.certificates[index], message: 'Từ chối thành công' });
  } else {
    res.status(404).json({ success: false, message: 'Không tìm thấy certificate' });
  }
});

app.delete('/api/certificates/:id', (req, res) => {
  mockData.certificates = mockData.certificates.filter(c => c.id !== req.params.id);
  saveData();
  res.json({ success: true, message: 'Xóa chứng chỉ thành công' });
});

// History
app.get('/api/history', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const entityType = req.query.entityType;

  let history = mockData.history;

  if (entityType) {
    history = history.filter(h => h.entityType === entityType);
  }

  const total = history.length;
  const start = (page - 1) * pageSize;
  const items = history.slice(start, start + pageSize);

  res.json({
    success: true,
    data: { items, total, page, pageSize }
  });
});

app.get('/api/history/:entityType/:entityId', (req, res) => {
  const history = mockData.history.filter(h =>
    h.entityType === req.params.entityType && h.entityId === req.params.entityId
  );

  res.json({ success: true, data: history });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Mock API Server đang chạy tại http://localhost:${PORT}`);
  console.log('\nEndpoints:');
  console.log('  - POST http://localhost:3001/api/auth/login');
  console.log('  - POST http://localhost:3001/api/auth/register');
  console.log('  - GET  http://localhost:3001/api/master/employees');
  console.log('  - GET  http://localhost:3001/api/master/equipments');
  console.log('  - GET  http://localhost:3001/api/equipment/history');
  console.log('  - GET  http://localhost:3001/api/certificates');
  console.log('  - GET  http://localhost:3001/api/history');
  console.log('\n📝 Demo accounts:');
  console.log('  Admin: admin@example.com / admin123');
  console.log('  User:  user@example.com / user123');
  console.log('');
});