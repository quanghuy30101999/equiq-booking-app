# Equiq Booking - Hệ thống quản lý đặt thiết bị

Ứng dụng React TypeScript quản lý đặt thiết bị với đầy đủ các tính năng theo Function List.

## Tính năng

### 1. Xác thực & Tài khoản
- ✅ Đăng nhập (2FA, SSO, SMS)
- ✅ Đăng ký tài khoản
- ✅ Quên mật khẩu / Reset mật khẩu
- ✅ Đổi mật khẩu
- ✅ Xem thông tin tài khoản
- ✅ Quản lý user & phân quyền (Admin/Individual)

### 2. Quản lý danh mục (Master Data)
- ✅ Quản lý danh sách nhân viên
- ✅ Quản lý danh mục công nhân
- ✅ Quản lý danh mục thiết bị

### 3. Quản lý lịch sử sử dụng thiết bị
- ✅ Xem danh sách đặt thiết bị
- ✅ Tạo yêu cầu đặt thiết bị
- ✅ Duyệt/chỉnh sửa/hủy đặt thiết bị
- ✅ Người dùng chỉnh sửa/hủy đặt của mình
- ✅ Xem chi tiết lịch sử thiết bị
- ✅ Giao diện "bảng điều phối trong ngày" với PC/Signage

### 4. Đính kèm bằng tiến độ công việc
- ✅ Upload bảng điểm (PDF/Excel/Ảnh)
- ✅ Hiển thị link/biểu tượng kèm theo

### 5. Thông báo Email
- ✅ Email khi tạo đặt thiết bị
- ✅ Email khi chỉnh sửa/hủy đặt thiết bị

### 6. Nhật ký/Lịch sử (Option)
- ✅ Xem lịch sử thay đổi dữ liệu (tạo/sửa/xóa)

## Công nghệ sử dụng

- React 18 + TypeScript
- React Router v6
- Ant Design (UI Components)
- Axios (API calls)
- Day.js (Date handling)
- React Hook Form (Form validation)

## Cài đặt

### Yêu cầu
- Node.js >= 14
- npm hoặc yarn

### Các bước cài đặt

1. Cài đặt dependencies:
\`\`\`bash
npm install
\`\`\`

2. File .env đã được tạo sẵn với cấu hình:
\`\`\`
REACT_APP_API_URL=http://localhost:3001/api
\`\`\`

3. Chạy ứng dụng với Mock API:

**Cách 1: Chạy cả Mock API và React App cùng lúc (Khuyến nghị)**
\`\`\`bash
npm run dev
\`\`\`

**Cách 2: Chạy riêng từng service**

Terminal 1 - Chạy Mock API Server:
\`\`\`bash
npm run mock-api
\`\`\`

Terminal 2 - Chạy React App:
\`\`\`bash
npm start
\`\`\`

Ứng dụng sẽ chạy tại:
- React App: [http://localhost:3000](http://localhost:3000)
- Mock API: [http://localhost:3001](http://localhost:3001)

### Tài khoản demo

Đăng nhập với các tài khoản có sẵn:

**Admin:**
- Email: \`admin@example.com\`
- Password: \`admin123\`
- Quyền: Quản lý toàn bộ hệ thống

**User:**
- Email: \`user@example.com\`
- Password: \`user123\`
- Quyền: Người dùng thông thường

## Build cho production

\`\`\`bash
npm run build
\`\`\`

Build folder sẽ được tạo trong thư mục \`build/\`

## Cấu trúc dự án

\`\`\`
src/
├── components/
│   ├── Auth/                 # Components xác thực
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ResetPassword.tsx
│   │   └── ChangePassword.tsx
│   ├── Master/              # Components quản lý danh mục
│   │   ├── EmployeeManagement.tsx
│   │   └── EquipmentManagement.tsx
│   ├── Equipment/           # Components đặt thiết bị
│   │   └── EquipmentBooking.tsx
│   ├── WorkCertificate/     # Components chứng chỉ công việc
│   │   └── CertificateUpload.tsx
│   └── Common/              # Components dùng chung
│       ├── MainLayout.tsx
│       ├── ProtectedRoute.tsx
│       └── HistoryViewer.tsx
├── contexts/                # React Context (Auth)
│   └── AuthContext.tsx
├── services/                # API Service Layer
│   ├── api.ts
│   ├── authService.ts
│   ├── masterService.ts
│   ├── equipmentService.ts
│   ├── certificateService.ts
│   └── historyService.ts
├── types/                   # TypeScript Types
│   └── index.ts
├── pages/                   # Pages
│   └── Dashboard.tsx
├── App.tsx                  # Main App với routing
└── index.tsx               # Entry point
\`\`\`

## API Endpoints (Backend yêu cầu)

### Authentication
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/reset-password
- POST /api/auth/change-password

### Master Data
- GET /api/master/employees
- POST /api/master/employees
- PUT /api/master/employees/:id
- DELETE /api/master/employees/:id

- GET /api/master/equipments
- POST /api/master/equipments
- PUT /api/master/equipments/:id
- DELETE /api/master/equipments/:id

### Equipment Booking
- GET /api/equipment/history
- POST /api/equipment/bookings
- PUT /api/equipment/bookings/:id
- DELETE /api/equipment/bookings/:id
- POST /api/equipment/bookings/:id/approve
- POST /api/equipment/bookings/:id/reject
- GET /api/equipment/my-bookings

### Work Certificates
- GET /api/certificates
- POST /api/certificates/upload
- DELETE /api/certificates/:id
- POST /api/certificates/:id/approve
- POST /api/certificates/:id/reject
- GET /api/certificates/my-certificates

### History
- GET /api/history
- GET /api/history/:entityType/:entityId

## Phân quyền

### Admin
- Toàn quyền truy cập tất cả tính năng
- Quản lý danh mục (nhân viên, thiết bị)
- Phê duyệt/từ chối đặt thiết bị
- Phê duyệt/từ chối chứng chỉ
- Xem toàn bộ lịch sử

### Individual
- Đăng nhập/Đăng ký
- Đặt thiết bị
- Xem/sửa/hủy đặt thiết bị của mình
- Tải lên chứng chỉ công việc
- Xem lịch sử thay đổi

## License

MIT