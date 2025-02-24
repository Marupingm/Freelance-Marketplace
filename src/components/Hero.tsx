"use client"

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { AuroraText } from "@/components/ui/aurora-text";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();

  return (
    <div className="bg-white w-full min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center space-y-8 sm:space-y-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            Find Expert Freelancers<br className="hidden sm:block" />
            <span className="text-blue-600 mt-2 sm:mt-4 block">
              <AuroraText>For Your Next Project</AuroraText>
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Connect with skilled professionals from around the world. Get quality work done quickly and efficiently.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto px-4">
            <input
              type="text"
              placeholder="Search for skills, projects, or freelancers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
            <button
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm text-base font-medium"
              onClick={() => console.log(searchQuery)}
            >
              Search
            </button>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <button className="w-full sm:w-auto text-blue-600 bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-lg font-medium transition duration-200 text-base">
              Find Work
            </button>
            <button className="w-full sm:w-auto text-white bg-gray-900 hover:bg-gray-800 px-6 py-3 rounded-lg font-medium transition duration-200 text-base">
              Hire Talent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}