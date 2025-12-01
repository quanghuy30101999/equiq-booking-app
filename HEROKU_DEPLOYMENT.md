# Hướng dẫn Deploy Backend lên Heroku

## Chuẩn bị

### 1. Cài đặt Heroku CLI
```bash
# Ubuntu/Debian
curl https://cli-assets.heroku.com/install.sh | sh

# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Download từ: https://devcenter.heroku.com/articles/heroku-cli
```

### 2. Đăng nhập Heroku
```bash
heroku login
```

## Các bước Deploy

### Bước 1: Di chuyển vào thư mục project
```bash
cd /home/quanghuy/equiq-booking/equiq-booking-app
```

### Bước 2: Khởi tạo Git repository (nếu chưa có)
```bash
git init
git add .
git commit -m "Initial commit for Heroku deployment"
```

### Bước 3: Tạo ứng dụng Heroku
```bash
heroku create equiq-booking-api
# Hoặc để Heroku tự động tạo tên:
# heroku create
```

### Bước 4: Di chuyển mock-db.json để không bị mất dữ liệu khi deploy
**Lưu ý:** Heroku sử dụng ephemeral filesystem, nghĩa là file system sẽ reset sau mỗi 24h hoặc khi restart.

Để giữ dữ liệu lâu dài, bạn nên:
- Sử dụng database thực (PostgreSQL, MongoDB, etc.)
- Hoặc chấp nhận dữ liệu sẽ reset định kỳ (OK cho môi trường test)

### Bước 5: Deploy lên Heroku
```bash
git push heroku master
# Hoặc nếu dùng branch main:
# git push heroku main
```

### Bước 6: Kiểm tra logs
```bash
heroku logs --tail
```

### Bước 7: Mở ứng dụng
```bash
heroku open
```

## Cấu hình Frontend để kết nối với Heroku Backend

### Cập nhật file .env trong project của bạn:
```bash
# Thay YOUR_APP_NAME bằng tên Heroku app của bạn
REACT_APP_API_URL=https://YOUR_APP_NAME.herokuapp.com
```

### Hoặc cập nhật trong src/services/api.ts (hoặc file config API):
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://YOUR_APP_NAME.herokuapp.com';
```

## Chạy Frontend local với Backend trên Heroku

### Bước 1: Cập nhật API URL trong .env
```bash
echo "REACT_APP_API_URL=https://YOUR_APP_NAME.herokuapp.com" > .env
```

### Bước 2: Chạy Frontend
```bash
npm run start-fe
```

## Các lệnh Heroku hữu ích

```bash
# Xem danh sách apps
heroku apps

# Xem logs real-time
heroku logs --tail

# Restart app
heroku restart

# Xem thông tin app
heroku info

# Mở app trong browser
heroku open

# Xem các biến môi trường
heroku config

# Set biến môi trường
heroku config:set KEY=VALUE

# Xóa app
heroku apps:destroy --app APP_NAME --confirm APP_NAME
```

## URL của API sau khi deploy

Sau khi deploy thành công, API sẽ có URL dạng:
```
https://YOUR_APP_NAME.herokuapp.com
```

Các endpoints:
- POST https://YOUR_APP_NAME.herokuapp.com/api/auth/login
- POST https://YOUR_APP_NAME.herokuapp.com/api/auth/register
- GET  https://YOUR_APP_NAME.herokuapp.com/api/master/employees
- GET  https://YOUR_APP_NAME.herokuapp.com/api/master/equipments
- GET  https://YOUR_APP_NAME.herokuapp.com/api/equipment/history
- GET  https://YOUR_APP_NAME.herokuapp.com/api/certificates
- GET  https://YOUR_APP_NAME.herokuapp.com/api/history

## Test API sau khi deploy

```bash
# Test endpoint login
curl -X POST https://YOUR_APP_NAME.herokuapp.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"loginId":"admin@example.com","password":"admin123"}'
```

## Troubleshooting

### Lỗi: Application error
```bash
# Kiểm tra logs
heroku logs --tail
```

### Lỗi: Port binding
Đảm bảo trong code đã sử dụng `process.env.PORT`:
```javascript
const PORT = process.env.PORT || 3001;
```

### Lỗi: Missing dependencies
```bash
# Đảm bảo cors và express trong dependencies (không phải devDependencies)
npm install --save express cors
git add package.json package-lock.json
git commit -m "Move express and cors to dependencies"
git push heroku master
```

## Di chuyển dependencies

Hiện tại `express` và `cors` đang ở trong `devDependencies`, cần di chuyển sang `dependencies`:

```bash
npm install --save express cors
npm uninstall --save-dev express cors
```

Sau đó commit và push lại:
```bash
git add package.json package-lock.json
git commit -m "Move express and cors to dependencies"
git push heroku master
```
