'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
        <button
          onClick={() => router.push('/dashboard/freelancer/products/new')}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Product
        </button>
      </div>

      {/* Sales Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Sales</h3>
          <p className="text-3xl font-bold text-blue-600">$0.00</p>
          <p className="text-sm text-gray-600 mt-1">0 products sold</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Products</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-600 mt-1">products listed</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Reviews</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-600 mt-1">0.0 average rating</p>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Sales</h2>
        <div className="space-y-4">
          {/* Add your sales list here */}
          <p className="text-gray-600">No sales yet.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Products</h3>
          <p className="text-gray-600 mb-4">View and edit your product listings.</p>
          <button 
            onClick={() => router.push('/dashboard/freelancer/products')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Products
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">View Orders</h3>
          <p className="text-gray-600 mb-4">Check your received orders.</p>
          <button 
            onClick={() => router.push('/dashboard/freelancer/orders')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Orders
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
          <p className="text-gray-600 mb-4">View your sales and performance metrics.</p>
          <button 
            onClick={() => router.push('/dashboard/freelancer/analytics')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
} 