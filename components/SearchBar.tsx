'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import FollowButton from './FollowButton';

interface User {
  _id: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  followers: any[];
  isFollowing: boolean;
}

export default function SearchBar({ currentUserId }: { currentUserId: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.users || []);
        setShowResults(true);
      } catch (error) {
        console.error('Error searching users:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <svg
            className="h-5 w-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setShowResults(true)}
          placeholder="Search"
          className="w-full rounded-full bg-gray-900 border border-gray-800 py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 focus:bg-gray-800 transition-colors"
        />
      </div>

      {showResults && (query.trim() || results.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-black border border-gray-800 rounded-2xl shadow-xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          ) : results.length === 0 && query.trim() ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No users found
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {results.map((user) => (
                <Link
                  key={user._id}
                  href={`/profile/${user.username}`}
                  className="block hover:bg-gray-900 transition-colors"
                  onClick={() => {
                    setShowResults(false);
                    setQuery('');
                  }}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={user.avatar || '/default-avatar.png'}
                        alt={user.name}
                        className="h-12 w-12 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          @{user.username}
                        </p>
                        {user.bio && (
                          <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <FollowButton
                        userId={user._id}
                        isFollowing={user.isFollowing}
                        currentUserId={currentUserId}
                        onFollowChange={(isFollowing) => {
                          setResults((prev) =>
                            prev.map((u) =>
                              u._id === user._id ? { ...u, isFollowing } : u
                            )
                          );
                        }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

