import { connectToDB } from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectToDB();
  const users = await User.find().lean(); // make sure it's an array

  return NextResponse.json(users); // ✅ return array directly
}
