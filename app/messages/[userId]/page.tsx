import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MessageThread from '@/components/MessageThread';

export default async function MessageThreadPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/signin');
  }

  const { userId } = await params;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-grid-pattern"></div>
      
      <Navbar />
      <div className="relative z-10 max-w-2xl mx-auto pt-8 px-4">
        <div className="opacity-0 translate-y-4 animate-[fadeInUp_0.7s_ease-out_0.4s_forwards]">
          <MessageThread userId={userId} currentUserId={session.user.id} />
        </div>
      </div>
    </div>
  );
}

