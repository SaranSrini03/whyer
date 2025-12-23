'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

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

export default function MessagesList({ currentUserId }: { currentUserId: string }) {
  const [conversations, setConversations] = useState<Map<string, Message[]>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would ideally fetch all conversations
    // For now, we'll show a message that DMs need to be accessed via user profile
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500 py-8">Loading...</div>;
  }

  return (
    <div>
      <p className="text-gray-500 text-sm mb-4">
        To start a conversation, visit a user's profile and click "Message"
      </p>
      {conversations.size === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p>No messages yet</p>
        </div>
      )}
    </div>
  );
}

