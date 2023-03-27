import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { authOptions } from '@/lib/auth';

// GET /api/products - Get all products or filter by category/search
export async function GET(req: Request) {
  console.log('Fetching products...');
  try {
    const { searchParams } = new URL(req.url);
    
    // Get all filter parameters
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sellerId = searchParams.get('sellerId');
    const sort = searchParams.get('sort') || 'default';
    const level = searchParams.get('level');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const features = searchParams.getAll('features'); // Get all selected features
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database');

    let query: any = {};

    // Add text search if search parameter is provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Add category filter
    if (category) {
      query.category = category;
    }

    // Add seller filter
    if (sellerId) {
      query.sellerId = sellerId;
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Add level filter by joining with User model
    if (level) {
      query['sellerId.level'] = level;
    }

    // Add features filter
    if (features.length > 0) {
      // Assuming features are stored in the description
      query.description = {
        $all: features.map(feature => new RegExp(feature, 'i'))
      };
    }

    console.log('Executing query:', query);

    // Create base query
    let productsQuery = Product.find(query)
      .populate('sellerId', 'name level');

    // Apply sorting
    switch (sort) {
      case 'price_asc':
        productsQuery = productsQuery.sort({ price: 1 });
        break;
      case 'price_desc':
        productsQuery = productsQuery.sort({ price: -1 });
        break;
      case 'rating':
        productsQuery = productsQuery.sort({ rating: -1 });
        break;
      default:
        productsQuery = productsQuery.sort({ createdAt: -1 });
    }

    // Apply limit if specified
    if (limit) {
      productsQuery = productsQuery.limit(limit);
    }

    const products = await productsQuery;
    console.log(`Found ${products.length} products`);

    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'freelancer') {
      return NextResponse.json(
        { error: 'Unauthorized - Freelancers only' },
        { status: 403 }
      );
    }

    const { title, description, price, fileUrl, category } = await req.json();

    // Validate input
    if (!title || !description || !price || !fileUrl || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.create({
      title,
      description,
      price,
      fileUrl,
      category,
      sellerId: session.user.id,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
} //  
//  
