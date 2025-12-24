import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/utils';

// GET /api/users/search - Search for users by username or name
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ users: [] });
    }

    const searchRegex = new RegExp(query.trim(), 'i');
    const users = await User.find({
      $or: [
        { username: searchRegex },
        { name: searchRegex },
      ],
      _id: { $ne: user.id }, // Exclude current user
    })
      .select('username name avatar bio followers following')
      .limit(10)
      .lean();

    // Check if current user is following each user
    const currentUser = await User.findById(user.id).select('following').lean();
    const followingIds = new Set(
      (currentUser?.following || []).map((id: any) => id.toString())
    );

    const usersWithFollowStatus = users.map((u) => ({
      ...u,
      isFollowing: followingIds.has(u._id.toString()),
    }));

    return NextResponse.json({ users: usersWithFollowStatus });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ error: 'Failed to search users' }, { status: 500 });
  }
}

