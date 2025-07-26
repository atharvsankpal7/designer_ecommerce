import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, code, bundleId } = await request.json();

    // Validate input
    if (!email || !code || !bundleId) {
      return NextResponse.json({ error: 'Email, code, and bundle ID are required' }, { status: 400 });
    }

    const order = await Order.findOne({
      email,
      bundleId,
      verificationCode: code,
      status: 'pending',
    });

    if (!order) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Check if code is not expired (10 minutes)
    const codeAge = Date.now() - order.updatedAt.getTime();
    if (codeAge > 10 * 60 * 1000) { // 10 minutes
      return NextResponse.json({ error: 'Verification code expired' }, { status: 400 });
    }

    // Update order status
    order.status = 'verified';
    await order.save();

    return NextResponse.json({ success: true });
  } catch (error : any) {
    console.error('Error verifying bundle code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}