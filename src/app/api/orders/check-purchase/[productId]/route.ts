import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Convert productId to ObjectId
    const productObjectId = new mongoose.Types.ObjectId(params.productId);
    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    // Check if user has purchased the product
    const order = await Order.findOne({
      userId: userObjectId,
      'items.productId': productObjectId,
      status: 'completed'
    });

    return NextResponse.json({
      purchased: !!order
    });
  } catch (error: any) {
    console.error('Error checking purchase status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check purchase status' },
      { status: 500 }
    );
  }
} 