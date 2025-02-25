"use client";

import { useState } from 'react';
import Link from 'next/link';
import { UserCircle, Menu, X, ShoppingCart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CustomButton } from '@/components/ui/custom-button';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { state } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-primary">
              Marketplace
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-primary transition-colors">
              Blog
            </Link>
          </div>

          {/* User Icon */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <button
              onClick={() => router.push('/cart')}
              className="relative p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ShoppingCart size={24} />
              {state.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.items.length}
                </span>
              )}
            </button>

            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={session.user.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard'}
                  className="text-gray-600 hover:text-primary"
                >
                  Dashboard
                </Link>
                <CustomButton
                  onClick={() => router.push('/api/auth/signout')}
                  showIcon={false}
                  className="!w-auto"
                >
                  Sign Out
                </CustomButton>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/login')}
                  className="p-2 text-gray-600 hover:text-primary transition-colors"
                  aria-label="Sign In"
                >
                  <UserCircle size={24} />
                </button>
                <CustomButton
                  onClick={() => router.push('/register')}
                  showIcon={false}
                  className="!w-auto"
                >
                  Sign Up
                </CustomButton>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-b border-gray-200">
            <Link
              href="/"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/products"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/blog"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}