import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, productId } = await request.json();

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create or update order
    const order = await Order.findOneAndUpdate(
      { email, productId },
      {
        email,
        productId,
        verificationCode,
        status: 'pending',
        amount: 0, // Will be set later
      },
      { upsert: true, new: true }
    );

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json({ success: true });
  } catch (error : any) {
    console.error('Error sending verification email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}