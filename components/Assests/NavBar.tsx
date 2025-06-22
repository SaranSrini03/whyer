'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMe } from '@/hooks/useMe';
import Ask from '@/components/Assests/Ask';
import { Plus } from 'lucide-react';

import Modal from '@/components/Modal';

// Define User interface
interface User {

  _id: string;
  name: string;
  username: string;
  email: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { me } = useMe();
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch users with debounce
  const searchUsers = useCallback(async (query: string) => {
    try {
      const response = await fetch(`/api/search/users?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }, []);

  // Search effect with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(async () => {
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, searchUsers]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      // Clear token cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      // Redirect and refresh
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      if (searchRef.current) searchRef.current.blur();
    }
  };

  // Handle user selection from search results
  const handleUserSelect = (username: string) => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
    router.push(`/${username}`); // Now routes to /@username
  };

  // Active link styling
  const isActive = (path: string) => (
    pathname === path ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
  );

  // Profile dropdown
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
          {/* Left section: Logo and Navigation */}
          <div className="flex items-center space-x-10">
            {/* Logo */}
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
            <nav className="hidden md:flex items-center space-x-8">

              <Link
                href="/trending"
                className={`${isActive('/trending')} relative transition-colors duration-300 group`}
              >
                Trending
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-yellow-400 transition-all duration-300 ${pathname === '/trending' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
              <Link
                href="/live"
                className={`${isActive('/live')} relative transition-colors duration-300 group`}
              >
                Live
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-yellow-400 transition-all duration-300 ${pathname === '/live' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            </nav>
          </div>

          {/* Right section: Search, Ask Button, and Profile */}
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className={`hidden md:flex items-center transition-all duration-300 ${isSearchFocused ? 'w-72' : 'w-56'
                }`}
            >
              <div className="relative w-full" ref={searchContainerRef}>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search users..."
                  className="w-full bg-gray-800/50 border border-yellow-900/30 rounded-full py-2 px-4 pl-10 text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {isSearchFocused && searchQuery.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-full rounded-lg shadow-xl py-2 z-50 border border-yellow-900/30 bg-black backdrop-blur-md backdrop-saturate-150 max-h-60 overflow-y-auto"
                    >
                      {isSearching ? (
                        <div className="px-4 py-2 flex justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                        </div>
                      ) : searchResults.length > 0 ? (
                        searchResults.map(user => (
                          <button
                            key={user._id}
                            className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-200 hover:bg-gray-700/50 hover:text-white transition-all"
                            onClick={() => handleUserSelect(user.username)}
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-white mr-3">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-center text-gray-400">
                          {searchQuery.trim() ? "No users found" : "Search by name or email"}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>

            {/* Ask Button with Plus Icon */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block"
            >
              <button
                onClick={() => setIsAskModalOpen(true)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-black border border-yellow-400 cursor-pointer  text-white hover:from-yellow-600 hover:to-yellow-800 transition-all"
                aria-label="Ask a question"
              >
                <Plus className="h-6 w-6" />
              </button>
            </motion.div>


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
                  {me?.name ? (
                    <span className="text-xs font-medium">
                      {me.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0H3z" />
                    </svg>
                  )}
                </motion.div>
              </button>
              {renderProfileDropdown()}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-between items-center py-3 border-t border-yellow-900/20 mt-1 px-6">
          <Link
            href="/"
            className={`${isActive('/')} relative transition-colors duration-300 group flex flex-col items-center`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Home</span>
            <span className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-400 transition-all duration-300 ${pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>

          <Link
            href="/trending"
            className={`${isActive('/trending')} relative transition-colors duration-300 group flex flex-col items-center`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xs mt-1">Trending</span>
            <span className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-400 transition-all duration-300 ${pathname === '/trending' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>

          <Link
            href="/ask"
            className={`${isActive('/ask')} relative transition-colors duration-300 group flex flex-col items-center`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            <span className="text-xs mt-1">Ask</span>
            <span className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-400 transition-all duration-300 ${pathname === '/ask' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
        </div>
      </div>
      <Modal isOpen={isAskModalOpen} onClose={() => setIsAskModalOpen(false)}>
        <Ask />
      </Modal>

    </div>

  );
}