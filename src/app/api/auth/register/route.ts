import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  console.log('Registration request received');
  
  try {
    // Ensure the request is properly formatted
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Invalid content type:', contentType);
      return NextResponse.json(
        { error: 'Invalid content type. Expected application/json' },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { email, password, name, role } = body;
    console.log('Received registration data:', { email, name, role });

    // Validate input
    if (!email || !password || !name || !role) {
      console.error('Missing required fields:', { email: !!email, password: !!password, name: !!name, role: !!role });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      console.error('Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Check if user already exists
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.error('User already exists:', email);
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user
    console.log('Creating new user...');
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      role,
    });
    console.log('User created successfully');

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: Object.values(error.errors).map((err: any) => err.message).join(', ') },
        { status: 400 }
      );
    }

    // Handle mongoose connection errors
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return NextResponse.json(
        { error: 'Database connection error. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred during registration. Please try again later.' },
      { status: 500 }
    );
  }
} 