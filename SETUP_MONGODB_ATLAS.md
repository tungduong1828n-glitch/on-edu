# Hướng dẫn lấy Connection String từ MongoDB Atlas

Vì bạn sử dụng MongoDB Atlas (Cloud), hãy làm theo các bước sau để lấy chuỗi kết nối:

1.  **Truy cập vào Cluster của bạn**:
    *   Vào trang [Database Deployments](https://cloud.mongodb.com/v2).
    *   Nhấn nút **Connect** ở Cluster của bạn.

2.  **Chọn phương thức kết nối**:
    *   Chọn **Drivers** (Node.js, Go, Python, etc.).
    *   Ở mục **Driver**, chọn `Node.js`. Version: `5.5 or later` (hoặc mới nhất).

3.  **Copy Connection String**:
    *   Bạn sẽ thấy một chuỗi giống như sau:
        `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    *   Copy chuỗi này.

4.  **Cấu hình vào Dự án**:
    *   Mở (hoặc tạo) file `.env.local` trong thư mục `c:\Users\NCPC\Downloads\on`.
    *   Dán chuỗi vừa copy vào biến `MONGODB_URI`:

    ```env
    MONGODB_URI=mongodb+srv://tencuaban:matkhaucuaban@cluster0.abcde.mongodb.net/english-learning-app?retryWrites=true&w=majority
    ```
    *   **Quan trọng**:
        *   Thay `<username>` bằng tên đăng nhập DB của bạn (nếu chuỗi copy chưa có).
        *   Thay `<password>` bằng **mật khẩdu của User Database** (không phải mật khẩu đăng nhập web Atlas).
        *   Thêm `/english-learning-app` vào sau tên domain (như ví dụ trên) để chỉ định tên database sẽ dùng.

5.  **Lưu ý IP Whitelist**:
    *   Nếu kết nối bị lỗi, hãy vào tab **Network Access** trên Atlas.
    *   Nhấn **Add IP Address** -> Chọn **Allow Access From Anywhere** (để test cho nhanh) -> **Confirm**.

Sau khi lưu file `.env.local`, bạn nhớ khởi động lại terminal (`Ctrl+C` -> `npm run dev`) để nhận cấu hình mới nhé.
