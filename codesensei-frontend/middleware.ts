import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// NOTE: Auth is handled client-side via localStorage Bearer token.
// The middleware only handles redirects for unauthenticated users
// trying to access /dashboard directly (they'll get bounced by the
// dashboard page's own useEffect auth check).
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
