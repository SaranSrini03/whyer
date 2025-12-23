'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CommentFormProps {
  postId: string;
  currentUserId: string;
}

export default function CommentForm({ postId, currentUserId }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          content,
        }),
      });

      if (response.ok) {
        setContent('');
        router.refresh();
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="w-full resize-none bg-gray-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
        rows={3}
      />
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}

