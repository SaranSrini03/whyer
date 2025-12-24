'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import PostCard from './PostCard';
import CreatePost from './CreatePost';

interface Post {
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
}

export default function Feed({ currentUserId }: { currentUserId?: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async (reset = false) => {
    if (reset) {
      setPosts([]);
      setCursor(null);
      setHasMore(true);
      setLoading(true);
    }

    try {
      // Get current cursor value
      const currentCursor = reset ? null : cursor;
      const url = `/api/feed${currentCursor ? `?cursor=${currentCursor}` : ''}`;
      const response = await fetch(url, { cache: 'no-store' });
      const data = await response.json();

      if (reset) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }

      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [cursor]);

  const checkForNewPosts = useCallback(async () => {
    if (posts.length === 0 || loading) return;

    try {
      const response = await fetch('/api/feed?limit=10', { cache: 'no-store' });
      const data = await response.json();
      
      if (data.posts && data.posts.length > 0) {
        const firstPostId = posts[0]?._id;
        const newPosts = data.posts.filter(
          (newPost: Post) => !posts.some((existingPost) => existingPost._id === newPost._id)
        );

        if (newPosts.length > 0) {
          setPosts((prev) => {
            const existingIds = new Set(prev.map((p) => p._id));
            const uniqueNewPosts = newPosts.filter((p: Post) => !existingIds.has(p._id));
            return [...uniqueNewPosts, ...prev];
          });
        }
      }
    } catch (error) {
      console.error('Error checking for new posts:', error);
    }
  }, [posts, loading]);

  useEffect(() => {
    fetchPosts(true);
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;

    const interval = setInterval(() => {
      checkForNewPosts();
    }, 5000);

    const handleNewPost = () => {
      checkForNewPosts();
    };

    window.addEventListener('newPostCreated', handleNewPost);

    return () => {
      clearInterval(interval);
      window.removeEventListener('newPostCreated', handleNewPost);
    };
  }, [posts, checkForNewPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPosts();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, fetchPosts]);

  const handlePostCreated = () => {
    fetchPosts(true);
  };

  const handleLike = () => {
    fetchPosts(true);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <CreatePost onPostCreated={handlePostCreated} />
        <div className="space-y-4 p-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 bg-gray-800 rounded" />
                  <div className="h-20 w-full bg-gray-800 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <CreatePost onPostCreated={handlePostCreated} />
      
      <div className="divide-y divide-gray-800">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            currentUserId={currentUserId}
            onLike={handleLike}
          />
        ))}
      </div>

      {hasMore && (
        <div ref={observerTarget} className="py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="py-8 text-center text-gray-500 text-sm">
          No more posts to load
        </div>
      )}
    </div>
  );
}

