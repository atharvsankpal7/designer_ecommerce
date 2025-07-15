import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    
    return NextResponse.json({
      isAuthenticated: !!session,
      isAdmin: session?.user?.isAdmin || false,
    });
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false, isAdmin: false });
  }
}