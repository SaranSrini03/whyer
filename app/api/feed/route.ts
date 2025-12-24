import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/utils';

// GET /api/feed - Get feed with posts from user and following (cursor-based pagination)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get current user's following list
    const currentUser = await User.findById(user.id).select('following');
    const followingIds = currentUser?.following || [];
    
    // Include current user's posts in feed
    const authorIds = [...followingIds.map((id: any) => id.toString()), user.id];

    const query: any = {
      author: { $in: authorIds },
    };

    if (cursor) {
      query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    const posts = await Post.find(query)
      .populate('author', 'username name avatar')
      .populate('likes', 'username name avatar')
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = posts.length > limit;
    const postsToReturn = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? postsToReturn[postsToReturn.length - 1]._id.toString() : null;

    const serializedPosts = postsToReturn.map((post: any) => ({
      ...post,
      _id: post._id.toString(),
      author: {
        _id: post.author._id.toString(),
        username: post.author.username,
        name: post.author.name,
        avatar: post.author.avatar,
      },
      likes: post.likes.map((like: any) => ({
        _id: like._id.toString(),
        username: like.username,
        name: like.name,
        avatar: like.avatar,
      })),
      createdAt: post.createdAt.toISOString(),
    }));

    return NextResponse.json({
      posts: serializedPosts,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching feed:', error);
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
  }
}

