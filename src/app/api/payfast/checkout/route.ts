import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import crypto from 'crypto';
import mongoose from 'mongoose';

const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID!;
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY!;
const PAYFAST_URL = process.env.NODE_ENV === 'production' 
  ? 'https://www.payfast.co.za/eng/process'
  : 'https://sandbox.payfast.co.za/eng/process';

interface CartItem {
  _id: string;
  title: string;
  price: number;
  sellerId: {
    _id: string;
    name: string;
  };
}

function validateCartItems(items: any[]): items is CartItem[] {
  return items.every(item => 
    typeof item._id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.price === 'number' &&
    item.price > 0 &&
    typeof item.sellerId === 'object' &&
    typeof item.sellerId._id === 'string' &&
    typeof item.sellerId.name === 'string'
  );
}

export async function POST(request: Request) {
  let mongoConnection;
  
  try {
    console.log('Processing checkout request');

    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error('Unauthorized checkout attempt');
      return NextResponse.json({ error: 'Unauthorized - Please sign in' }, { status: 401 });
    }

    // Validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('Invalid request body:', error);
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }

    const { items, total } = body;

    // Validate cart items
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('Invalid cart items:', items);
      return NextResponse.json({ error: 'Invalid cart items' }, { status: 400 });
    }

    if (!validateCartItems(items)) {
      console.error('Invalid cart item format:', items);
      return NextResponse.json({ error: 'Invalid cart item format' }, { status: 400 });
    }

    // Validate total
    const calculatedTotal = items.reduce((sum, item) => sum + item.price, 0);
    if (Math.abs(calculatedTotal - total) > 0.01) {
      console.error('Total mismatch:', { provided: total, calculated: calculatedTotal });
      return NextResponse.json({ error: 'Cart total mismatch' }, { status: 400 });
    }

    // Connect to database
    mongoConnection = await connectDB();

    // Verify all products exist and are available
    const productIds = items.map(item => new mongoose.Types.ObjectId(item._id));
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      console.error('Some products not found:', {
        requested: productIds,
        found: products.map(p => p._id),
      });
      return NextResponse.json({ error: 'One or more products are no longer available' }, { status: 400 });
    }

    // Generate a unique order ID with timestamp and random string
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const orderId = `ORDER-${timestamp}-${randomString}`;

    // Create a payment token that includes user information
    const paymentToken = crypto
      .createHash('sha256')
      .update(`${session.user.id}-${orderId}-${timestamp}`)
      .digest('hex');

    console.log('Creating order:', orderId);

    try {
      // Map cart items to order items with proper ObjectId conversion
      const orderItems = items.map(item => ({
        productId: new mongoose.Types.ObjectId(item._id),
        sellerId: new mongoose.Types.ObjectId(item.sellerId._id),
        price: item.price
      }));

      // Create the order document
      const order = new Order({
        _id: orderId,
        userId: new mongoose.Types.ObjectId(session.user.id),
        items: orderItems,
        amount: total,
        paymentToken: paymentToken,
        status: 'pending'
      });

      // Save the order
      await order.save();
      console.log('Order created successfully:', order._id);

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

      console.log('PayFast checkout prepared for order:', orderId);

      return NextResponse.json({
        url: PAYFAST_URL,
        formData,
      });
    } catch (error: any) {
      console.error('Failed to create order:', error);
      
      // Handle mongoose validation errors
      if (error instanceof mongoose.Error.ValidationError) {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return NextResponse.json(
          { error: `Validation failed: ${validationErrors.join(', ')}` },
          { status: 400 }
        );
      }

      // Handle duplicate key errors
      if (error.code === 11000) {
        return NextResponse.json(
          { error: 'Duplicate order ID. Please try again.' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to create order. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('PayFast checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to process checkout. Please try again.' },
      { status: 500 }
    );
  } finally {
    if (mongoConnection) {
      // Any cleanup code if needed
    }
  }
} 