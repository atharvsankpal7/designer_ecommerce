import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function GET() {
  try {
    await connectDB();
    
    const [totalProducts, totalOrders, orders] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments({ status: 'delivered' }),
      Order.find({ status: 'delivered' })
        .populate('productId', 'title')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);

    const transformedOrders = orders.map(order => ({
      id: order._id.toString(),
      email: order.email,
      amount: order.amount,
      status: order.status,
      product: {
        title: order.productId?.title || 'Product not found',
      },
    }));

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders: transformedOrders,
    });
  } catch (error : any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}