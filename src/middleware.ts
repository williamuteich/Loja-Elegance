import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { cookies } from 'next/headers';

export default withAuth(
  async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const cookieStore = await cookies()
    const nextAuth = cookieStore.get('next-auth.session-token')

    if (req.nextUrl.pathname.startsWith('/dashboard') && (!token?.role || token.role !== 'admin')) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/order/:path*', '/reset-password/:path*'],
};
