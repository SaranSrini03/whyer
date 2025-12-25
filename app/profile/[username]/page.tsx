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
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="max-w-2xl mx-auto pt-8 px-4">
          <p className="text-center text-gray-500">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-8 px-4">
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <img
              src={user.avatar || '/default-avatar.png'}
              alt={user.name}
              className="h-20 w-20 rounded-full"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
              <p className="text-gray-500 mb-2">@{user.username}</p>
              {user.bio && <p className="text-white mb-4">{user.bio}</p>}
              
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
                    className="rounded-full border border-gray-700 px-6 py-2 text-sm font-semibold text-white hover:bg-gray-900 transition-colors"
                  >
                    Message
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <h2 className="text-xl font-semibold mb-4">Posts</h2>
          <div className="divide-y divide-gray-800">
            {posts.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No posts yet</p>
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

