'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Star, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Review {
  rating: number;
  comment: string;
  reviewer: string;
  date: Date;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  fileUrl: string;
  category: string;
  sellerId: {
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
  };
  reviews: Review[];
  rating: number;
  salesCount: number;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);

        // Fetch related products
        const relatedResponse = await fetch(`/api/products?category=${data.category}&limit=6`);
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedProducts(relatedData.filter((p: Product) => p._id !== id));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
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

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-600">
          <p>{error || 'Product not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingTop: '10rem', paddingBottom: '10rem' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Overview */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image
                src={product.fileUrl}
                alt={product.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}
                      fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.reviews.length} reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-600">{product.salesCount} sales</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </div>
              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8">
          <Tabs defaultValue="description" className="bg-white rounded-2xl shadow-lg p-8">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="related">Related Products</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Product Description</h2>
              <div className="prose max-w-none">
                {product.description}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Customer Reviews</h2>
              {product.reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                          fill={i < review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-1">By {review.reviewer}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="related" className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48">
                      <Image
                        src={relatedProduct.fileUrl}
                        alt={relatedProduct.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{relatedProduct.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{formatPrice(relatedProduct.price)}</span>
                        <div className="flex items-center">
                          <Star size={16} className="text-yellow-400" fill="currentColor" />
                          <span className="ml-1 text-sm text-gray-600">{relatedProduct.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Freelancer Information */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-start space-x-8">
            <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={product.sellerId.avatarUrl || '/default-avatar.png'}
                alt={product.sellerId.name}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{product.sellerId.name}</h2>
                  <p className="text-blue-600">{product.sellerId.level}</p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  View Profile
                </button>
              </div>
              <p className="text-gray-600 mb-4">{product.sellerId.bio}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{formatPrice(product.sellerId.totalEarnings)}</div>
                  <div className="text-sm text-gray-600">Total Earnings</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{product.sellerId.averageRating.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{product.sellerId.totalReviews}</div>
                  <div className="text-sm text-gray-600">Total Reviews</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{product.salesCount}</div>
                  <div className="text-sm text-gray-600">Products Sold</div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                {product.sellerId.isEmailVerified && (
                  <div className="flex items-center text-green-600">
                    <Check size={16} className="mr-1" />
                    <span className="text-sm">Email Verified</span>
                  </div>
                )}
                {product.sellerId.isMobileVerified && (
                  <div className="flex items-center text-green-600">
                    <Check size={16} className="mr-1" />
                    <span className="text-sm">Mobile Verified</span>
                  </div>
                )}
                {product.sellerId.isIdentityVerified && (
                  <div className="flex items-center text-green-600">
                    <Check size={16} className="mr-1" />
                    <span className="text-sm">Identity Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} //  
//  
