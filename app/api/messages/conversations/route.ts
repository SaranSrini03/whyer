import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import { getCurrentUser } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const currentUserId = new mongoose.Types.ObjectId(user.id);

    const messages = await Message.find({
      $or: [
        { sender: currentUserId },
        { receiver: currentUserId },
      ],
    })
      .populate('sender', 'username name avatar')
      .populate('receiver', 'username name avatar')
      .sort({ createdAt: -1 })
      .lean();

    const conversationsMap = new Map<string, any>();

    messages.forEach((message: any) => {
      const otherUser = message.sender._id.toString() === user.id
        ? message.receiver
        : message.sender;

      const otherUserId = otherUser._id.toString();

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          user: {
            _id: otherUser._id.toString(),
            username: otherUser.username,
            name: otherUser.name,
            avatar: otherUser.avatar,
          },
          lastMessage: {
            content: message.content,
            createdAt: message.createdAt.toISOString(),
          },
          unreadCount: 0,
        });
      }

      const conversation = conversationsMap.get(otherUserId);
      const isUnread = !message.read && message.receiver._id.toString() === user.id;
      if (isUnread) {
        conversation.unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values()).sort(
      (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

