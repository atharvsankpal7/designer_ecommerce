import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    
    return NextResponse.json({
      isAuthenticated: !!session?.user,
      isAdmin: !!session?.user?.isAdmin,
      user: session?.user || null,
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ 
      isAuthenticated: false, 
      isAdmin: false, 
      user: null 
    });
  }
}