import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'purchases' or 'sales'

    console.log('Fetching orders for user:', session.user.id, 'type:', type);

    await connectDB();

    let query = {};
    if (type === 'purchases') {
      query = { userId: new mongoose.Types.ObjectId(session.user.id) };
    } else if (type === 'sales' && session.user.role === 'freelancer') {
      query = { 'items.sellerId': new mongoose.Types.ObjectId(session.user.id) };
    } else {
      console.error('Invalid request type:', type);
      return NextResponse.json(
        { error: 'Invalid request type' },
        { status: 400 }
      );
    }

    console.log('Executing query:', JSON.stringify(query));

    const orders = await Order.find(query)
      .populate({
        path: 'items.productId',
        select: 'title fileUrl price'
      })
      .populate({
        path: 'items.sellerId',
        select: 'name'
      })
      .sort({ createdAt: -1 });

    console.log('Found orders:', orders.length);

    if (!orders) {
      console.log('No orders found');
      return NextResponse.json([]);
    }

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order (for testing purposes)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { items, amount } = await req.json();

    if (!items || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const order = await Order.create({
      _id: orderId,
      userId: new mongoose.Types.ObjectId(session.user.id),
      items,
      amount,
      paymentToken: Math.random().toString(36).substr(2),
      status: 'completed',
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
} //  
//  
