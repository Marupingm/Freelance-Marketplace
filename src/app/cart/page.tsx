'use client';

import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Cart() {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const { data: session, status } = useSession();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  const handleCheckout = async () => {
    try {
      // Check if user is authenticated
      if (!session) {
        // Store current cart URL in query params to redirect back after login
        router.push('/login?callbackUrl=' + encodeURIComponent('/cart'));
        return;
      }

      // Create a bulk order for all items in cart
      const response = await fetch('/api/payfast/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items,
          total: state.total,
        }),
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const data = await response.json();
      
      // Clear cart after successful checkout
      dispatch({ type: 'CLEAR_CART' });

      // Create a form and submit it to PayFast
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.url;

      // Add all the PayFast form fields
      Object.entries(data.formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process checkout. Please try again.');
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50" style={{ paddingTop: '10rem', paddingBottom: '10rem' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-4 text-gray-600">Add some products to your cart to get started.</p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingTop: '10rem', paddingBottom: '10rem' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h2>
            
            <div className="space-y-6">
              {state.items.map((item) => (
                <div key={item._id} className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.fileUrl}
                      alt={item.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">By {item.sellerId.name}</p>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatPrice(item.price)}
                  </div>
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item._id })}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t pt-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(state.total)}</span>
              </div>

              <div className="flex justify-between gap-4">
                <button
                  onClick={() => dispatch({ type: 'CLEAR_CART' })}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 