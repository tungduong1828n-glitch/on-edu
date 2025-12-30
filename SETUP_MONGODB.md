# Hướng dẫn Cài đặt MongoDB trên Windows

Để ứng dụng hoạt động, bạn cần cài đặt MongoDB làm cơ sở dữ liệu.

## Cách 1: Cài đặt trực tiếp (Khuyên dùng)

1.  **Tải xuống**:
    *   Truy cập trang [MongoDB Community Server Download](https://www.mongodb.com/try/download/community).
    *   Chọn tab **On-premises**.
    *   Chọn Version mới nhất (Current).
    *   Platform: Windows x64.
    *   Package: MSI.
    *   Nhấn **Download**.

2.  **Cài đặt**:
    *   Chạy file `.msi` vừa tải.
    *   Nhấn **Next** -> Chấp nhận điều khoản -> **Next**.
    *   Chọn **Complete** (Cài đặt đầy đủ).
    *   **Quan trọng**: Ở màn hình "Service Configuration", giữ nguyên mặc định ("Run service as Network Service User").
    *   **Quan trọng**: Đảm bảo tích chọn **"Install MongoDB Compass"** (Giao diện quản lý DB trực quan) ở màn hình tiếp theo.
    *   Nhấn **Next** -> **Install**.

3.  **Kiểm tra và Lấy Connection String**:
    *   Sau khi cài xong, MongoDB Compass sẽ tự động mở lên (hoặc bạn mở nó từ Start Menu).
    *   Ở màn hình kết nối của Compass, bạn sẽ thấy URI mặc định là:
        `mongodb://localhost:27017`
    *   Nhấn **Connect** để thử kết nối. Nếu thành công, nghĩa là MongoDB đã chạy.

## Cách 2: Setup Database cho App

1.  Sau khi cài xong MongoDB, quay lại thư mục dự án này.
2.  Tạo file `.env.local` (nếu chưa có).
3.  Dán dòng sau vào:

```env
MONGODB_URI=mongodb://localhost:27017/english-learning-app
```
(Bạn có thể thay đổi `english-learning-app` thành tên database bạn muốn).

4.  Khởi động lại dự án (`Ctrl + C` rồi `npm run dev`) để nhận cấu hình mới.

## Sửa lỗi Question Importer

Về lỗi ở `question-importer.tsx`, nếu file `src/components/ui/tabs.tsx` và `dialog.tsx` đã tồn tại mà vẫn báo đỏ, bạn hãy thử:
1.  Mở file `src/components/question-importer.tsx`.
2.  Gõ thêm một dấu cách vào cuối file rồi lưu lại (để trigger TypeScript check lại).
3.  Hoặc khởi động lại VS Code (Reload Window).

Nếu vẫn lỗi, hãy báo lại mình nhé!
