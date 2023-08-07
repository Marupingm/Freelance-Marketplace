"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomButton } from './custom-button';

interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
}

function SearchBarContent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Handle clicks outside of search component
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="relative flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            placeholder="Search for skills, projects, or freelancers..."
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <CustomButton
          type="submit"
          className="!w-auto !py-2"
          showIcon={true}
        >
          Search
        </CustomButton>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (query.length >= 2) && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[480px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2 divide-y divide-gray-100">
              {results.map((product) => (
                <li 
                  key={product._id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <button
                    onClick={() => {
                      router.push(`/products/${product._id}`);
                      setShowResults(false);
                      setQuery('');
                    }}
                    className="w-full text-left px-6 py-4 focus:outline-none focus:bg-gray-50"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-gray-900 text-lg">{product.title}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1 w-fit">
                        {product.category}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500 text-lg">No results found</p>
              <p className="text-gray-400 text-sm mt-1">Try different keywords or browse all products</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SearchBar() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-12">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <SearchBarContent />
    </Suspense>
  );
} //  
