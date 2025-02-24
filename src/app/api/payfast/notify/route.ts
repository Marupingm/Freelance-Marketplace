import { NextResponse } from 'next/server';
import { validatePayFastResponse } from '@/lib/payfast';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const payload: Record<string, string> = {};
    
    // Convert FormData to Record<string, string>
    data.forEach((value, key) => {
      payload[key] = value.toString();
    });

    // Validate the signature
    if (!validatePayFastResponse(payload)) {
      console.error('Invalid PayFast signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    await connectDB();

    // Update order status
    const order = await Order.findOne({ _id: payload.m_payment_id });
    if (!order) {
      console.error('Order not found:', payload.m_payment_id);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order based on payment status
    if (payload.payment_status === 'COMPLETE') {
      order.status = 'completed';
      order.paymentId = payload.pf_payment_id;
      await order.save();
    } else {
      order.status = 'failed';
      await order.save();
    }

    return NextResponse.json({ message: 'Notification processed' });
  } catch (error: any) {
    console.error('PayFast notification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process notification' },
      { status: 500 }
    );
  }
} 