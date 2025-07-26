import { NextResponse } from 'next/server';
import { getHomepageSections } from '@/lib/section-utils';

export async function GET() {
  try {
    const homepageSections = await getHomepageSections();
    return NextResponse.json(homepageSections);
  } catch (error : any) {
    console.error('Error fetching homepage sections:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}