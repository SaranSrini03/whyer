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
          replies,
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
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/signin');
  }

  const post = await getPost(params.id);
  const comments = await getComments(params.id);

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
          
          <CommentForm postId={params.id} currentUserId={session.user.id} />
          
          <div className="mt-6">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No comments yet</p>
            ) : (
              comments.map((comment: any) => (
                <CommentComponent
                  key={comment._id}
                  comment={comment}
                  postId={params.id}
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

