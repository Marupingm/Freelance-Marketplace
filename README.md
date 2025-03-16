# Freelance Marketplace

A full-featured digital marketplace platform that connects freelancers with clients. Built with Next.js, React, MongoDB, and Tailwind CSS.

![Freelance Marketplace](public/marketplace-preview.png)

## Features

- **Integrated Marketplace**: Browse and purchase digital products and services
- **User Authentication**: Secure login/registration with role-based access (client/freelancer)
- **Advanced Filtering**: Filter products by category, price range, seller level, and more
- **Responsive Design**: Fully responsive UI for all device sizes
- **Shopping Cart**: Add products to cart and proceed to checkout
- **Secure Payments**: Integration with PayFast payment gateway
- **User Dashboard**: Manage orders, purchases, and account details
- **Freelancer Dashboard**: Manage products, track sales, and update profile

## Tech Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **State Management**: React Context API
- **Animation**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- MongoDB instance (local or Atlas)

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

## Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── api/             # API routes
│   ├── cart/            # Cart page
│   ├── dashboard/       # User/Freelancer dashboard
│   ├── freelancers/     # Freelancer listings
│   ├── login/           # Authentication pages
│   ├── products/        # Product listings and details
│   ├── register/        # User registration
│   └── success/         # Payment success page
├── components/          # UI components
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and configurations
├── models/              # Mongoose data models
└── providers/           # Next.js providers
```

## API Routes

- `/api/auth/*` - Authentication endpoints (handled by NextAuth.js)
- `/api/products` - Product CRUD operations
- `/api/orders` - Order management
- `/api/freelancers` - Freelancer-specific endpoints
- `/api/payfast` - Payment processing

## Deployment

The application is configured for easy deployment on Vercel:

```bash
npm run build
vercel --prod
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
