import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Bundle from '@/models/Bundle';
import Product from '@/models/Product';
import { sendBundleFiles } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { orderId, paymentId, signature } = await request.json();

    // Validate input
    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: 'Missing payment verification data' }, { status: 400 });
    }

    // Verify payment signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Find order
    const order = await Order.findOne({ razorpayOrderId: orderId })
      .populate({
        path: 'bundleId',
        populate: {
          path: 'products',
          model: 'Product'
        }
      });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order status
    order.status = 'paid';
    order.razorpayPaymentId = paymentId;
    await order.save();

    // Collect all product files from the bundle
    const bundle = order.bundleId as any;
    const allFiles: string[] = [];
    
    for (const product of bundle.products) {
      allFiles.push(...product.productFiles);
    }

    // Send bundle files
    await sendBundleFiles(order.email, bundle.name, allFiles);

    // Update order to delivered
    order.status = 'delivered';
    await order.save();

    return NextResponse.json({ success: true });
  } catch (error : any) {
    console.error('Error verifying bundle payment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}