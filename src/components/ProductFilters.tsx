'use client';

import { useState, useEffect, useCallback, memo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sliders, X, ChevronDown, ChevronUp } from 'lucide-react';

interface ProductFiltersProps {
  onFiltersChange: (filters: any) => void;
}

function ProductFiltersContent({ onFiltersChange }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    sort: searchParams.get('sort') || 'default',
    level: searchParams.get('level') || '',
    features: searchParams.getAll('features') || [],
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  const [expandedSections, setExpandedSections] = useState({
    level: true,
    features: true,
    price: true,
  });

  // Available levels with icons/badges
  const levels = [
    { name: 'Level 1', color: 'bg-gray-100' },
    { name: 'Level 2', color: 'bg-blue-100' },
    { name: 'Level 3', color: 'bg-green-100' },
    { name: 'Level 4', color: 'bg-purple-100' },
    { name: 'Level 5', color: 'bg-orange-100' }
  ];

  // Available features with icons
  const availableFeatures = [
    { name: 'Guaranteed Only', icon: '🛡️' },
    { name: 'Resale Rights', icon: '📜' },
    { name: 'Subscription', icon: '🔄' },
    { name: 'Support', icon: '💬' }
  ];

  const handleSortChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, sort: value }));
  }, []);

  const handleLevelChange = useCallback((level: string) => {
    setFilters(prev => ({
      ...prev,
      level: prev.level === level ? '' : level
    }));
  }, []);

  const handleFeatureChange = useCallback((feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  }, []);

  const handlePriceChange = useCallback((type: 'min' | 'max', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type === 'min' ? 'minPrice' : 'maxPrice']: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      sort: 'default',
      level: '',
      features: [],
      minPrice: '',
      maxPrice: '',
    });
  }, []);

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onFiltersChange(filters);
    }, 300); // Add a 300ms debounce to prevent too many API calls

    return () => clearTimeout(debounceTimer);
  }, [filters, onFiltersChange]);

  const hasActiveFilters = filters.level || filters.features.length > 0 || filters.minPrice || filters.maxPrice;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header with clear filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-gray-500" />
          <h2 className="font-semibold text-gray-900">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Sort Dropdown */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            id="sort"
            value={filters.sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full rounded-lg border-gray-200 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <option value="default">Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {/* Level Filter */}
        <div className="border-t pt-6">
          <button
            onClick={() => toggleSection('level')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="text-sm font-medium text-gray-900">Freelancer Level</h3>
            {expandedSections.level ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.level && (
            <div className="space-y-3">
              {levels.map((level) => (
                <button
                  key={level.name}
                  onClick={() => handleLevelChange(level.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    filters.level === level.name
                      ? 'bg-primary/10 text-primary ring-1 ring-primary'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${level.color}`} />
                    <span className="text-sm">{level.name}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Features Filter */}
        <div className="border-t pt-6">
          <button
            onClick={() => toggleSection('features')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="text-sm font-medium text-gray-900">Features</h3>
            {expandedSections.features ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.features && (
            <div className="space-y-3">
              {availableFeatures.map((feature) => (
                <label key={feature.name} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.features.includes(feature.name)}
                    onChange={() => handleFeatureChange(feature.name)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-gray-900">
                    <span>{feature.icon}</span>
                    {feature.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="border-t pt-6">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
            {expandedSections.price ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections.price && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Min Price (R)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-primary focus:ring-primary bg-gray-50"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Max Price (R)</label>
                  <input
                    type="number"
                    placeholder="15000"
                    value={filters.maxPrice}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-primary focus:ring-primary bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const ProductFilters = memo(function ProductFilters(props: ProductFiltersProps) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-12">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <ProductFiltersContent {...props} />
    </Suspense>
  );
}); //  
