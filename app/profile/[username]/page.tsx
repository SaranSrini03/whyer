import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Post from '@/models/Post';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
import FollowButton from '@/components/FollowButton';

async function getUser(username: string, currentUserId?: string) {
  try {
    await connectDB();
    const user = await User.findOne({ username })
      .select('username name avatar bio followers following createdAt')
      .lean();

    if (!user) return null;

    let isFollowing = false;
    let isOwnProfile = false;
    if (currentUserId) {
      isOwnProfile = user._id.toString() === currentUserId;
      const followerIds = (user.followers || []).map((f: any) => f.toString());
      isFollowing = followerIds.includes(currentUserId);
    }

    const followerCount = user.followers?.length || 0;
    const followingCount = user.following?.length || 0;

    return {
      ...user,
      _id: user._id.toString(),
      followers: [],
      following: [],
      followerCount,
      followingCount,
      isFollowing,
      isOwnProfile,
      createdAt: user.createdAt.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

async function getUserPosts(userId: string) {
  try {
    await connectDB();
    const posts = await Post.find({ author: userId })
      .populate('author', 'username name avatar')
      .populate('likes', 'username name avatar')
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    const { username } = await params;
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(`/profile/${username}`)}`);
  }

  const { username } = await params;
  const user = await getUser(username, session.user.id);
  const posts = user ? await getUserPosts(user._id) : [];

  if (!user) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-grid-pattern"></div>
        <Navbar />
        <div className="relative z-10 max-w-2xl mx-auto pt-8 px-4">
          <div className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] rounded-2xl p-8 border border-white/10 backdrop-blur-xl">
            <p className="text-center text-gray-500">User not found</p>
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
        <div className="mb-8 opacity-0 animate-[fadeIn_0.7s_ease-out_0.2s_forwards]">
          <div className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
            <div className="flex items-start gap-4 mb-4">
              <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.name}
                className="h-20 w-20 rounded-full border-2 border-white/10"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-semibold mb-1 tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                  {user.name}
                </h1>
                <p className="text-gray-500 mb-2 font-medium">@{user.username}</p>
                {user.bio && <p className="text-gray-300 mb-4 text-sm leading-relaxed">{user.bio}</p>}
                
                <div className="flex items-center gap-6 mb-4 text-sm">
                  <span className="text-gray-500">
                    <span className="text-white font-semibold">{user.followingCount || 0}</span> following
                  </span>
                  <span className="text-gray-500">
                    <span className="text-white font-semibold">{user.followerCount || 0}</span> followers
                  </span>
                </div>
                
                {!user.isOwnProfile && (
                  <div className="flex gap-3">
                    <FollowButton
                      userId={user._id}
                      isFollowing={user.isFollowing}
                      currentUserId={session.user.id}
                    />
                    <Link
                      href={`/messages/${user._id}`}
                      prefetch={true}
                      className="rounded-xl border border-white/10 px-6 py-2 text-sm font-medium text-white hover:bg-white/5 transition-all duration-200 hover:border-white/20"
                    >
                      Message
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 opacity-0 translate-y-4 animate-[fadeInUp_0.7s_ease-out_0.4s_forwards]">
          <h2 className="text-2xl font-semibold mb-6 tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            Posts
          </h2>
          <div className="space-y-0">
            {posts.length === 0 ? (
              <div className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] rounded-2xl p-8 border border-white/10 backdrop-blur-xl text-center">
                <p className="text-gray-500">No posts yet</p>
              </div>
            ) : (
              posts.map((post: any) => (
                <PostCard
                  key={post._id}
                  post={post}
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

