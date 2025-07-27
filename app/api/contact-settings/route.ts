import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ContactSettings from '@/models/ContactSettings';

export async function GET() {
  try {
    await connectDB();
    
    let settings = await ContactSettings.findOne();
    
    // If no settings exist, create default ones
    if (!settings) {
      settings = await ContactSettings.create({});
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching contact settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact settings' },
      { status: 500 }
    );
  }
}