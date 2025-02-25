'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Download, ShoppingBag, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders?type=purchases');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchOrders();
    }
  }, [session]);

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session?.user?.name}!
        </h1>
      </div>

      {/* Recent Purchases */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Purchases</h2>
        {orders.length === 0 ? (
          <div className="text-center py-40">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">No purchases yet.</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Order ID: {order._id}</span>
                  <span className="text-sm text-gray-600">{formatDate(order.createdAt)}</span>
                </div>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex-1">
                        <button
                          onClick={() => router.push(`/products/${item.productId._id}`)}
                          className="text-blue-600 hover:underline"
                        >
                          {item.productId.title}
                        </button>
                        <p className="text-sm text-gray-600">Seller: {item.sellerId.name}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-900">{formatPrice(item.price)}</span>
                        <button
                          onClick={() => handleDownload(item.productId.fileUrl, item.productId.title)}
                          disabled={downloadStarted}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                            downloadStarted 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          <Download size={16} />
                          {downloadStarted ? 'Downloading...' : 'Download'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between items-center border-t pt-3">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="font-semibold text-gray-900">{formatPrice(order.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Products</h3>
          <p className="text-gray-600 mb-4">Explore our marketplace for digital products.</p>
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">View Orders</h3>
          <p className="text-gray-600 mb-4">Check the status of your orders.</p>
          <button 
            onClick={() => router.push('/dashboard/orders')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Orders
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Support</h3>
          <p className="text-gray-600 mb-4">Need help? Contact our support team.</p>
          <button 
            onClick={() => router.push('/support')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
} 