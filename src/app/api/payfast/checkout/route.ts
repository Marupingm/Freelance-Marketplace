import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import crypto from 'crypto';

const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID!;
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY!;
const PAYFAST_URL = process.env.NODE_ENV === 'production' 
  ? 'https://www.payfast.co.za/eng/process'
  : 'https://sandbox.payfast.co.za/eng/process';

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, total } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid cart items' }, { status: 400 });
    }

    await connectDB();

    // Generate a unique order ID
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    // Create a payment token that includes user information
    const paymentToken = crypto
      .createHash('sha256')
      .update(`${session.user.id}-${orderId}-${Date.now()}`)
      .digest('hex');

    // Create the order in pending state
    const order = await Order.create({
      _id: orderId,
      userId: session.user.id,
      items: items.map(item => ({
        productId: item._id,
        sellerId: item.sellerId._id,
        price: item.price,
      })),
      amount: total,
      status: 'pending',
      paymentToken,
    });

    // Create item description
    const itemDescription = items.length === 1 
      ? items[0].title 
      : `${items[0].title} and ${items.length - 1} other item(s)`;

    // Create PayFast form data
    const formData = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: `${process.env.NEXTAUTH_URL}/success?order=${orderId}&token=${paymentToken}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      notify_url: `${process.env.NEXTAUTH_URL}/api/payfast/notify`,
      name_first: session.user.name?.split(' ')[0] || '',
      name_last: session.user.name?.split(' ').slice(1).join(' ') || '',
      email_address: session.user.email || '',
      m_payment_id: orderId,
      amount: total.toFixed(2),
      item_name: itemDescription,
      custom_str1: session.user.id,
      custom_str2: paymentToken,
    };

    return NextResponse.json({
      url: PAYFAST_URL,
      formData,
    });
  } catch (error) {
    console.error('PayFast checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    );
  }
} 