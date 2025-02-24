import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ThemeProvider } from '@/context/ThemeContext';
import { NextAuthProvider } from '@/providers/NextAuthProvider';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Find Expert Freelancers For Your Next Project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <ThemeProvider>
            <CartProvider>
              <Navigation />
              {children}
              <Toaster position="top-right" />
            </CartProvider>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
