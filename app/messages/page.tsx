import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MessagesList from '@/components/MessagesList';

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/signin?callbackUrl=' + encodeURIComponent('/messages'));
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-grid-pattern"></div>
      
      <Navbar />
      <div className="relative z-10 max-w-2xl mx-auto pt-8 px-4">
        <div className="mb-8 opacity-0 animate-[fadeIn_0.7s_ease-out_0.2s_forwards]">
          <h1 className="text-4xl font-semibold mb-2 tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            Messages
          </h1>
          <p className="text-gray-500 text-sm font-medium">Your conversations</p>
        </div>
        <div className="opacity-0 translate-y-4 animate-[fadeInUp_0.7s_ease-out_0.4s_forwards]">
          <MessagesList currentUserId={session.user.id} />
        </div>
      </div>
    </div>
  );
}

