import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import connectDB from './db';
import User from '@/models/User';
import Product from '@/models/Product';

// Helper function to generate a random number within a range
const randomInt = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to generate a random float with precision
const randomFloat = (min: number, max: number, decimals: number) => {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
};

// Helper function to generate random reviews
const generateReviews = (count: number) => {
  return Array.from({ length: count }, () => ({
    rating: randomInt(3, 5), // Bias towards positive ratings
    comment: faker.lorem.paragraph(),
    reviewer: faker.person.fullName(),
    date: faker.date.past(),
  }));
};

// Categories for products
const categories = [
  'Graphic',
  'Link Building',
  'Music & Animation',
  'SEO & Research',
  'Technology',
  'Traffic',
];

// Product types and their descriptions
const productTypes = [
  {
    prefix: 'Professional',
    types: ['Website Analysis', 'SEO Audit', 'Market Research', 'Content Strategy'],
    suffixes: ['Report', 'Package', 'Service', 'Solution'],
  },
  {
    prefix: 'Custom',
    types: ['Logo Design', 'Brand Identity', 'Social Media Kit', 'Marketing Materials'],
    suffixes: ['Bundle', 'Pack', 'Collection', 'Suite'],
  },
  {
    prefix: 'Premium',
    types: ['Traffic Generation', 'Lead Generation', 'Conversion Optimization', 'Analytics Setup'],
    suffixes: ['Strategy', 'System', 'Framework', 'Blueprint'],
  },
];

// Price ranges in ZAR (South African Rand)
const PRICE_RANGES = {
  MIN_PRICE: 499.99,    // R499.99
  MAX_PRICE: 7999.99,   // R7,999.99
};

async function seedDatabase() {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    console.log('Existing data cleared');

    // Create demo freelancers
    const freelancers = [];
    for (let i = 0; i < 10; i++) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const freelancer = await User.create({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        role: 'freelancer',
        level: `Level ${randomInt(1, 5)}`,
        profileImage: `https://picsum.photos/seed/${faker.string.alphanumeric(10)}/200`,
        bio: faker.person.bio(),
        skills: Array.from({ length: randomInt(3, 6) }, () => faker.person.jobArea()),
        totalEarnings: randomFloat(0, 10000, 2),
        totalSales: randomInt(0, 50),
        averageRating: randomFloat(3.5, 5, 1),
        createdAt: faker.date.past(),
      });
      freelancers.push(freelancer);
    }

    console.log('Demo freelancers created');

    // Create demo products
    const products = [];
    for (let i = 0; i < 20; i++) {
      const freelancer = freelancers[randomInt(0, freelancers.length - 1)];
      const productType = productTypes[randomInt(0, productTypes.length - 1)];
      const title = `${productType.prefix} ${
        productType.types[randomInt(0, productType.types.length - 1)]
      } ${productType.suffixes[randomInt(0, productType.suffixes.length - 1)]}`;

      const product = await Product.create({
        title,
        description: faker.lorem.paragraphs(2),
        price: randomFloat(PRICE_RANGES.MIN_PRICE, PRICE_RANGES.MAX_PRICE, 2),
        fileUrl: `https://picsum.photos/seed/${faker.string.alphanumeric(10)}/400/300`,
        sellerId: freelancer._id,
        category: categories[randomInt(0, categories.length - 1)],
        reviews: generateReviews(randomInt(1, 5)),
        rating: randomFloat(3.5, 5, 1),
        salesCount: randomInt(0, 30),
        createdAt: faker.date.past(),
      });
      products.push(product);
    }

    console.log('Demo products created');

    // Create one demo user
    await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'user',
      createdAt: new Date(),
    });

    console.log('Demo user created');
    console.log('Database seeding completed successfully');

    return { freelancers: freelancers.length, products: products.length };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error; // Re-throw the error to be handled by the API route
  }
}

export default seedDatabase;