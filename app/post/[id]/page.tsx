import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
import CommentComponent from '@/components/Comment';
import CommentForm from '@/components/CommentForm';

async function getPost(id: string) {
  try {
    await connectDB();
    const post = await Post.findById(id)
      .populate('author', 'username name avatar')
      .populate('likes', 'username name avatar')
      .lean();
    return post ? JSON.parse(JSON.stringify(post)) : null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

async function getComments(postId: string) {
  try {
    await connectDB();
    // Get top-level comments (no parentComment)
    const comments = await Comment.find({ post: postId, parentComment: null })
      .populate('author', 'username name avatar')
      .sort({ createdAt: -1 })
      .lean();

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment: any) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate('author', 'username name avatar')
          .sort({ createdAt: 1 })
          .lean();
        return {
          ...comment,
          _id: comment._id.toString(),
          author: {
            _id: comment.author._id.toString(),
            username: comment.author.username,
            name: comment.author.name,
            avatar: comment.author.avatar,
          },
          createdAt: comment.createdAt.toISOString(),
          replies: replies.map((reply: any) => ({
            ...reply,
            _id: reply._id.toString(),
            author: {
              _id: reply.author._id.toString(),
              username: reply.author.username,
              name: reply.author.name,
              avatar: reply.author.avatar,
            },
            createdAt: reply.createdAt.toISOString(),
          })),
        };
      })
    );

    return JSON.parse(JSON.stringify(commentsWithReplies));
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/signin');
  }

  const { id } = await params;
  const post = await getPost(id);
  const comments = await getComments(id);

  if (!post) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="max-w-2xl mx-auto pt-8 px-4">
          <p className="text-center text-gray-500">Post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-8 px-4">
        <PostCard post={post} currentUserId={session.user.id} />
        
        <div className="border-t border-gray-800 pt-4 mt-4">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          
          <CommentForm postId={id} currentUserId={session.user.id} />
          
          <div className="mt-6">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No comments yet</p>
            ) : (
              comments.map((comment: any) => (
                <CommentComponent
                  key={comment._id}
                  comment={comment}
                  postId={id}
                  currentUserId={session.user.id}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

