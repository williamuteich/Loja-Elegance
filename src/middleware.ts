import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/privada/')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    if (token.role !== "admin") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }
    return NextResponse.next();
  }

  
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/order') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/checkouts/pagamento')
  ) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
   
    if (pathname.startsWith('/dashboard') && token.role !== 'admin') {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/privada/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/order/:path*',
    '/reset-password/:path*',
    '/checkouts/pagamento/:path*',
    '/unauthorized',
  ],
};

