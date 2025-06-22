import { connectToDB } from '@/lib/db';
import Why from '@/models/Why';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { title, description } = await req.json();
  

  try {
    await connectToDB();
    const newWhy = await Why.create({ title, description });
    return NextResponse.json(newWhy, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to post Why' }, { status: 500 });
  }
}
