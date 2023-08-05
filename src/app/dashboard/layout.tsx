'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFFFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-button"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFFFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-40">
        {children}
      </div>
    </div>
  );
} //  
