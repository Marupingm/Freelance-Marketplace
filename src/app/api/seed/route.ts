import { NextResponse } from 'next/server';
import seedDatabase from '@/lib/seed';

export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Seeding is not allowed in production' },
      { status: 403 }
    );
  }

  try {
    console.log('Starting database seeding...');
    const result = await seedDatabase();
    console.log('Database seeding completed:', result);
    
    return NextResponse.json(
      { 
        message: 'Database seeded successfully',
        ...result
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Seeding error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to seed database',
        details: error.stack
      },
      { status: 500 }
    );
  }
} //  
