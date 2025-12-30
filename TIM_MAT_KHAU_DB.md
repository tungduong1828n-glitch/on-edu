# Cách lấy/đặt lại Database User Password

Mật khẩu này **KHÔNG** phải là mật khẩu đăng nhập vào trang web MongoDB Atlas. Đây là mật khẩu của user `tungduong1828n_db_user`.

Để tìm hoặc đổi lại mật khẩu này, hãy làm theo các bước sau trên web MongoDB Atlas:

1.  Nhìn thanh menu bên trái, tìm mục **Security**.
2.  Chọn **Database Access**.
3.  Bạn sẽ thấy danh sách Users. Tìm user có tên: `tungduong1828n_db_user` (hoặc tên tương tự bạn đã tạo).
4.  Nhấn nút **Edit** bên cạnh user đó.
5.  Chọn **Edit Password**.
6.  Nhập một mật khẩu mới (dễ nhớ).
7.  Nhấn **Update User**.

Sau đó, quay lại dự án, mở file `.env.local` và thay chữ `NHAP_MAT_KHAU_O_DAY` bằng mật khẩu bạn vừa đặt.
