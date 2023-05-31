import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching freelancer with ID:', params.id);
    await connectDB();

    // Fetch freelancer data
    const freelancer = await User.findById(params.id).select(
      'name email level bio avatarUrl isEmailVerified isMobileVerified isIdentityVerified totalEarnings averageRating totalReviews'
    );

    if (!freelancer) {
      return NextResponse.json(
        { error: 'Freelancer not found' },
        { status: 404 }
      );
    }

    // Fetch freelancer's products
    const products = await Product.find({ sellerId: params.id })
      .sort({ createdAt: -1 });

    // Combine freelancer data with their products
    const freelancerData = {
      ...freelancer.toObject(),
      products,
    };

    console.log('Freelancer found:', freelancerData);
    return NextResponse.json(freelancerData);
  } catch (error: any) {
    console.error('Error fetching freelancer:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch freelancer' },
      { status: 500 }
    );
  }
} //  
