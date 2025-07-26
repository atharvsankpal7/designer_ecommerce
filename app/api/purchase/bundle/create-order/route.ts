import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Bundle from '@/models/Bundle';
import { razorpay } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, bundleId } = await request.json();

    // Validate input
    if (!email || !bundleId) {
      return NextResponse.json({ error: 'Email and bundle ID are required' }, { status: 400 });
    }

    // Find verified order
    const order = await Order.findOne({
      email,
      bundleId,
      status: 'verified',
    }).populate('bundleId');

    if (!order) {
      return NextResponse.json({ error: 'Order not found or not verified' }, { status: 400 });
    }

    const bundle = order.bundleId as any;
    if (!bundle || !bundle.isActive) {
      return NextResponse.json({ error: 'Bundle not found or inactive' }, { status: 404 });
    }

    const amount = (bundle.discountPrice || bundle.originalPrice) * 100; // Convert to paisa

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `bundle_order_${order._id}`,
      notes: {
        bundleId: bundle._id.toString(),
        email: email,
        type: 'bundle'
      }
    });

    // Update order with Razorpay order ID and amount
    order.razorpayOrderId = razorpayOrder.id;
    order.amount = amount / 100;
    await order.save();

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      bundleName: bundle.name,
    });
  } catch (error : any) {
    console.error('Error creating bundle order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}