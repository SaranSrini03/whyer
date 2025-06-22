import { connectToDB } from '@/lib/db';
import Why from '@/models/Why';
import User from '@/models/User'; // ✅ Import this
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 1. Parse JSON body
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { title, description } = body;

  if (!title || !description || typeof title !== 'string' || typeof description !== 'string') {
    return NextResponse.json({ error: 'Title and description are required and must be strings.' }, { status: 400 });
  }

  // 2. Get token from cookies
  const cookieHeader = (await headers()).get('cookie');
  const token = cookieHeader
    ?.split('; ')
    .find(c => c.startsWith('token='))
    ?.split('=')[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized. No token found.' }, { status: 401 });
  }

  // 3. Decode token and get userId
  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === 'object' && 'userId' in decoded) {
      userId = decoded.userId;
    } else {
      return NextResponse.json({ error: 'Invalid token payload.' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 403 });
  }

  // 4. Connect to DB and fetch user details
  try {
    await connectToDB();

    const user = await User.findById(userId).lean(); // ✅ Get name & username
    if (!user || Array.isArray(user)) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // 5. Create the Why with embedded user info
    const newWhy = await Why.create({
      title,
      description,
      userId,
      userName: (user as any).name,        // ✅ Embed name
      userUsername: (user as any).username // ✅ Embed username
    });

    return NextResponse.json(newWhy, { status: 201 });
  } catch (error) {
    console.error('Failed to create Why:', error);
    return NextResponse.json({ error: 'Failed to post Why' }, { status: 500 });
  }
}
