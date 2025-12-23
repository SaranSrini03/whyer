import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/utils';

// GET /api/messages?userId=xxx - Get messages between current user and another user
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get messages where current user is sender or receiver
    const currentUserId = new mongoose.Types.ObjectId(user.id);
    const otherUserId = new mongoose.Types.ObjectId(userId);
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    })
      .populate('sender', 'username name avatar')
      .populate('receiver', 'username name avatar')
      .sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST /api/messages - Send a message
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { receiverId, content } = body;

    if (!receiverId || !content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Receiver ID and content are required' }, { status: 400 });
    }

    if (receiverId === user.id) {
      return NextResponse.json({ error: 'Cannot send message to yourself' }, { status: 400 });
    }

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });
    }

    const message = await Message.create({
      sender: new mongoose.Types.ObjectId(user.id),
      receiver: new mongoose.Types.ObjectId(receiverId),
      content: content.trim(),
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username name avatar')
      .populate('receiver', 'username name avatar');

    return NextResponse.json(populatedMessage, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

