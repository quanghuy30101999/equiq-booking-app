# Hướng Dẫn Monorepo - Equiq Booking App

## Cấu trúc dự án

Dự án đã được tách thành cấu trúc monorepo với 2 workspace riêng biệt:

```
equiq-booking-app/
├── backend/              # Mock API Server (Express)
│   ├── mock-server.js
│   ├── mock-db.json
│   └── package.json
├── frontend/             # React Application
│   ├── src/
│   ├── public/
│   ├── .env
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
├── package.json          # Root package (quản lý cả 2)
└── README.md
```

## Cài đặt

### Cài đặt tất cả dependencies

Từ thư mục gốc:

```bash
npm install
```

Lệnh này sẽ tự động cài đặt dependencies cho cả backend và frontend nhờ npm workspaces.

### Cài đặt riêng lẻ

Nếu muốn cài đặt riêng:

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## Chạy ứng dụng

### Chạy cả Backend và Frontend cùng lúc

```bash
npm run dev
```

### Chạy riêng Backend

```bash
npm run start:backend
```

Backend sẽ chạy tại: http://localhost:3001

### Chạy riêng Frontend

```bash
npm run start:frontend
```

Frontend sẽ chạy tại: http://localhost:3000

## Scripts có sẵn

Từ thư mục gốc:

- `npm run dev` - Chạy cả backend và frontend
- `npm run start:backend` - Chỉ chạy backend
- `npm run start:frontend` - Chỉ chạy frontend
- `npm run build` - Build frontend cho production
- `npm run test` - Chạy tests của frontend

## API Endpoints

Backend mock cung cấp các endpoints sau:

- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/master/employees` - Danh sách nhân viên
- `GET /api/master/equipments` - Danh sách thiết bị
- `GET /api/equipment/history` - Lịch sử đặt thiết bị
- `GET /api/certificates` - Danh sách chứng chỉ
- `GET /api/history` - Lịch sử hoạt động

## Tài khoản demo

- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## Cấu hình môi trường

### Frontend

Tạo file `.env` trong thư mục `frontend/` (hoặc copy từ `.env.example`):

```
REACT_APP_API_URL=http://localhost:3001/api
```

Để deploy production, thay đổi URL tương ứng.

## Deploy

### Heroku

File `Procfile` đã được cập nhật để chạy backend:

```
web: node backend/mock-server.js
```

Để deploy cả frontend lên Heroku, bạn có thể:
1. Deploy backend và frontend riêng lẻ trên 2 Heroku apps
2. Hoặc setup để serve static files từ backend

## Lợi ích của cấu trúc Monorepo

1. **Tách biệt rõ ràng**: Backend và Frontend có dependencies riêng
2. **Dễ quản lý**: Tất cả code trong 1 repository
3. **Linh hoạt**: Có thể chạy riêng lẻ hoặc cùng lúc
4. **Scalable**: Dễ dàng thêm workspace mới (mobile app, admin panel, etc.)

## Troubleshooting

### Backend không kết nối được với database mock

Kiểm tra file `backend/mock-db.json` có tồn tại không.

### Frontend không gọi được API

1. Kiểm tra file `frontend/.env` có đúng URL backend không
2. Đảm bảo backend đang chạy trước khi start frontend
3. Kiểm tra CORS settings trong `backend/mock-server.js`

### Lỗi khi cài đặt dependencies

Xóa tất cả `node_modules` và `package-lock.json`, sau đó chạy lại:

```bash
rm -rf node_modules backend/node_modules frontend/node_modules package-lock.json
npm install
```
