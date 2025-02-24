"use client";

import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-center">© 2025 Marketplace. All rights reserved.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
} 