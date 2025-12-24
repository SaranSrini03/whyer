'use client';

import { useState, useEffect } from 'react';
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

export default function PeopleToFollow({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch('/api/users/suggestions');
        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleFollowChange = (userId: string, isFollowing: boolean) => {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, isFollowing } : user
      )
    );
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-2xl p-4">
        <h2 className="text-xl font-bold mb-4">Who to follow</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-gray-800 rounded" />
                  <div className="h-3 w-32 bg-gray-800 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-4">
      <h2 className="text-xl font-bold mb-4">Who to follow</h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user._id} className="flex items-center justify-between">
            <Link
              href={`/profile/${user.username}`}
              className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
            >
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
              </div>
            </Link>
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
                onFollowChange={(isFollowing) => handleFollowChange(user._id, isFollowing)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

