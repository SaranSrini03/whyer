// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import Footer from '@/components/Assests/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Whyer',
  description: 'Curious minds connect here',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-mono">
        {children}
        <Toaster position="top-right" />
        <Footer />
      </body>
    </html>
  );
}
