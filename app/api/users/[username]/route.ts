import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/utils';

// GET /api/users/[username] - Get user by username
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await connectDB();

    const { username } = await params;
    const user = await User.findOne({ username })
      .select('username name avatar bio followers following createdAt')
      .populate('followers', 'username name avatar')
      .populate('following', 'username name avatar');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentUser = await getCurrentUser();
    let isFollowing = false;
    if (currentUser) {
      isFollowing = user.followers.some(
        (follower: any) => follower._id.toString() === currentUser.id
      );
    }

    return NextResponse.json({
      ...user.toObject(),
      isFollowing,
      isOwnProfile: currentUser?.id === user._id.toString(),
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

