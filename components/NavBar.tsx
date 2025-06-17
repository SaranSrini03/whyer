'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMe } from '@/hooks/useMe';


export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { me} = useMe();

  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Logout handler
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/');
  };

  // Active link styling
  const isActive = (path: string) => (
    pathname === path ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
  );

  // Shared dropdown JSX with animations
  const renderProfileDropdown = () => (
    <AnimatePresence>
      {isProfileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl py-1 z-50 border border-yellow-900/30
                      bg-black backdrop-blur-md backdrop-saturate-150"
        >
          <div className="px-4 py-3 border-b border-yellow-900/20">
            <p className="text-sm font-medium text-white">Signed in as</p>
            <p className="text-sm text-yellow-400 truncate">{me?.email}</p>
          </div>
          <Link
            href="/profile"
            className="flex items-center px-4 py-3 text-sm text-gray-200 hover:bg-gray-700/50 hover:text-white transition-all"
            onClick={() => setIsProfileOpen(false)}
          >
            <svg className="h-5 w-5 mr-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Profile Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-700/50 hover:text-red-300 transition-all"
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Sign out
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative z-50 border-b border-yellow-900/20 bg-black backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with subtle hover effect */}
          <Link href="/" className="flex items-center group">
            <motion.span 
              className="text-xl font-medium"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Whyer
              </span>
              <span className="block h-0.5 bg-gradient-to-r from-yellow-400/50 to-yellow-600/50 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 relative">
            <Link 
              href="/" 
              className={`${isActive('/')} relative transition-colors duration-300 group`}
            >
              Home
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-yellow-400 transition-all duration-300 ${pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link 
              href="/ask" 
              className={`${isActive('/ask')} relative transition-colors duration-300 group`}
            >
              Ask
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-yellow-400 transition-all duration-300 ${pathname === '/ask' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            
            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-haspopup="true"
                aria-expanded={isProfileOpen}
                aria-label="Toggle profile menu"
                className="relative p-1 rounded-full text-gray-400 hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              >
                <motion.div 
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0H3z" />
                  </svg>
                </motion.div>
              </button>
              {renderProfileDropdown()}
            </div>
          </nav>

          {/* Mobile Profile Icon */}
          <div className="md:hidden relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-haspopup="true"
              aria-expanded={isProfileOpen}
              aria-label="Open profile menu"
              className="p-1 rounded-full text-gray-400 hover:text-yellow-400 transition-colors focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0H3z" />
                </svg>
              </div>
            </button>
            {renderProfileDropdown()}
          </div>
        </div>
      </div>
    </div>
  );
}