'use client';

import { useState, memo } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: {
    _id: string;
    author: {
      _id: string;
      username: string;
      name: string;
      avatar: string;
    };
    content: string;
    likes: Array<{
      _id: string;
      username: string;
      name: string;
      avatar: string;
    }>;
    createdAt: string;
  };
  currentUserId?: string;
  onLike?: () => void;
}

const PostCard = memo(function PostCard({ post, currentUserId, onLike }: PostCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const isLiked = currentUserId
    ? post.likes.some((like) => like._id === currentUserId)
    : false;

  const handleLike = async () => {
    if (!currentUserId || isLiking) return;
    
    setIsLiking(true);
    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post._id }),
      });
      
      if (response.ok && onLike) {
        onLike();
      }
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <article className="border-b border-gray-800 px-4 py-6 hover:bg-gray-900/50 transition-colors">
      <div className="flex gap-3">
        <Link href={`/profile/${post.author.username}`} prefetch={true}>
          <img
            src={post.author.avatar || '/default-avatar.png'}
            alt={post.author.name}
            className="h-10 w-10 rounded-full"
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/profile/${post.author.username}`}
              prefetch={true}
              className="font-semibold hover:underline"
            >
              {post.author.name}
            </Link>
            <Link
              href={`/profile/${post.author.username}`}
              prefetch={true}
              className="text-gray-500 text-sm hover:underline"
            >
              @{post.author.username}
            </Link>
            <span className="text-gray-500 text-sm">·</span>
            <time className="text-gray-500 text-sm">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </time>
          </div>
          
          <Link href={`/post/${post._id}`} prefetch={true}>
            <p className="text-white mb-4 whitespace-pre-wrap break-words">
              {post.content}
            </p>
          </Link>
          
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              disabled={!currentUserId || isLiking}
              className={`flex items-center gap-2 text-sm transition-colors ${
                isLiked
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-500 hover:text-red-500'
              } ${!currentUserId ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <svg
                className="h-5 w-5"
                fill={isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{post.likes.length}</span>
            </button>
            
            <Link
              href={`/post/${post._id}`}
              prefetch={true}
              className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Reply</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;

