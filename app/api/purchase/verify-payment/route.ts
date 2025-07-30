import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product'; 
import { sendProductFiles } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { orderId, paymentId, signature } = await request.json();

    // Verify payment signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }
    const d = Product.findById(orderId);

    // Register Product model via import (already done above)
    const order = await Order.findOne({ razorpayOrderId: orderId }).populate('productId');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order status to paid
    order.status = 'paid';
    order.razorpayPaymentId = paymentId;
    await order.save();

    // Send product files
    const product = order.productId as any;
    await sendProductFiles(order.email, product.title, product.productFiles);

    // Update order status to delivered
    order.status = 'delivered';
    await order.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
