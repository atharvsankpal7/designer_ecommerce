import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { razorpay } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, productId } = await request.json();

    // Find verified order
    const d = Product.findById(productId);
    const order = await Order.findOne({
      email,
      productId,
      status: 'verified',
    }).populate('productId');


    if (!order) {
      return NextResponse.json({ error: 'Order not found or not verified' }, { status: 400 });
    }

    const product = order.productId as any;
    const amount = (product.discountPrice || product.originalPrice) * 100; // Convert to paisa

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `order_${order._id}`,
    });

    // Update order with Razorpay order ID and amount
    order.razorpayOrderId = razorpayOrder.id;
    order.amount = amount / 100;
    await order.save();

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
    });
  } catch (error : any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}