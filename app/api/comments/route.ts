import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import { getCurrentUser } from '@/lib/utils';

// GET /api/comments?postId=xxx - Get comments for a post
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Get top-level comments (no parentComment)
    const comments = await Comment.find({ 
      post: new mongoose.Types.ObjectId(postId), 
      parentComment: null 
    })
      .populate('author', 'username name avatar')
      .sort({ createdAt: -1 });

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate('author', 'username name avatar')
          .sort({ createdAt: 1 });
        return {
          ...comment.toObject(),
          replies,
        };
      })
    );

    return NextResponse.json(commentsWithReplies);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST /api/comments - Create a comment or reply
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { postId, content, parentCommentId } = body;

    if (!postId || !content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Post ID and content are required' }, { status: 400 });
    }

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // If parentCommentId is provided, verify it exists
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
      }
    }

    const comment = await Comment.create({
      post: new mongoose.Types.ObjectId(postId),
      author: new mongoose.Types.ObjectId(user.id),
      content: content.trim(),
      parentComment: parentCommentId ? new mongoose.Types.ObjectId(parentCommentId) : null,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username name avatar');

    return NextResponse.json(populatedComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

