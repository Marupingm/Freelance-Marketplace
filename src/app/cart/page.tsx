'use client';

import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { CustomButton } from '@/components/ui/custom-button';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export default function Cart() {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleCheckout = async (retryCount = 0) => {
    if (isProcessing) return;
    
    const loadingToast = toast.loading('Processing your order...');
    setIsProcessing(true);
    
    try {
      // Check if cart is empty
      if (state.items.length === 0) {
        toast.error('Your cart is empty');
        return;
      }

      // Check if user is authenticated
      if (!session) {
        toast.dismiss(loadingToast);
        toast.error('Please sign in to continue');
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

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409 && retryCount < MAX_RETRIES) {
          // Retry on duplicate order ID
          toast.dismiss(loadingToast);
          toast.loading('Retrying checkout...');
          await sleep(RETRY_DELAY);
          return handleCheckout(retryCount + 1);
        }

        throw new Error(data.error || 'Failed to process checkout');
      }

      // Clear cart after successful checkout initiation
      dispatch({ type: 'CLEAR_CART' });
      toast.dismiss(loadingToast);
      toast.success('Redirecting to payment gateway...');

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
      toast.dismiss(loadingToast);
      console.error('Checkout error:', error);
      
      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          toast.error('Network error. Please check your connection and try again.');
        } else if (error.message.includes('validation')) {
          toast.error('Invalid cart data. Please refresh and try again.');
        } else if (error.message.includes('no longer available')) {
          toast.error('Some items in your cart are no longer available. Please remove them and try again.');
        } else {
          toast.error(error.message || 'Failed to process checkout. Please try again.');
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }

      // Show error details in the console for debugging
      console.error('Detailed checkout error:', {
        error,
        cartItems: state.items.length,
        total: state.total,
        userId: session?.user?.id,
        retryCount
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50" style={{ paddingTop: '10rem', paddingBottom: '10rem' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <AlertCircle className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-4 text-gray-600">Add some products to your cart to get started.</p>
            <CustomButton
              onClick={() => router.push('/')}
              className="mt-6"
            >
              Browse Products
            </CustomButton>
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
                    onClick={() => {
                      dispatch({ type: 'REMOVE_ITEM', payload: item._id });
                      toast.success('Item removed from cart');
                    }}
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
                <CustomButton
                  onClick={() => {
                    dispatch({ type: 'CLEAR_CART' });
                    toast.success('Cart cleared');
                  }}
                  disabled={isProcessing}
                  className="!w-auto"
                  showIcon={false}
                >
                  Clear Cart
                </CustomButton>
                <CustomButton
                  onClick={() => handleCheckout()}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} //  
