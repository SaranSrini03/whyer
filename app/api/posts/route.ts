import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/utils';

// GET /api/posts - Get posts with cursor-based pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '10');
    const authorId = searchParams.get('authorId');

    const query: any = {};
    if (authorId) {
      query.author = new mongoose.Types.ObjectId(authorId);
    }
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
        _id: (post.author as any)._id.toString(),
        username: (post.author as any).username,
        name: (post.author as any).name,
        avatar: (post.author as any).avatar,
      },
      likes: (post.likes || []).map((like: any) => ({
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
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: 'Content must be 1000 characters or less' }, { status: 400 });
    }

    const post = await Post.create({
      author: new mongoose.Types.ObjectId(user.id),
      content: content.trim(),
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username name avatar')
      .populate('likes', 'username name avatar')
      .lean();

    if (!populatedPost) {
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }

    const serializedPost = {
      ...populatedPost,
      _id: populatedPost._id.toString(),
      author: {
        _id: (populatedPost.author as any)._id.toString(),
        username: (populatedPost.author as any).username,
        name: (populatedPost.author as any).name,
        avatar: (populatedPost.author as any).avatar,
      },
      likes: ((populatedPost.likes as any[]) || []).map((like: any) => ({
        _id: like._id.toString(),
        username: like.username,
        name: like.name,
        avatar: like.avatar,
      })),
      createdAt: populatedPost.createdAt.toISOString(),
    };

    return NextResponse.json(serializedPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

