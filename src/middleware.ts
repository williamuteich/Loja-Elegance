import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import pino from 'pino';

const logger = pino();

export default withAuth(
  async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (req.nextUrl.pathname.startsWith('/dashboard') && (!token?.role || token.role !== 'admin')) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    logger.info({
      usuario: token?.name,
      email: token?.email,
      role: token?.role === "user" ? "1" : "0",
      rota: req.nextUrl.pathname,
      metodo: req.method,
      url: req.nextUrl.href,
      ip: req.headers.get('x-forwarded-for') || req.ip || null,
      userAgent: req.headers.get('user-agent') || null,
      status: 200,
      data: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    });

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
  matcher: ['/dashboard/:path*', '/profile/:path*', '/order/:path*', '/reset-password/:path*', '/checkouts/pagamento/:path*' ,'/unauthorized'],
};
