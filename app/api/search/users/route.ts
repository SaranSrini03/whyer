import { NextRequest } from 'next/server';
import User from '@/models/User';
import { connectToDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    
    const searchTerm = req.nextUrl.searchParams.get('q') || '';
    
    if (!searchTerm.trim()) {
      return new Response(JSON.stringify({ users: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

   const users = await User.find({
  $or: [
    { name: { $regex: searchTerm, $options: 'i' } },
    { email: { $regex: searchTerm, $options: 'i' } },
    { username: { $regex: searchTerm, $options: 'i' } } // Add this
  ]
}).select('name email username').limit(10).lean(); // Include username

    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('🔴 Search error:', error);
    return new Response(JSON.stringify({ 
      error: "Database error",
      users: [] 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}