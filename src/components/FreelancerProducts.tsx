"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Heart } from 'lucide-react';

const products = [
  {
    id: 1,
    title: "Global Website Ranking Analysis",
    price: 150.00,
    image: "/images/google-analytics.jpg",
    freelancer: {
      name: "username",
      level: "Level 5",
      rating: 5,
      likes: 1
    },
    favorites: 1,
  },
  {
    id: 2,
    title: "SEO-Driven Organic Search Growth",
    price: 120.00,
    image: "/images/seo-growth.jpg",
    freelancer: {
      name: "Abeersd",
      level: "Level 3",
      rating: 4,
      likes: 1
    },
    favorites: 1,
  },
  {
    id: 3,
    title: "Comprehensive Website Database",
    price: 100.00,
    image: "/images/website-database.jpg",
    freelancer: {
      name: "zitouna",
      level: "Level 4",
      rating: 4.5,
      likes: 0
    },
    favorites: 0,
  },
  // Add more products as needed
];

const categories = [
  "Content Writing",
  "Digital Marketing",
  "Graphic",
  "Link Building",
  "Music & Animation",
  "SEO & Research",
  "Technology",
  "Traffic"
];

const levels = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];
const features = [
  "Guaranteed Only",
  "Resale Rights",
  "Subscription",
  "Support"
];

export default function FreelancerProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([30, 300]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (e.target.id === 'minPrice') {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-6">
          {/* Categories */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, category]);
                      } else {
                        setSelectedCategories(selectedCategories.filter(c => c !== category));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">{category}</span>
                </label>
              ))}
            </div>
          </div>

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
                <label htmlFor="minPrice" className="text-sm text-gray-600">Min Price ($)</label>
                <input
                  type="number"
                  id="minPrice"
                  value={priceRange[0]}
                  onChange={handlePriceChange}
                  min="30"
                  max="300"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="maxPrice" className="text-sm text-gray-600">Max Price ($)</label>
                <input
                  type="number"
                  id="maxPrice"
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                  min="30"
                  max="300"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <Image
                    src={product.image}
                    alt={product.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600">{product.freelancer.name}</span>
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {product.freelancer.level}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Heart size={16} className="text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">{product.favorites}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(product.freelancer.rating) ? "text-yellow-400" : "text-gray-300"}
                          fill={i < Math.floor(product.freelancer.rating) ? "currentColor" : "none"}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-600">({product.freelancer.likes})</span>
                    </div>
                    <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  </div>
                  <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
} //  
//  
