import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE = 'codesensei_token';

export function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE)?.value;
  const { pathname } = request.nextUrl;

  // Protected routes — redirect to /login if no token
  if (pathname.startsWith('/dashboard') && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Auth pages — redirect to /dashboard if already logged in
  if ((pathname === '/login' || pathname === '/register') && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
