import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check auth cho các route bắt đầu bằng /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const adminSession = request.cookies.get('admin_session');

        if (!adminSession) {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Nếu đang ở trang login mà đã có session thì redirect vào admin
    if (request.nextUrl.pathname === '/login') {
        const adminSession = request.cookies.get('admin_session');

        if (adminSession) {
            const adminUrl = new URL('/admin', request.url);
            return NextResponse.redirect(adminUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/login'],
};
