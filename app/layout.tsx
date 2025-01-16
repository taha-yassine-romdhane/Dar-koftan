import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from "@/lib/context/cart-context";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";
import { CartDropdown } from "@/components/cart-dropdown";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lamasette.com/"),
  title: 'LAMASETTE - Timeless Fashion for the Modern Individual',
  description: 'Discover our collection of premium, sustainable clothing crafted for the modern wardrobe.',
  keywords: 'fashion, clothing, sustainable fashion, modern wardrobe, premium clothing, LAMASETTE, Tunisia',
  icons: {
    icon: { url: '/favicon.ico', sizes: 'any' }
  },
  openGraph: {
    title: 'LAMASETTE - Timeless Fashion for the Modern Individual',
    description: 'Discover our collection of premium, sustainable clothing crafted for the modern wardrobe.',
    type: 'website',
    locale: 'ar_TN',
    siteName: 'LAMASETTE',
    images: [
      {
        url: '/favicon.ico',
        width: 32,
        height: 32,
        alt: 'LAMASETTE Favicon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LAMASETTE - Timeless Fashion',
    description: 'Premium, sustainable clothing for the modern wardrobe.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: 'eTBLhN83bAPwB_OLA-S5d3dEBuC6PjcTLl1Ngc4TIng',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          <CartDropdown />
          <main className="pt-16 min-h-screen">
            {children}
            <Analytics />
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}