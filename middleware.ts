import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Handle admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }
    
    // Check for admin authentication
    const session = await auth();
    
    if (!session?.user?.isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};