const seedDatabase = require('../lib/seed').default;

async function testSeed() {
  try {
    console.log('Starting database seeding test...');
    const result = await seedDatabase();
    console.log('Seeding successful!', result);
  } catch (error: any) {
    console.error('Seeding failed:', error.message || error);
    if (typeof error === 'object' && error !== null && 'stack' in error) {
      console.error('Stack trace:', error.stack);
    }
  }
}

testSeed(); 