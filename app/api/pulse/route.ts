// app/api/pulse/route.ts

import { connectToDB } from '@/lib/db';
import Pulse from '@/models/Pulse';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { content, whyId } = await req.json();
    await connectToDB();

    let pulseDoc = await Pulse.findOne({ whyId });

    if (!pulseDoc) {
      pulseDoc = await Pulse.create({
        whyId,
        replies: [{ content }]
      });
    } else {
      pulseDoc.replies.unshift({ content });
      await pulseDoc.save();
    }

    return NextResponse.json(pulseDoc, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to post pulse' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url || '');
    const whyId = url.searchParams.get('whyId');

    await connectToDB();
    const pulse = await Pulse.findOne({ whyId });

    return NextResponse.json(pulse?.replies ?? []);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 });
  }
}
