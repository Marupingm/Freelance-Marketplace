# Freelance Marketplace

A full-featured digital marketplace platform that connects freelancers with clients. Built with Next.js, React, MongoDB, and Tailwind CSS.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [API Routes](#api-routes)
- [Usage Guide](#usage-guide)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Integrated Marketplace**: Browse and purchase digital products and services
- **User Authentication**: Secure login/registration with role-based access (client/freelancer)
- **Advanced Filtering**: Filter products by category, price range, seller level, and more
- **Responsive Design**: Fully responsive UI for all device sizes
- **Shopping Cart**: Add products to cart and proceed to checkout
- **Secure Payments**: Integration with PayFast payment gateway
- **User Dashboard**: Manage orders, purchases, and account details
- **Freelancer Dashboard**: Manage products, track sales, and update profile
- **Product Reviews**: Rate and review purchased products
- **Multi-level Freelancer System**: Progression-based freelancer levels

## Tech Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: Tailwind CSS, Framer Motion (animations)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **State Management**: React Context API
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React, React Icons
- **Testing**: [Placeholder for testing framework]

## Folder Structure

```
src/
├── app/                 # Next.js app router
│   ├── api/             # API routes for backend functionality
│   ├── cart/            # Shopping cart page
│   ├── dashboard/       # User/Freelancer dashboard
│   ├── freelancers/     # Freelancer listings and profiles
│   ├── login/           # Authentication pages
│   ├── products/        # Product listings and details
│   ├── register/        # User registration
│   └── success/         # Payment success page
├── components/          # Reusable UI components
│   ├── ui/              # Basic UI elements
│   └── ...              # Feature-specific components
├── context/             # React Context providers for state management
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and configurations
├── models/              # Mongoose data models (User, Product, Order)
├── providers/           # Next.js providers
└── scripts/             # Database seeding and utility scripts
```

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- MongoDB instance (local or Atlas)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Marupingm/freelance-marketplace.git
   cd freelance-marketplace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   PAYFAST_MERCHANT_ID=your_payfast_merchant_id
   PAYFAST_MERCHANT_KEY=your_payfast_merchant_key
   ```

4. Seed the database with sample data:
   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Routes

- `/api/auth/*` - Authentication endpoints (handled by NextAuth.js)
- `/api/products` - Product CRUD operations
- `/api/orders` - Order management
- `/api/freelancers` - Freelancer-specific endpoints
- `/api/payfast` - Payment processing

## Usage Guide

### For Clients

1. **Browse Products**:
   - Use filters to narrow down by category, price range, or freelancer level
   - View detailed product information and reviews

2. **Purchase Products**:
   - Add products to cart
   - Proceed to checkout
   - Complete payment via PayFast

3. **Manage Orders**:
   - View purchase history
   - Leave reviews for purchased products
   - Contact freelancers for support

### For Freelancers

1. **Create Products**:
   - Add new digital products or services
   - Set pricing and descriptions
   - Upload product files

2. **Manage Products**:
   - Update existing products
   - Track sales and earnings
   - Respond to customer reviews

3. **Update Profile**:
   - Showcase skills and bio
   - Track performance metrics
   - Progress through freelancer levels

## Deployment

The application is configured for easy deployment on Vercel:

```bash
npm run build
vercel --prod
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Creator - Maruping

Project Link: [https://github.com/Marupingm/freelance-marketplace](https://github.com/Marupingm/freelance-marketplace)

---

Built with ❤️ using Next.js, React, MongoDB, and Tailwind CSS.
