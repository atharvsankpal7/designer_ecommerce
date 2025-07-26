import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, code, productId } = await request.json();

    const order = await Order.findOne({
      email,
      productId,
      verificationCode: code,
      status: 'pending',
    });

    if (!order) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Update order status
    order.status = 'verified';
    await order.save();

    return NextResponse.json({ success: true });
  } catch (error : any) {
    console.error('Error verifying code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}