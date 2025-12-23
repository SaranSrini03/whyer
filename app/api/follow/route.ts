import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/utils';

// POST /api/follow - Follow or unfollow a user
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (userId === user.id) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    const currentUser = await User.findById(user.id);
    const targetUserId = new mongoose.Types.ObjectId(userId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentUserId = new mongoose.Types.ObjectId(user.id);
    const isFollowing = currentUser.following.some(
      (id) => id.toString() === targetUserId.toString()
    );

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId.toString()
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId.toString()
      );
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    const updatedTargetUser = await User.findById(userId)
      .select('username name avatar bio followers following');

    return NextResponse.json({
      following: !isFollowing,
      user: updatedTargetUser,
    });
  } catch (error) {
    console.error('Error toggling follow:', error);
    return NextResponse.json({ error: 'Failed to toggle follow' }, { status: 500 });
  }
}

