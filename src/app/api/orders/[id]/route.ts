import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

interface OrderDocument {
  _id: string;
  userId: string;
  status: string;
  paymentToken: string;
  productId: {
    title: string;
    fileUrl: string;
    price: number;
  };
  sellerId: {
    name: string;
    email: string;
    level: string;
  };
}

function isValidOrder(order: unknown): order is OrderDocument {
  if (!order || typeof order !== 'object') return false;
  const o = order as any;
  return (
    typeof o._id === 'string' &&
    typeof o.userId === 'string' &&
    typeof o.status === 'string' &&
    typeof o.paymentToken === 'string' &&
    typeof o.productId === 'object' &&
    typeof o.sellerId === 'object'
  );
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching order details for:', params.id);
    
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    await connectDB();

    // Extract orderId and validate format
    const orderId = params.id;
    if (!orderId.startsWith('ORDER-')) {
      console.error('Invalid order ID format:', orderId);
      return NextResponse.json(
        { error: 'Invalid order ID format' },
        { status: 400 }
      );
    }
    
    // Get and validate the payment token
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      console.error('No payment token provided');
      return NextResponse.json(
        { error: 'Payment token is required' },
        { status: 400 }
      );
    }

    console.log('Fetching order:', orderId, 'for user:', session.user.id);

    // Find the order and populate necessary fields
    const order = await Order.findOne({ 
      _id: orderId,
      paymentToken: token
    })
    .populate({
      path: 'items.productId',
      select: 'title fileUrl price'
    })
    .populate({
      path: 'items.sellerId',
      select: 'name email'
    });

    if (!order) {
      console.error('Order not found:', orderId);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify the order belongs to the user
    if (order.userId.toString() !== session.user.id) {
      console.error('Unauthorized access to order:', orderId);
      return NextResponse.json(
        { error: 'Unauthorized access to order' },
        { status: 403 }
      );
    }

    console.log('Successfully retrieved order:', orderId);
    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
} //  
//  
