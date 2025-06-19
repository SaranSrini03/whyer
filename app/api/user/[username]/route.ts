import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const { username } = params;

  try {
    await connectToDB();

    // Find the user by username
    const user = await User.findOne({ username }).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check for auth token in cookies
    const token = req.cookies.get('token')?.value;
    let currentUserId = null;

    if (token && JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        currentUserId = decoded.id;
      } catch (err) {
        console.warn('Invalid JWT token');
      }
    }

    // Check if the current user follows the profile user
    const isFollowing = currentUserId
      ? user.followers.map((id: string) => id.toString()).includes(currentUserId)
      : false;

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      questionsCount: user.questionsCount,
      pulsesCount: user.pulsesCount,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      isFollowing,
    });
  } catch (error) {
    console.error('[GET /api/user/[username]] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
