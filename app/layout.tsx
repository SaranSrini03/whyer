// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Whyer',
  description: 'Curious minds connect here',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-mono">
        {children}
        <Footer />
      </body>
    </html>
  );
}
