// app/api/why/route.ts
import { connectToDB } from '@/lib/db';
import Why from '@/models/Why';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectToDB();

        const whys = await Why.find()
            .populate('userId', 'username name image') // populate with user details
            .lean();

        const formattedWhys = whys.map((why) => ({
            ...why,
            user: why.userId,
            userId: undefined,
        }));

        // ✅ Add this to debug


        return NextResponse.json(formattedWhys, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch Whys' }, { status: 500 });
    }
}
