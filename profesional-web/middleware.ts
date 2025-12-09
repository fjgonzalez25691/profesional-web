import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo aplicar a rutas /admin/* excepto /admin (página de login)
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const authToken = request.cookies.get('admin_auth')?.value;
    const validToken = process.env.ADMIN_TOKEN;

    // Si no está autenticado, redirigir a /admin (login)
    if (!authToken || authToken !== validToken) {
      const loginUrl = new URL('/admin', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
