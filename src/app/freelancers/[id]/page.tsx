'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Star, Check } from 'lucide-react';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  fileUrl: string;
  rating: number;
  reviews: Array<{ rating: number }>;
}

interface Freelancer {
  _id: string;
  name: string;
  email: string;
  level: string;
  bio: string;
  avatarUrl: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isIdentityVerified: boolean;
  totalEarnings: number;
  averageRating: number;
  totalReviews: number;
  products: Product[];
}

export default function FreelancerProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFreelancer = async () => {
      try {
        const response = await fetch(`/api/freelancers/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch freelancer profile');
        }
        const data = await response.json();
        setFreelancer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFreelancer();
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !freelancer) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-600">
          <p>{error || 'Freelancer not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingTop: '10rem', paddingBottom: '10rem' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                <Image
                  src={freelancer.avatarUrl || '/default-avatar.png'}
                  alt={freelancer.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
          <div className="pt-20 pb-8 px-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{freelancer.name}</h1>
                <p className="text-blue-600">{freelancer.level}</p>
              </div>
              <div className="flex items-center space-x-6">
                {freelancer.isEmailVerified && (
                  <div className="flex items-center text-green-600">
                    <Check size={16} className="mr-1" />
                    <span className="text-sm">Email Verified</span>
                  </div>
                )}
                {freelancer.isMobileVerified && (
                  <div className="flex items-center text-green-600">
                    <Check size={16} className="mr-1" />
                    <span className="text-sm">Mobile Verified</span>
                  </div>
                )}
                {freelancer.isIdentityVerified && (
                  <div className="flex items-center text-green-600">
                    <Check size={16} className="mr-1" />
                    <span className="text-sm">Identity Verified</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-gray-600 mb-6">{freelancer.bio}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{formatPrice(freelancer.totalEarnings)}</div>
                <div className="text-sm text-gray-600">Total Earnings</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{freelancer.averageRating.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{freelancer.totalReviews}</div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{freelancer.products.length}</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Products by {freelancer.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancer.products.map((product) => (
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
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} //  
