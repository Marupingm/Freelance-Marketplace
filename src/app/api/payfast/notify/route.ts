import { NextResponse } from 'next/server';
import { validatePayFastResponse } from '@/lib/payfast';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    console.log('Received PayFast notification');
    const data = await req.formData();
    const payload: Record<string, string> = {};
    
    // Convert FormData to Record<string, string>
    data.forEach((value, key) => {
      payload[key] = value.toString();
    });

    console.log('PayFast notification payload:', payload);

    // Validate the signature
    if (!validatePayFastResponse(payload)) {
      console.error('Invalid PayFast signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the order
    const order = await Order.findOne({ _id: payload.m_payment_id });
    if (!order) {
      console.error('Order not found:', payload.m_payment_id);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('Processing payment status:', payload.payment_status, 'for order:', order._id);

    // Update order based on payment status
    if (payload.payment_status === 'COMPLETE') {
      order.status = 'completed';
      order.paymentId = payload.pf_payment_id;
      
      // Update seller statistics
      const seller = await User.findById(order.sellerId);
      if (seller) {
        seller.totalEarnings = (seller.totalEarnings || 0) + order.amount;
        seller.totalSales = (seller.totalSales || 0) + 1;
        await seller.save();
        console.log('Updated seller statistics:', seller._id);
      }

      await order.save();
      console.log('Order marked as completed:', order._id);
    } else if (payload.payment_status === 'FAILED') {
      order.status = 'failed';
      order.paymentId = payload.pf_payment_id;
      await order.save();
      console.log('Order marked as failed:', order._id);
    } else {
      console.log('Unhandled payment status:', payload.payment_status);
    }

    return NextResponse.json({ message: 'Notification processed successfully' });
  } catch (error: any) {
    console.error('PayFast notification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process notification' },
      { status: 500 }
    );
  }
} //  
