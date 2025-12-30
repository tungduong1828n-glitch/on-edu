import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        // Trong môi trường production, thông tin này nên được lưu trong database hoặc bienvars
        // Đây là demo đơn giản
        if (username === 'admin' && password === 'admin123') {
            const cookieStore = await cookies();

            // Tạo session token đơn giản
            cookieStore.set('admin_session', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 1 tuần
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { success: false, message: 'Lỗi server' },
            { status: 500 }
        );
    }
}
