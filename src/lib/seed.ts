import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import connectDB from './db';
import User from '@/models/User';
import Product from '@/models/Product';

// Categories for tech products
const categories = [
  'UI/UX Design',
  'Web Development',
  'Mobile Development',
  'Digital Marketing',
  'Software Solutions',
  'AI & Machine Learning',
  'DevOps & Cloud',
  'Cybersecurity',
];

// Product types and their descriptions
const productTypes = [
  {
    prefix: 'Premium',
    types: [
      'UI Kit',
      'Design System',
      'Website Template',
      'Mobile App Design',
      'Landing Page Design',
      'Brand Identity Package',
    ],
    suffixes: ['Bundle', 'Pack', 'Collection', 'Suite'],
    category: 'UI/UX Design',
  },
  {
    prefix: 'Custom',
    types: [
      'React Component Library',
      'Next.js Template',
      'WordPress Theme',
      'E-commerce Solution',
      'API Integration',
      'Full-Stack Boilerplate',
    ],
    suffixes: ['Package', 'Solution', 'Framework', 'Starter'],
    category: 'Web Development',
  },
  {
    prefix: 'Advanced',
    types: [
      'React Native App Template',
      'Flutter UI Kit',
      'iOS App Template',
      'Android App Template',
      'Cross-Platform Solution',
    ],
    suffixes: ['Kit', 'Template', 'Boilerplate', 'Package'],
    category: 'Mobile Development',
  },
  {
    prefix: 'Professional',
    types: [
      'SEO Toolkit',
      'Social Media Package',
      'Content Strategy',
      'Analytics Dashboard',
      'Email Marketing Template',
    ],
    suffixes: ['Suite', 'Bundle', 'Package', 'Solution'],
    category: 'Digital Marketing',
  },
  {
    prefix: 'Enterprise',
    types: [
      'CRM System',
      'ERP Solution',
      'Inventory Management',
      'Project Management',
      'Business Intelligence',
    ],
    suffixes: ['Platform', 'System', 'Solution', 'Suite'],
    category: 'Software Solutions',
  },
  {
    prefix: 'Smart',
    types: [
      'ML Model',
      'AI Integration',
      'Data Analysis',
      'Chatbot',
      'Recommendation Engine',
    ],
    suffixes: ['System', 'API', 'Service', 'Solution'],
    category: 'AI & Machine Learning',
  },
  {
    prefix: 'Cloud',
    types: [
      'CI/CD Pipeline',
      'Docker Configuration',
      'Kubernetes Setup',
      'AWS Architecture',
      'Microservices',
    ],
    suffixes: ['Template', 'Blueprint', 'Setup', 'Configuration'],
    category: 'DevOps & Cloud',
  },
  {
    prefix: 'Secure',
    types: [
      'Authentication System',
      'Security Audit',
      'Penetration Testing',
      'Encryption Tool',
      'Compliance Framework',
    ],
    suffixes: ['Kit', 'Framework', 'Solution', 'Package'],
    category: 'Cybersecurity',
  },
];

// Price ranges in ZAR (South African Rand)
const PRICE_RANGES = {
  'UI/UX Design': { min: 499.99, max: 4999.99 },
  'Web Development': { min: 999.99, max: 9999.99 },
  'Mobile Development': { min: 1499.99, max: 14999.99 },
  'Digital Marketing': { min: 799.99, max: 7999.99 },
  'Software Solutions': { min: 2999.99, max: 29999.99 },
  'AI & Machine Learning': { min: 1999.99, max: 19999.99 },
  'DevOps & Cloud': { min: 1499.99, max: 14999.99 },
  'Cybersecurity': { min: 2499.99, max: 24999.99 },
};

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

// Helper function to generate product description
const generateDescription = (productType: string, category: string) => {
  const features = {
    'UI/UX Design': [
      'Figma and Sketch files included',
      'Responsive design',
      'Design system documentation',
      'Component library',
      'Style guide',
    ],
    'Web Development': [
      'TypeScript support',
      'Responsive layouts',
      'API integration',
      'Authentication system',
      'Database setup',
    ],
    'Mobile Development': [
      'Cross-platform compatibility',
      'Native features integration',
      'Offline support',
      'Push notifications',
      'Analytics integration',
    ],
    'Digital Marketing': [
      'Analytics dashboard',
      'SEO optimization',
      'Social media integration',
      'Email templates',
      'Campaign tracking',
    ],
    'Software Solutions': [
      'Enterprise-grade architecture',
      'Scalable infrastructure',
      'Multi-tenant support',
      'API documentation',
      'Security features',
    ],
    'AI & Machine Learning': [
      'Pre-trained models',
      'Custom training pipeline',
      'Data preprocessing',
      'Model optimization',
      'API endpoints',
    ],
    'DevOps & Cloud': [
      'Infrastructure as code',
      'Monitoring setup',
      'Auto-scaling configuration',
      'Backup solutions',
      'Security best practices',
    ],
    'Cybersecurity': [
      'Security audit tools',
      'Vulnerability scanning',
      'Compliance checks',
      'Authentication system',
      'Encryption setup',
    ],
  };

  const categoryFeatures = features[category as keyof typeof features];
  const selectedFeatures = faker.helpers.arrayElements(categoryFeatures, 3);

  return `${productType} - A comprehensive ${category.toLowerCase()} solution designed for modern projects. 

Key Features:
${selectedFeatures.map(feature => `• ${feature}`).join('\n')}

${faker.lorem.paragraph()}

Includes:
• Full documentation
• 6 months of support
• Regular updates
• Commercial license`;
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
    for (let i = 0; i < 20; i++) {
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
        totalEarnings: randomFloat(0, 100000, 2),
        totalSales: randomInt(0, 100),
        averageRating: randomFloat(3.5, 5, 1),
        createdAt: faker.date.past(),
      });
      freelancers.push(freelancer);
    }

    console.log('Demo freelancers created');

    // Create demo products
    const products = [];
    for (let i = 0; i < 100; i++) {
      const productType = productTypes[randomInt(0, productTypes.length - 1)];
      const title = `${productType.prefix} ${
        productType.types[randomInt(0, productType.types.length - 1)]
      } ${productType.suffixes[randomInt(0, productType.suffixes.length - 1)]}`;

      const category = productType.category;
      const priceRange = PRICE_RANGES[category as keyof typeof PRICE_RANGES];

      const product = await Product.create({
        title,
        description: generateDescription(title, category),
        price: randomFloat(priceRange.min, priceRange.max, 2),
        fileUrl: `https://picsum.photos/seed/${faker.string.alphanumeric(10)}/400/300`,
        sellerId: freelancers[randomInt(0, freelancers.length - 1)]._id,
        category,
        reviews: generateReviews(randomInt(1, 10)),
        rating: randomFloat(3.5, 5, 1),
        salesCount: randomInt(0, 50),
        createdAt: faker.date.past(),
      });
      products.push(product);
    }

    console.log('Demo products created');

    // Create demo users
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
    throw error;
  }
}

export default seedDatabase;//  
