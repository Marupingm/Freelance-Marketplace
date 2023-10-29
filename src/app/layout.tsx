import type { Metadata } from "next";
import { Inter, Ubuntu } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ThemeProvider } from '@/context/ThemeContext';
import { NextAuthProvider } from '@/providers/NextAuthProvider';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });
const ubuntu = Ubuntu({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-ubuntu',
});

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
      <head>
        <title>Digital Marketplace</title>
        <meta name="description" content="Digital marketplace for digital products" />
      </head>
      <body className={`${inter.className} ${ubuntu.variable}`}>
        <ThemeProvider>
          <NextAuthProvider>
            <CartProvider>
              <Navigation />
              {children}
              <Toaster position="top-right" />
            </CartProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
//  
//  
