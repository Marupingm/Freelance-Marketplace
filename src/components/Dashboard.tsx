"use client";

import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Dashboard = ({ userType }: { userType: 'user' | 'freelancer' }) => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Dashboard</h2>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="p-2 hover:bg-gray-100">
              <Link href="/dashboard">Overview</Link>
            </li>
            <li className="p-2 hover:bg-gray-100">
              <Link href="/dashboard/profile">Profile</Link>
            </li>
            <li className="p-2 hover:bg-gray-100">
              <Link href="/dashboard/services">My Services</Link>
            </li>
            <li className="p-2 hover:bg-gray-100">
              <Link href="/dashboard/orders">My Orders</Link>
            </li>
            <li className="p-2 hover:bg-gray-100">
              <Link href="/dashboard/settings">Settings</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {userType === 'freelancer' ? (
          <FreelancerDashboard />
        ) : (
          <UserDashboard />
        )}
      </main>
    </div>
  );
};

const FreelancerDashboard = () => {
  return <div>Freelancer Dashboard Content</div>;
};

const UserDashboard = () => {
  return <div>User Dashboard Content</div>;
};

export default Dashboard; //  
