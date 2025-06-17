// app/api/signup/route.ts
import { connectToDB } from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  await connectToDB();
  const { name, username, email, dob, password } = await req.json();

  // Hash password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      name,
      username,
      email,
      dob,
      password: hashedPassword,
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
