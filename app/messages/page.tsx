import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MessagesList from '@/components/MessagesList';

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <MessagesList currentUserId={session.user.id} />
      </div>
    </div>
  );
}

