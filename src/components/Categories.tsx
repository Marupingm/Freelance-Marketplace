"use client";

import React from 'react';
import { PenTool, Building2, Music, Search, Network, BarChart3 } from 'lucide-react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

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

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
  },
};

export default function Categories() {
  return (
    <div className="w-full bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative flex flex-col items-center p-6 rounded-2xl transition-all duration-200 hover:shadow-lg cursor-pointer"
            >
              <div className={`p-4 rounded-xl ${category.bgColor} mb-4 transition-all duration-200 group-hover:scale-110`}>
                <category.icon className={`w-8 h-8 ${category.color}`} />
              </div>
              <h3 className="text-gray-900 text-sm font-medium text-center">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 