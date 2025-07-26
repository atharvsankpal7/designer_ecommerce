import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Bundle from '@/models/Bundle';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, bundleId } = await request.json();

    // Validate input
    if (!email || !bundleId) {
      return NextResponse.json({ error: 'Email and bundle ID are required' }, { status: 400 });
    }

    // Verify bundle exists and is active
    const bundle = await Bundle.findById(bundleId);
    if (!bundle || !bundle.isActive) {
      return NextResponse.json({ error: 'Bundle not found or inactive' }, { status: 404 });
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create or update order with bundle reference
    const order = await Order.findOneAndUpdate(
      { email, bundleId },
      {
        email,
        bundleId,
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
    console.error('Error sending bundle verification email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}