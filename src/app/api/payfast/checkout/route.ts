import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { generatePayFastForm } from '@/lib/payfast';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Create pending order
    const order = await Order.create({
      userId: session.user.id,
      productId: product._id,
      sellerId: product.sellerId,
      amount: product.price,
      paymentId: '', // Will be updated after payment
      status: 'pending',
    });

    // Generate PayFast form data
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const payFastData = generatePayFastForm({
      amount: product.price,
      item_name: product.title,
      email_address: session.user.email!,
      return_url: `${baseUrl}/dashboard/purchases?order=${order._id}&status=success`,
      cancel_url: `${baseUrl}/dashboard/purchases?order=${order._id}&status=cancelled`,
      notify_url: `${baseUrl}/api/payfast/notify`,
    });

    return NextResponse.json({
      url: payFastData.url,
      formData: payFastData.formData,
      orderId: order._id,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Checkout failed' },
      { status: 500 }
    );
  }
} 