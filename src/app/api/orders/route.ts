import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

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

    await connectDB();

    let query = {};
    if (type === 'purchases') {
      query = { userId: session.user.id };
    } else if (type === 'sales' && session.user.role === 'freelancer') {
      query = { sellerId: session.user.id };
    } else {
      return NextResponse.json(
        { error: 'Invalid request type' },
        { status: 400 }
      );
    }

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

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
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

    const { productId, sellerId, amount } = await req.json();

    if (!productId || !sellerId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.create({
      userId: session.user.id,
      productId,
      sellerId,
      amount,
      paymentId: 'TEST_' + Date.now(),
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
} 