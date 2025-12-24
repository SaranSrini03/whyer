'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  user: {
    _id: string;
    username: string;
    name: string;
    avatar: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

export default function MessagesList({ currentUserId }: { currentUserId: string }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-8">Loading...</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <p>No messages yet</p>
        <p className="text-sm mt-2">
          To start a conversation, visit a user's profile and click "Message"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <Link
          key={conversation.user._id}
          href={`/messages/${conversation.user._id}`}
          onClick={async () => {
            const response = await fetch(`/api/messages/read`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: conversation.user._id }),
            });
            if (response.ok) {
              window.dispatchEvent(new CustomEvent('messagesRead'));
            }
          }}
          className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-900 transition-colors border-b border-gray-800"
        >
          <img
            src={conversation.user.avatar || '/default-avatar.png'}
            alt={conversation.user.name}
            className="h-12 w-12 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-white truncate">{conversation.user.name}</p>
              <div className="flex items-center gap-2">
                {conversation.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                    {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                  </span>
                )}
                <p className="text-xs text-gray-500 ml-2">
                  {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'text-white font-medium' : 'text-gray-500'}`}>
              {conversation.lastMessage.content}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

