// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  // Helper function to determine if link is active
  const isActive = (path: string) => {
    return pathname === path ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400';
  };

  return (
    <div className="relative z-10 border-b border-yellow-900/30 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="w-8 h-8 border border-yellow-500/40 text-yellow-400 flex items-center justify-center text-lg mr-2">
            W
          </div>
          <span className="text-xl font-light">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Whyer
            </span>
          </span>
        </Link>
        
        <nav className="flex space-x-6">
          <Link href="/" className={`${isActive('/')} transition-colors duration-300`}>
            Home
          </Link>
          <Link href="/ask" className={`${isActive('/ask')} transition-colors duration-300`}>
            Ask
          </Link>
          <Link href="/profile" className={`${isActive('/profile')} transition-colors duration-300`}>
            Profile
          </Link>
        </nav>
      </div>
    </div>
  );
}