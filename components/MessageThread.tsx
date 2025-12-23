'use client';

import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
    name: string;
    avatar: string;
  };
  receiver: {
    _id: string;
    username: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
}

interface MessageThreadProps {
  userId: string;
  currentUserId: string;
}

export default function MessageThread({ userId, currentUserId }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: userId,
          content,
        }),
      });

      if (response.ok) {
        setContent('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-8">Loading...</div>;
  }

  const otherUser = messages[0]?.sender._id === currentUserId
    ? messages[0]?.receiver
    : messages[0]?.sender;

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {otherUser && (
        <div className="border-b border-gray-800 pb-4 mb-4">
          <Link
            href={`/profile/${otherUser.username}`}
            className="flex items-center gap-3"
          >
            <img
              src={otherUser.avatar || '/default-avatar.png'}
              alt={otherUser.name}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{otherUser.name}</p>
              <p className="text-sm text-gray-500">@{otherUser.username}</p>
            </div>
          </Link>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No messages yet</p>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender._id === currentUserId;
            return (
              <div
                key={message._id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                  {!isOwn && (
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={message.sender.avatar || '/default-avatar.png'}
                        alt={message.sender.name}
                        className="h-6 w-6 rounded-full"
                      />
                      <span className="text-xs text-gray-500">{message.sender.name}</span>
                    </div>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      isOwn
                        ? 'bg-white text-black'
                        : 'bg-gray-900 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-gray-600' : 'text-gray-400'}`}>
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-800 pt-4">
        <div className="flex gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 resize-none bg-gray-900 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
            rows={2}
          />
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="rounded-lg bg-white px-6 py-2 text-sm font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors self-end"
          >
            {isSubmitting ? '...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}

