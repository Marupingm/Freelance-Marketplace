"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Image from 'next/image';
import { Star, Heart, Search, PenTool, Building2, Music, Network, BarChart3, ShoppingCart, Loader2, Filter } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CustomButton } from '@/components/ui/custom-button';
import { Meteors } from '@/components/ui/meteors';
import { SearchBar } from '@/components/ui/search-bar';
import { ProductFilters } from './ProductFilters';

// Price ranges in ZAR
const PRICE_RANGES = {
  MIN_PRICE: 499.99,
  MAX_PRICE: 7999.99,
};

interface Product {
  _id: string;
  title: string;
  price: number;
  fileUrl: string;
  sellerId: {
    _id: string;
    name: string;
    level: string;
  };
  rating: number;
  reviews: Array<{ rating: number }>;
}

const categories = [
  {
    id: 1,
    name: 'Graphic',
    icon: PenTool,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    id: 2,
    name: 'Link Building',
    icon: Building2,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    id: 3,
    name: 'Music & Animation',
    icon: Music,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
  },
  {
    id: 4,
    name: 'SEO & Research',
    icon: Search,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
  {
    id: 5,
    name: 'Technology',
    icon: Network,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    id: 6,
    name: 'Traffic',
    icon: BarChart3,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
];

const levels = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];
const features = [
  "Guaranteed Only",
  "Resale Rights",
  "Subscription",
  "Support"
];

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(async (filters?: any) => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams(searchParams);
      
      if (filters) {
        if (filters.sort !== 'default') params.set('sort', filters.sort);
        if (filters.level) params.set('level', filters.level);
        if (filters.minPrice) params.set('minPrice', filters.minPrice);
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
        if (filters.features?.length > 0) {
          params.delete('features');
          filters.features.forEach((feature: string) => params.append('features', feature));
        }
      } else {
        // When no filters are applied, limit to 6 products, looks better
        params.set('limit', '6');
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Initial fetch on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFiltersChange = useCallback((newFilters: any) => {
    fetchProducts(newFilters);
  }, [fetchProducts]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  if (error) {
    return (
      <div className="text-center text-red-600 mt-8">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Search */}
      <div className="relative bg-white w-full min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Meteors number={20} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center space-y-8 sm:space-y-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              Find Expert Freelancers<br className="hidden sm:block" />
              <span className="text-primary mt-2 sm:mt-4 block">For Your Next Project</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Connect with skilled professionals from around the world. Get quality work done quickly and efficiently.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto px-4">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Browse Categories</h2>
            <p className="mt-4 text-lg text-gray-600">Explore our wide range of digital services</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  className="flex flex-col items-center p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors space-y-4 group"
                >
                  <div className={`p-3 rounded-lg ${category.bgColor} ${category.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Filters - Mobile */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center gap-2 p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Filter size={20} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            {showFilters && (
              <div className="mt-4">
                <ProductFilters onFiltersChange={handleFiltersChange} />
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => fetchProducts()}
                  className="mt-4 text-primary hover:text-primary/80"
                >
                  Try again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your filters or search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={product.fileUrl}
                        alt={product.title}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.sellerId.level === 'Level 5' ? 'bg-orange-100 text-orange-800' :
                          product.sellerId.level === 'Level 4' ? 'bg-purple-100 text-purple-800' :
                          product.sellerId.level === 'Level 3' ? 'bg-green-100 text-green-800' :
                          product.sellerId.level === 'Level 2' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {product.sellerId.level}
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}
                              fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                            />
                          ))}
                          <span className="ml-1 text-sm text-gray-600">
                            ({product.reviews.length})
                          </span>
                        </div>
                      </div>
                      <div onClick={() => router.push(`/products/${product._id}`)} className="cursor-pointer">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-primary transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          by {product.sellerId.name}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        <CustomButton
                          onClick={(e) => {
                            e.stopPropagation();
                            cartDispatch({ 
                              type: 'ADD_ITEM', 
                              payload: product 
                            });
                          }}
                          className="!w-auto"
                          isCartButton={true}
                        >
                          Cart
                        </CustomButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IntegratedMarketplace() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
} //  
