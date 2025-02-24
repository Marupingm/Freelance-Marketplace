import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching product with ID:', params.id);
    await connectDB();

    const product = await Product.findById(params.id)
      .populate('sellerId', 'name email level bio avatarUrl isEmailVerified isMobileVerified isIdentityVerified totalEarnings averageRating totalReviews');

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log('Product found:', product);
    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
} 