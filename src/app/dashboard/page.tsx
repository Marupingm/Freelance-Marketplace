'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Download, ShoppingBag, AlertCircle } from 'lucide-react';
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
  };
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  amount: number;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    // Redirect freelancers to their dashboard
    if (session?.user?.role === 'freelancer') {
      router.push('/dashboard/freelancer');
    }
  }, [session, router]);

  useEffect(() => {
    const fetchOrders = async (retryCount = 0) => {
      try {
        const response = await fetch('/api/orders?type=purchases', {
          headers: {
            'Accept': 'application/json',
          },
        });

        // Check if response is not JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned non-JSON response');
        }

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            // Redirect to login if unauthorized
            router.push('/login?callbackUrl=' + encodeURIComponent('/dashboard'));
            return;
          }
          throw new Error(data.error || 'Failed to fetch orders');
        }

        if (!Array.isArray(data)) {
          throw new Error('Invalid response format');
        }

        setOrders(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching orders:', error);
        
        // Retry logic for network errors
        if (retryCount < 3 && (error instanceof TypeError || error.message.includes('non-JSON'))) {
          console.log(`Retrying fetch (attempt ${retryCount + 1})...`);
          setTimeout(() => fetchOrders(retryCount + 1), 1000 * (retryCount + 1));
          return;
        }

        setError(error instanceof Error ? error.message : 'Failed to fetch orders');
        toast.error(error instanceof Error ? error.message : 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchOrders();
    }
  }, [session, router]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#235789]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#020100]">
          Welcome back, {session?.user?.name}!
        </h1>
      </div>

      {/* Recent Purchases */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#020100] mb-4">Recent Purchases</h2>
        {orders.length === 0 ? (
          <div className="text-center py-40">
            <AlertCircle className="mx-auto h-12 w-12 text-[#C1292E]" />
            <p className="mt-4 text-[#020100]">No purchases yet.</p>
            <CustomButton
              onClick={() => router.push('/')}
              className="mt-4"
            >
              Browse Products
            </CustomButton>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#020100]">Order ID: {order._id}</span>
                  <span className="text-sm text-[#020100]">{formatDate(order.createdAt)}</span>
                </div>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-[#FDFFFC] border border-gray-200 p-3 rounded-lg">
                      <div className="flex-1">
                        <button
                          onClick={() => router.push(`/products/${item.productId._id}`)}
                          className="text-[#235789] hover:underline"
                        >
                          {item.productId.title}
                        </button>
                        <p className="text-sm text-[#020100]">Seller: {item.sellerId.name}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[#020100]">{formatPrice(item.price)}</span>
                        <CustomButton
                          onClick={() => handleDownload(item.productId.fileUrl, item.productId.title)}
                          disabled={downloadStarted}
                          showIcon={true}
                          className="!w-auto"
                        >
                          {downloadStarted ? 'Downloading...' : 'Download'}
                        </CustomButton>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between items-center border-t pt-3">
                  <span className="font-semibold text-[#020100]">Total:</span>
                  <span className="font-semibold text-[#020100]">{formatPrice(order.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#020100] mb-2">Browse Products</h3>
          <p className="text-[#020100] mb-4">Explore our marketplace for digital products.</p>
          <CustomButton 
            onClick={() => router.push('/')}
          >
            Start Shopping
          </CustomButton>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#020100] mb-2">View Orders</h3>
          <p className="text-[#020100] mb-4">Check the status of your orders.</p>
          <CustomButton 
            onClick={() => router.push('/dashboard/orders')}
          >
            View Orders
          </CustomButton>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#020100] mb-2">Get Support</h3>
          <p className="text-[#020100] mb-4">Need help? Contact our support team.</p>
          <CustomButton 
            onClick={() => router.push('/support')}
          >
            Contact Support
          </CustomButton>
        </div>
      </div>
    </div>
  );
} 