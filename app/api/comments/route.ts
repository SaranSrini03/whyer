import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import User from '@/models/User';
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
        const commentObj = comment.toObject() as any;
        const replies = await Comment.find({ parentComment: comment._id })
          .populate('author', 'username name avatar')
          .sort({ createdAt: 1 })
          .lean();
        return {
          ...commentObj,
          _id: commentObj._id.toString(),
          author: {
            _id: (commentObj.author as any)._id.toString(),
            username: (commentObj.author as any).username,
            name: (commentObj.author as any).name,
            avatar: (commentObj.author as any).avatar,
          },
          createdAt: commentObj.createdAt.toISOString(),
          replies: replies.map((reply: any) => ({
            ...reply,
            _id: reply._id.toString(),
            author: {
              _id: (reply.author as any)._id.toString(),
              username: (reply.author as any).username,
              name: (reply.author as any).name,
              avatar: (reply.author as any).avatar,
            },
            createdAt: reply.createdAt.toISOString(),
          })),
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

    // Verify user exists in database
    if (!mongoose.Types.ObjectId.isValid(user.id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const dbUser = await User.findById(user.id);
    if (!dbUser) {
      console.error(`User not found in database: ${user.id}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { postId, content, parentCommentId } = body;

    if (!postId || !content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Post ID and content are required' }, { status: 400 });
    }

    // Validate postId format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ error: 'Invalid post ID format' }, { status: 400 });
    }

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      console.error(`Post not found in database: ${postId}`);
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
      .populate('author', 'username name avatar')
      .lean();

    if (!populatedComment || !populatedComment.author) {
      return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }

    const responseComment = {
      ...populatedComment,
      _id: populatedComment._id.toString(),
      author: {
        _id: (populatedComment.author as any)._id.toString(),
        username: (populatedComment.author as any).username,
        name: (populatedComment.author as any).name,
        avatar: (populatedComment.author as any).avatar,
      },
      createdAt: populatedComment.createdAt.toISOString(),
    };

    return NextResponse.json(responseComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

