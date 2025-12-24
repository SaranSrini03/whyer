import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/utils';

// GET /api/users/suggestions - Get people to follow suggestions
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const currentUser = await User.findById(user.id).select('following').lean();
    const followingIds = (currentUser?.following || []).map((id: any) => 
      typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id
    );
    const excludeIds = [
      ...followingIds,
      new mongoose.Types.ObjectId(user.id), // Exclude self
    ];

    // Get users that:
    // 1. Are not the current user
    // 2. Are not already being followed
    // 3. Order by follower count (most popular first)
    const suggestions = await User.find({
      _id: { $nin: excludeIds },
    })
      .select('username name avatar bio followers following')
      .sort({ followers: -1 }) // Sort by follower count
      .limit(5)
      .lean();

    // If we don't have enough users, fill with any users (random order)
    if (suggestions.length < 5) {
      const existingIds = [
        ...excludeIds,
        ...suggestions.map((u) => new mongoose.Types.ObjectId(u._id)),
      ];
      
      const additionalUsers = await User.find({
        _id: { $nin: existingIds },
      })
        .select('username name avatar bio followers following')
        .limit(5 - suggestions.length)
        .lean();

      suggestions.push(...additionalUsers);
    }

    const followingIdsSet = new Set(
      (currentUser?.following || []).map((id: any) => 
        typeof id === 'string' ? id : id.toString()
      )
    );

    const suggestionsWithFollowStatus = suggestions.map((u) => ({
      ...u,
      isFollowing: followingIdsSet.has(u._id.toString()),
    }));

    return NextResponse.json({ users: suggestionsWithFollowStatus });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}

