"use client";

import { Suspense } from 'react';
import IntegratedMarketplace from '../components/IntegratedMarketplace';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }>
        <IntegratedMarketplace />
        <Footer />
      </Suspense>
    </main>
  );
}
//  
//  
