'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePost({ onPostCreated }: { onPostCreated?: () => void }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setContent('');
        if (onPostCreated) {
          onPostCreated();
        } else {
          router.refresh();
        }
        window.dispatchEvent(new CustomEvent('newPostCreated'));
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-b border-gray-800 px-4 py-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What's happening?"
        className="w-full resize-none bg-transparent text-white placeholder-gray-500 focus:outline-none"
        rows={3}
        maxLength={1000}
      />
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {content.length}/1000
        </span>
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
}

