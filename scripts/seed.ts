import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';
import Product from '../src/models/Product.js';
import type { IUser } from '../src/models/User';
import type { IProduct } from '../src/models/Product';

// Set up __dirname equivalent for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const freelancerNames = [
  'Sarah Johnson',
  'Michael Chen',
  'Emily Rodriguez',
  'David Kim',
  'Rachel Thompson',
  'James Wilson',
  'Maria Garcia',
  'Alex Patel',
  'Lisa Anderson',
  'Daniel Lee'
];

const skills = {
  'UI/UX Design': ['Figma', 'Adobe XD', 'Sketch', 'User Research', 'Prototyping'],
  'Web Development': ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
  'Mobile Development': ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
  'Digital Marketing': ['SEO', 'Social Media', 'Content Strategy', 'Analytics', 'Email Marketing'],
  'Software Solutions': ['Python', 'Java', 'C++', 'System Design', 'API Development'],
  'AI & Machine Learning': ['TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'Data Science'],
  'DevOps & Cloud': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Infrastructure'],
  'Cybersecurity': ['Penetration Testing', 'Security Auditing', 'Encryption', 'Network Security']
};

const productTitles = {
  'UI/UX Design': [
    'Enterprise UX Design System',
    'E-commerce UI Kit Pro',
    'Mobile App Design Templates Bundle',
    'Dashboard UI Component Library'
  ],
  'Web Development': [
    'Full-Stack E-commerce Solution',
    'Custom CMS Platform',
    'Real-time Chat Application',
    'Enterprise Admin Dashboard'
  ],
  'Mobile Development': [
    'Cross-platform Mobile App Template',
    'Native iOS App Boilerplate',
    'Android E-commerce Starter Kit',
    'Mobile Backend Infrastructure'
  ],
  'Digital Marketing': [
    'Digital Marketing Strategy Package',
    'SEO Optimization Suite',
    'Social Media Campaign Bundle',
    'Email Marketing Automation System'
  ],
  'Software Solutions': [
    'Enterprise Resource Planning System',
    'Inventory Management Solution',
    'Customer Relationship Management System',
    'Business Process Automation Tool'
  ],
  'AI & Machine Learning': [
    'AI-powered Analytics Platform',
    'Machine Learning Model Package',
    'Natural Language Processing Kit',
    'Computer Vision Solution'
  ],
  'DevOps & Cloud': [
    'Cloud Infrastructure Setup',
    'CI/CD Pipeline Implementation',
    'Microservices Architecture Blueprint',
    'Container Orchestration Solution'
  ],
  'Cybersecurity': [
    'Security Audit Framework',
    'Penetration Testing Suite',
    'Encryption Implementation Package',
    'Network Security Solution'
  ]
};

function generateDescription(title: string, category: string): string {
  const features = skills[category as keyof typeof skills];
  const baseDescription = `Professional ${category} solution designed for modern businesses. `;
  
  const details = [
    `Comprehensive ${category.toLowerCase()} package including:`,
    `- Complete documentation and implementation guides`,
    `- 6 months of technical support`,
    `- Regular updates and improvements`,
    `- Integration assistance`,
    ...features.map(skill => `- ${skill} implementation and best practices`)
  ].join('\n');

  return `${baseDescription}\n\n${details}`;
}

function generateReviews(count: number): Array<{ rating: number; comment: string; reviewer: string; date: Date }> {
  const reviewers = [
    'John Smith', 'Emma Wilson', 'Michael Brown', 'Sophie Taylor',
    'William Davis', 'Olivia Martin', 'James Anderson', 'Isabella Thomas'
  ];
  
  const comments = [
    'Excellent solution that exceeded our expectations!',
    'Great value for money, highly recommended.',
    'Professional and comprehensive package.',
    'Outstanding support and documentation.',
    'Saved us months of development time.',
    'Perfect for our enterprise needs.',
    'High-quality and well-structured.',
    'Exactly what we were looking for.'
  ];

  const reviews = [];
  for (let i = 0; i < count; i++) {
    reviews.push({
      rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
      comment: comments[Math.floor(Math.random() * comments.length)],
      reviewer: reviewers[Math.floor(Math.random() * reviewers.length)],
      date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000) // Random date within last 90 days
    });
  }
  return reviews;
}

async function clearDatabase() {
  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
  ]);
  console.log('Database cleared');
}

async function createUsers(): Promise<IUser[]> {
  console.log('Creating users...');
  
  // Create regular user
  const regularUser = {
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'user',
  };

  // Create freelancers
  const freelancers = freelancerNames.map((name, index) => ({
    email: `freelancer${index + 1}@example.com`,
    password: 'password123',
    name,
    role: 'freelancer' as const,
    level: `Level ${Math.min(5, Math.floor(Math.random() * 5) + 1)}`,
    bio: `Experienced professional specializing in ${Object.keys(skills)[index % Object.keys(skills).length]}`,
    skills: skills[Object.keys(skills)[index % Object.keys(skills).length] as keyof typeof skills],
    totalEarnings: Math.floor(Math.random() * 50000) + 10000,
    totalSales: Math.floor(Math.random() * 50) + 10,
    averageRating: (Math.random() * 1) + 4, // 4.0 to 5.0
  }));

  const users = await User.create([regularUser, ...freelancers]);
  console.log('Users created:', users.length);
  return users;
}

async function createProducts(freelancers: IUser[]): Promise<IProduct[]> {
  console.log('Creating products...');
  const products: Array<Partial<IProduct>> = [];

  // Calculate how many products each freelancer should create
  const productsPerFreelancer = Math.floor(30 / freelancers.length);
  const remainingProducts = 30 % freelancers.length;

  freelancers.forEach((freelancer, index) => {
    // Add extra product to early freelancers if there are remaining products
    const numProducts = productsPerFreelancer + (index < remainingProducts ? 1 : 0);
    
    for (let i = 0; i < numProducts; i++) {
      const category = Object.keys(productTitles)[Math.floor(Math.random() * Object.keys(productTitles).length)];
      const titles = productTitles[category as keyof typeof productTitles];
      const title = titles[Math.floor(Math.random() * titles.length)];
      
      products.push({
        title,
        description: generateDescription(title, category),
        price: Math.floor(Math.random() * 14000) + 1000, // R1000 to R15000
        fileUrl: `https://picsum.photos/seed/${freelancer._id}${i}/800/600`,
        sellerId: freelancer._id,
        category,
        reviews: generateReviews(Math.floor(Math.random() * 8) + 3), // 3-10 reviews
        rating: 0, // Will be calculated from reviews
        salesCount: Math.floor(Math.random() * 50) + 5, // 5-55 sales
      });
    }
  });

  // Calculate average rating for each product
  products.forEach(product => {
    if (product.reviews && product.reviews.length > 0) {
      const avgRating = product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;
      product.rating = Number(avgRating.toFixed(1));
    }
  });

  const createdProducts = await Product.create(products);
  console.log('Products created:', createdProducts.length);
  return createdProducts;
}

async function seed() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing data
    await clearDatabase();

    // Create users
    const users = await createUsers();
    const freelancers = users.filter(user => user.role === 'freelancer');

    // Create products
    await createProducts(freelancers);

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    // Close the MongoDB connection
    await mongoose.disconnect();
  }
}

// Run the seed function
seed(); 