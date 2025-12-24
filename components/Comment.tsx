'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface CommentProps {
  comment: {
    _id: string;
    author: {
      _id: string;
      username: string;
      name: string;
      avatar: string;
    };
    content: string;
    createdAt: string;
    replies?: CommentProps['comment'][];
  };
  postId: string;
  currentUserId?: string;
  onReply?: () => void;
}

export default function Comment({ comment, postId, currentUserId, onReply }: CommentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          content: replyContent,
          parentCommentId: comment._id,
        }),
      });

      if (response.ok) {
        setReplyContent('');
        setShowReplyForm(false);
        router.refresh();
        if (onReply) {
          onReply();
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to post reply');
      }
    } catch (error) {
      console.error('Error replying to comment:', error);
      setError('Failed to post reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReply(e as any);
    }
  };

  return (
    <div className="py-4 border-b border-gray-800">
      <div className="flex gap-3">
        <Link href={`/profile/${comment.author.username}`}>
          <img
            src={comment.author.avatar || '/default-avatar.png'}
            alt={comment.author.name}
            className="h-8 w-8 rounded-full"
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/profile/${comment.author.username}`}
              className="font-semibold text-sm hover:underline"
            >
              {comment.author.name}
            </Link>
            <Link
              href={`/profile/${comment.author.username}`}
              className="text-gray-500 text-xs hover:underline"
            >
              @{comment.author.username}
            </Link>
            <span className="text-gray-500 text-xs">·</span>
            <time className="text-gray-500 text-xs">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </time>
          </div>
          
          <p className="text-white text-sm whitespace-pre-wrap break-words mb-2">
            {comment.content}
          </p>
          
          {currentUserId && comment.replies !== undefined && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Reply
            </button>
          )}
          
          {showReplyForm && (
            <form onSubmit={handleReply} className="mt-3">
              {error && (
                <div className="mb-2 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
                  {error}
                </div>
              )}
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a reply..."
                className="w-full resize-none bg-gray-900 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 text-sm"
                rows={2}
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={!replyContent.trim() || isSubmitting}
                  className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                  {isSubmitting ? 'Replying...' : 'Reply'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent('');
                    setError(null);
                  }}
                  className="rounded-full border border-gray-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-6 space-y-4 border-l-2 border-gray-800 pl-4">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply._id}
                  comment={{ ...reply, replies: undefined }}
                  postId={postId}
                  currentUserId={currentUserId}
                  onReply={onReply}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

