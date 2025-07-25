import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    // Allow access to login page without auth
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Get JWT token from cookie
 
    const token = request.cookies.get('next-auth.token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {

      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

      const bruh = await jwtVerify(token, secret);


      // Check admin flag
      const payload = bruh.payload

      const isAdmin = payload.isAdmin;


      if (!isAdmin) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    } catch (err) {
      // Invalid token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};