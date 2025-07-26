import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactForm from '@/models/ContactForm';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { name, email, phone, message } = await request.json();

    const contactForm = new ContactForm({
      name,
      email,
      phone,
      message,
    });

    await contactForm.save();

    return NextResponse.json({ success: true });
  } catch (error : any) {
    console.error('Error saving contact form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}