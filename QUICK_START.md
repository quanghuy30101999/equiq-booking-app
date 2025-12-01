# Quick Start - Equiq Booking App

## 🚀 Chạy ứng dụng ngay (với Mock API)

### Bước 1: Cài đặt dependencies

```bash
npm install
```

### Bước 2: Chạy ứng dụng

**Khuyến nghị: Chạy cả Mock API và React App cùng lúc**

```bash
npm run dev
```

Hoặc chạy riêng từng service:

**Terminal 1 - Mock API:**
```bash
npm run mock-api
```

**Terminal 2 - React App:**
```bash
npm start
```

### Bước 3: Mở trình duyệt

- **React App:** http://localhost:3000
- **Mock API:** http://localhost:3001

## 👤 Tài khoản đăng nhập

### Admin (Toàn quyền)
- **Email:** `admin@example.com`
- **Password:** `admin123`
- **Quyền hạn:**
  - Quản lý nhân viên
  - Quản lý thiết bị
  - Phê duyệt/từ chối đặt thiết bị
  - Phê duyệt/từ chối chứng chỉ
  - Xem toàn bộ lịch sử

### User (Người dùng thông thường)
- **Email:** `user@example.com`
- **Password:** `user123`
- **Quyền hạn:**
  - Đặt thiết bị
  - Xem/sửa/hủy đặt của mình
  - Tải lên chứng chỉ
  - Xem lịch sử

## 📝 Tính năng có sẵn

✅ **Đăng nhập/Đăng ký** - Hỗ trợ 2FA, SSO, SMS
✅ **Quản lý Nhân viên** - CRUD (Admin only)
✅ **Quản lý Thiết bị** - CRUD (Admin only)
✅ **Đặt thiết bị** - Tạo booking, chờ duyệt
✅ **Phê duyệt booking** - Admin duyệt/từ chối
✅ **Upload chứng chỉ** - PDF/Excel
✅ **Lịch sử thay đổi** - Audit log đầy đủ
✅ **Dashboard** - Tổng quan hoạt động

## 🔧 Mock API Endpoints

Tất cả API endpoints đã được mock sẵn tại `http://localhost:3001/api`:

- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/master/employees` - Danh sách nhân viên
- `GET /api/master/equipments` - Danh sách thiết bị
- `GET /api/equipment/history` - Lịch sử đặt thiết bị
- `GET /api/certificates` - Danh sách chứng chỉ
- `GET /api/history` - Lịch sử thay đổi

## 📦 Data mẫu

Mock data được lưu trong file `mock-db.json`:
- 2 users (admin + user)
- 3 employees
- 4 equipments
- 3 bookings
- 3 certificates
- 5 history records

Tất cả thay đổi qua API sẽ được lưu vào file này!

## 🎯 Test thử

1. Đăng nhập với `admin@example.com / admin123`
2. Vào **Quản lý danh mục** → **Thiết bị**
3. Thêm/sửa/xóa thiết bị
4. Vào **Đặt thiết bị** → Tạo booking mới
5. Phê duyệt booking vừa tạo
6. Xem **Lịch sử thay đổi**

Enjoy! 🎉