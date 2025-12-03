# DANH SÁCH CHỨC NĂNG - ECOMOTT EQUIPMENT BOOKING SYSTEM

**Tổng số:** 33 chức năng  
**Vai trò:** Admin, Individual User

---

## NHÓM 1: LOGIN/LOGOUT SCREEN

| STT | Mã CN | Tên chức năng | Admin | Individual | Ưu tiên | Chi phí |
|-----|-------|---------------|-------|------------|---------|---------|
| 1 | 1.1 | Đăng nhập | X | X | HIGH | MEDIUM |
| 2 | 1.3 | Quên mật khẩu / Reset mật khẩu | X | X | MEDIUM | LOW |
| 3 | 1.2 | Đăng xuất | X | X | HIGH | LOW |

---

## NHÓM 2: PROFILE/MY ACCOUNT

| STT | Mã CN | Tên chức năng | Admin | Individual | Ưu tiên | Chi phí |
|-----|-------|---------------|-------|------------|---------|---------|
| 4 | 2.1 | Xem thông tin tài khoản | X | X | HIGH | LOW |
| 5 | 2.2 | Edit Profile | X | X | MEDIUM | LOW |
| 6 | 2.3 | Đổi mật khẩu | X | X | MEDIUM | LOW |

---

## NHÓM 3: USER ACCOUNT MANAGEMENT (ADMIN)

| STT | Mã CN | Tên chức năng | Admin | Individual | Ưu tiên | Chi phí |
|-----|-------|---------------|-------|------------|---------|---------|
| 7 | 3.1 | Xem danh sách user | X | - | HIGH | MEDIUM |
| 8 | 3.2 | Tạo user mới & phân quyền | X | - | HIGH | MEDIUM |
| 9 | 3.3 | Chỉnh sửa user & quyền | X | - | HIGH | MEDIUM |
| 10 | 3.4 | Reset mật khẩu tạm | X | - | MEDIUM | LOW |

---

## NHÓM 4: HOME (INDIVIDUAL)

| STT | Mã CN | Tên chức năng | Admin | Individual | Ưu tiên | Chi phí |
|-----|-------|---------------|-------|------------|---------|---------|
| 11 | 4.1 | Xem Home (Individual) | - | X | HIGH | HIGH |

**Mô tả:** Màn hình chính sau khi đăng nhập với:
- Lịch thiết bị dạng Calendar View
- Truy cập nhanh My Bookings
- Timeline sử dụng thiết bị trong ngày

---

## NHÓM 5: MANAGER DASHBOARD (ADMIN)

| STT | Mã CN | Tên chức năng | Admin | Individual | Ưu tiên | Chi phí |
|-----|-------|---------------|-------|------------|---------|---------|
| 12 | 5.1 | Xem Dashboard tổng quan | X | - | MEDIUM | MEDIUM |

**Mô tả:** Tổng quan: số booking, thiết bị đang dùng/trống, đơn chờ phê duyệt

---

## NHÓM 6: EQUIPMENT SCHEDULE

| STT | Mã CN | Tên chức năng | Admin | Individual | Ưu tiên | Chi phí |
|-----|-------|---------------|-------|------------|---------|---------|
| 13 | 6.1 | Xem lịch thiết bị (calendar) | X | X | HIGH | HIGH |
| 14 | 6.2 | Xem lịch theo ngày (list) | X | - | HIGH | HIGH |
| 15 | 6.3 | Xem lịch (Board Mode - Signage) | X | - | HIGH | MEDIUM |

---

## NHÓM 7: BOOKING MANAGEMENT

| STT | Mã CN | Tên chức năng | Admin | Individual | Ưu tiên | Chi phí |
|-----|-------|---------------|-------|------------|---------|---------|
| 16 | 7.1 | Xem danh sách booking | X | X | HIGH | MEDIUM |
| 17 | 7.2 | Chỉnh sửa booking | X | X | HIGH | MEDIUM |
| 18 | 7.3 | Huỷ booking | X | X | HIGH | MEDIUM |
| 19 | 7.4 | Tạo booking | X | X | HIGH | MEDIUM |
| 20 | 7.5 | Lưu nháp booking (Save Draft) | X | X | LOW | MEDIUM |
| 21 | 7.6 | Duplicate/Copy Booking | X | X | LOW | MEDIUM |
| 22 | 7.7 | Approve đặt thiết bị | X | - | HIGH | MEDIUM |
| 23 | 7.8 | Reject đặt thiết bị | X | - | HIGH | MEDIUM |
| 24 | 7.10 | Xem chi tiết booking | X | X | HIGH | MEDIUM |
| 25 | 7.11 | Export Booking List (CSV/Excel/PDF) | X | - | MEDIUM | HIGH |

---

## NHÓM 8: THÔNG BÁO

| STT | Mã CN | Tên chức năng | Admin | Individual | Ưu tiên | Chi phí |
|-----|-------|---------------|-------|------------|---------|---------|
| 26 | 8.1 | Email khi tạo booking | X | X | HIGH | MEDIUM |
| 27 | 8.2 | Email khi chỉnh sửa/huỷ booking | X | X | HIGH | MEDIUM |
| 28 | 8.3 | Notification Bell | X | X | LOW | MEDIUM |
| 29 | 8.4 | Đánh dấu đã đọc thông báo | X | X | LOW | LOW |

---

## NHÓM 9: QUẢN LÝ DANH MỤC (MASTER)

| STT | Mã CN | Tên chức năng | Admin | Individual | Ưu tiên | Chi phí |
|-----|-------|---------------|-------|------------|---------|---------|
| 30 | 9.1 | Quản lý danh sách thiết bị (重機) | X | - | HIGH | MEDIUM |
| 31 | 9.2 | Quản lý danh mục nhà thầu (ゼネコン) | X | - | HIGH | LOW |

---

## NHÓM 10: ĐÍNH KÈM BẢNG TIẾN ĐỘ (工程表)

| STT | Mã CN | Tên chức năng | Admin | Individual | Ưu tiên | Chi phí |
|-----|-------|---------------|-------|------------|---------|---------|
| 32 | 10.1 | Upload bảng tiến độ theo ngày | X | - | LOW | MEDIUM |
| 33 | 10.2 | Quản lý 工程表 | X | - | LOW | LOW |

---

## THỐNG KÊ

### Phân bố theo vai trò:
- **Admin Only:** 15 chức năng
- **Individual Only:** 1 chức năng
- **Cả Admin & Individual:** 17 chức năng

### Phân bố theo độ ưu tiên:
- **HIGH:** 21 chức năng
- **MEDIUM:** 7 chức năng
- **LOW:** 5 chức năng

### Phân bố theo chi phí:
- **HIGH:** 5 chức năng
- **MEDIUM:** 20 chức năng
- **LOW:** 8 chức năng

---

## CHÚ THÍCH CHI PHÍ

- **LOW:** 1-3 ngày code (Chức năng nhỏ, ít màn hình, logic đơn giản)
- **MEDIUM:** 4-8 ngày code (Nhiều bước, 1-2 màn hình, xử lý validation/logic)
- **HIGH:** >8 ngày code (Chức năng lớn, nhiều logic, nhiều màn hình, workflow phức tạp)
