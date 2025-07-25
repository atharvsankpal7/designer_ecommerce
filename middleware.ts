import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes except login page
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = await auth();

    // If no session or user is not admin, redirect to login
    if (!session?.user?.isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
