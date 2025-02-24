"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Heart, Search, PenTool, Building2, Music, Network, BarChart3 } from 'lucide-react';
import { AuroraText } from "@/components/ui/aurora-text";
import { useRouter } from 'next/navigation';

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

export default function IntegratedMarketplace() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([PRICE_RANGES.MIN_PRICE, PRICE_RANGES.MAX_PRICE]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from client...');
        const response = await fetch('/api/products?limit=6');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Products received:', data);
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Invalid data format:', data);
          setError('Invalid data format received');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (e.target.id === 'minPrice') {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
  };

  // simailar currency to implement
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white" style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
              Find Expert Freelancers<br />
              <span className="text-blue-600 mt-2 block">
                <AuroraText>For Your Next Project</AuroraText>
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with skilled professionals from around the world
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search for skills, projects, or freelancers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-6 py-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm font-medium">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  if (selectedCategories.includes(category.name)) {
                    setSelectedCategories(selectedCategories.filter(c => c !== category.name));
                  } else {
                    setSelectedCategories([...selectedCategories, category.name]);
                  }
                }}
                className={`group relative flex flex-col items-center p-6 rounded-2xl transition-all duration-200 hover:shadow-lg ${
                  selectedCategories.includes(category.name) ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
              >
                <div className={`p-4 rounded-xl ${category.bgColor} mb-4 transition-all duration-200 group-hover:scale-110`}>
                  <category.icon className={`w-8 h-8 ${category.color}`} />
                </div>
                <h3 className="text-gray-900 text-sm font-medium text-center">
                  {category.name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section with Filters */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 space-y-6">
              {/* Filter by Level */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-3">Filter by Level</h3>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <label key={level} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedLevels.includes(level)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLevels([...selectedLevels, level]);
                          } else {
                            setSelectedLevels(selectedLevels.filter(l => l !== level));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-3">Features</h3>
                <div className="space-y-2">
                  {features.map((feature) => (
                    <label key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFeatures([...selectedFeatures, feature]);
                          } else {
                            setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-3">Filter by Price</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="minPrice" className="text-sm text-gray-600">Min Price (R)</label>
                    <input
                      type="number"
                      id="minPrice"
                      value={priceRange[0]}
                      onChange={handlePriceChange}
                      min={PRICE_RANGES.MIN_PRICE}
                      max={PRICE_RANGES.MAX_PRICE}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="maxPrice" className="text-sm text-gray-600">Max Price (R)</label>
                    <input
                      type="number"
                      id="maxPrice"
                      value={priceRange[1]}
                      onChange={handlePriceChange}
                      min={PRICE_RANGES.MIN_PRICE}
                      max={PRICE_RANGES.MAX_PRICE}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Sort */}
              <div className="flex justify-end mb-6">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="default">Sort By (Default)</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              {/* Products Grid */}
              <div className="min-h-[400px]">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
                    <p>{error}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Try again
                    </button>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center text-gray-600 p-4">
                    <p>No products found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div 
                        key={product._id} 
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        onClick={() => router.push(`/products/${product._id}`)}
                      >
                        <div className="relative h-48">
                          <Image
                            src={product.fileUrl}
                            alt={product.title}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
                          <div className="flex items-center justify-between mb-3">
                            <div 
                              className="flex items-center space-x-1 cursor-pointer hover:text-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/freelancers/${product.sellerId._id}`);
                              }}
                            >
                              <span className="text-sm text-gray-600 hover:text-blue-600">{product.sellerId.name}</span>
                              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                {product.sellerId.level}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
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
                            <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
                          </div>
                          <button 
                            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/products/${product._id}`);
                            }}
                          >
                            Order Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
} 