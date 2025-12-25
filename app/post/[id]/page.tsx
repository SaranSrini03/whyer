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
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-grid-pattern"></div>
        <Navbar />
        <div className="relative z-10 max-w-2xl mx-auto pt-8 px-4">
          <div className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] rounded-2xl p-8 border border-white/10 backdrop-blur-xl">
            <p className="text-center text-gray-500">Post not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-grid-pattern"></div>
      
      <Navbar />
      <div className="relative z-10 max-w-2xl mx-auto pt-8 px-4">
        <div className="opacity-0 animate-[fadeIn_0.7s_ease-out_0.2s_forwards]">
          <PostCard post={post} currentUserId={session.user.id} />
        </div>
        
        <div className="border-t border-white/10 pt-6 mt-6 opacity-0 translate-y-4 animate-[fadeInUp_0.7s_ease-out_0.4s_forwards]">
          <h2 className="text-2xl font-semibold mb-6 tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            Comments
          </h2>
          
          <div className="mb-6">
            <CommentForm postId={id} currentUserId={session.user.id} />
          </div>
          
          <div className="mt-6 space-y-0">
            {comments.length === 0 ? (
              <div className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] rounded-2xl p-8 border border-white/10 backdrop-blur-xl text-center">
                <p className="text-gray-500">No comments yet</p>
              </div>
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

