'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  currentUserId: string;
  onFollowChange?: (isFollowing: boolean) => void;
}

export default function FollowButton({ 
  userId, 
  isFollowing: initialIsFollowing, 
  currentUserId,
  onFollowChange 
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollow = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.following);
        if (onFollowChange) {
          onFollowChange(data.following);
        }
        router.refresh();
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
        isFollowing
          ? 'border border-gray-700 text-white hover:bg-gray-900'
          : 'bg-white text-black hover:bg-gray-200'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}

