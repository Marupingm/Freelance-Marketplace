'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CustomButton } from '@/components/ui/custom-button';

export default function FreelancerDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect non-freelancers to regular dashboard
    if (session?.user?.role !== 'freelancer') {
      router.push('/dashboard');
    }
  }, [session, router]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session?.user?.name}!
        </h1>
        <CustomButton
          onClick={() => router.push('/dashboard/freelancer/products/new')}
          className="!w-auto"
        >
          Add New Product
        </CustomButton>
      </div>

      {/* Sales Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Sales</h3>
          <p className="text-3xl font-bold text-primary">$0.00</p>
          <p className="text-sm text-gray-600 mt-1">0 products sold</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Products</h3>
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="text-sm text-gray-600 mt-1">products listed</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Reviews</h3>
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="text-sm text-gray-600 mt-1">0.0 average rating</p>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Sales</h2>
        <div className="space-y-4">
          {/* Add your sales list here */}
          <p className="text-gray-600">No sales yet.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Products</h3>
          <p className="text-gray-600 mb-4">View and edit your product listings.</p>
          <CustomButton 
            onClick={() => router.push('/dashboard/freelancer/products')}
          >
            View Products
          </CustomButton>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">View Orders</h3>
          <p className="text-gray-600 mb-4">Check your received orders.</p>
          <CustomButton 
            onClick={() => router.push('/dashboard/freelancer/orders')}
          >
            View Orders
          </CustomButton>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
          <p className="text-gray-600 mb-4">View your sales and performance metrics.</p>
          <CustomButton 
            onClick={() => router.push('/dashboard/freelancer/analytics')}
          >
            View Analytics
          </CustomButton>
        </div>
      </div>
    </div>
  );
} //  
//  
