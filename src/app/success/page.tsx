'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, Download, ShoppingBag, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { CustomButton } from '@/components/ui/custom-button';

interface OrderItem {
  productId: {
    _id: string;
    title: string;
    fileUrl: string;
    price: number;
  };
  sellerId: {
    _id: string;
    name: string;
    email: string;
  };
  price: number;
}

interface OrderDetails {
  _id: string;
  status: string;
  amount: number;
  paymentToken: string;
  items: OrderItem[];
  createdAt: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get order ID and token from URL
        const orderId = searchParams.get('order');
        const token = searchParams.get('token');

        if (!orderId || !token) {
          setError('Invalid order information');
          toast.error('Invalid order information');
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        // Check if user is authenticated
        if (authStatus === 'unauthenticated') {
          const currentUrl = window.location.href;
          const callbackUrl = encodeURIComponent(currentUrl);
          toast.error('Please log in to view your order');
          router.push(`/login?callbackUrl=${callbackUrl}`);
          return;
        }

        if (authStatus === 'loading') {
          return;
        }

        const response = await fetch(`/api/orders/${orderId}?token=${token}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch order');
        }

        const data = await response.json();
        setOrder(data);
        toast.success('Order details loaded successfully');
      } catch (error) {
        console.error('Error fetching order:', error);
        setError(error instanceof Error ? error.message : 'Failed to load order details');
        toast.error(error instanceof Error ? error.message : 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [searchParams, router, authStatus]);

  const handleDownload = async (fileUrl: string, title: string) => {
    if (downloadStarted) return;
    
    try {
      setDownloadStarted(true);
      toast.loading('Preparing download...');
      
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Failed to download file');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Download started successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file. Please try again.');
    } finally {
      setDownloadStarted(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50" style={{ paddingTop: '10rem', paddingBottom: '10rem' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Error</h2>
              <p className="text-gray-600 mb-6">{error || 'We couldn\'t find the order you\'re looking for.'}</p>
              <CustomButton
                onClick={() => router.push('/')}
              >
                Return to Home
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingTop: '10rem', paddingBottom: '10rem' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-green-100 rounded-full p-3">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Payment Successful!
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Thank you for your purchase. Your order has been processed successfully.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="text-gray-900">{order._id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="text-gray-900">{formatPrice(order.amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-semibold">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Your Products</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <span className="text-gray-900">{item.productId.title}</span>
                    <CustomButton
                      onClick={() => handleDownload(item.productId.fileUrl, item.productId.title)}
                      disabled={downloadStarted}
                      className="!w-auto"
                    >
                      {downloadStarted ? 'Downloading...' : 'Download'}
                    </CustomButton>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <CustomButton
                onClick={() => router.push('/dashboard')}
                className="!w-auto"
              >
                View Order History
              </CustomButton>
              <CustomButton
                onClick={() => router.push('/')}
                className="!w-auto"
                showIcon={false}
              >
                Continue Shopping
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Success() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
} //  
//  
