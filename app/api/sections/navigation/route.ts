import { NextResponse } from 'next/server';
import { getNavigationSections } from '@/lib/section-utils';

export async function GET() {
  try {
    const navigationSections = await getNavigationSections();
    return NextResponse.json(navigationSections);
  } catch (error : any) {
    console.error('Error fetching navigation sections:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}