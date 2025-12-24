import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/utils';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/feed - Get feed with posts from user and following (cursor-based pagination)
export async function GET(request: NextRequest) {
  try {
    // Get user with better error handling
    let user;
    try {
      user = await getCurrentUser();
    } catch (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database with error handling
    try {
      await connectDB();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get current user's following list
    let currentUser;
    try {
      currentUser = await User.findById(user.id).select('following');
    } catch (userError) {
      console.error('Error fetching user:', userError);
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }

    const followingIds = currentUser?.following || [];
    
    // Include current user's posts in feed - convert all to ObjectIds
    const authorIds = [
      ...followingIds.map((id: any) => new mongoose.Types.ObjectId(id.toString())),
      new mongoose.Types.ObjectId(user.id),
    ];

    const query: any = {
      author: { $in: authorIds },
    };

    if (cursor) {
      try {
        query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
      } catch (cursorError) {
        console.error('Invalid cursor:', cursorError);
        // Continue without cursor if it's invalid
      }
    }

    let posts;
    try {
      posts = await Post.find(query)
        .populate('author', 'username name avatar')
        .populate('likes', 'username name avatar')
        .sort({ createdAt: -1 })
        .limit(limit + 1)
        .lean();
    } catch (postsError) {
      console.error('Error fetching posts:', postsError);
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }

    const hasMore = posts.length > limit;
    const postsToReturn = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore && postsToReturn.length > 0 ? postsToReturn[postsToReturn.length - 1]._id.toString() : null;

    const serializedPosts = postsToReturn.map((post: any) => ({
      ...post,
      _id: post._id?.toString() || '',
      author: {
        _id: (post.author as any)?._id?.toString() || (typeof post.author === 'string' ? post.author : ''),
        username: (post.author as any)?.username || '',
        name: (post.author as any)?.name || '',
        avatar: (post.author as any)?.avatar || '',
      },
      likes: ((post.likes as any[]) || []).map((like: any) => ({
        _id: like._id?.toString() || (typeof like === 'string' ? like : ''),
        username: like.username || '',
        name: like.name || '',
        avatar: like.avatar || '',
      })),
      createdAt: post.createdAt?.toISOString() || new Date().toISOString(),
    }));

    return NextResponse.json({
      posts: serializedPosts,
      nextCursor,
      hasMore,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Unexpected error fetching feed:', error);
    console.error('Error stack:', error?.stack);
    return NextResponse.json(
      { 
        error: 'Failed to fetch feed',
        message: error?.message || 'Unknown error',
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

