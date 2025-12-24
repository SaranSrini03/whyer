import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Feed from '@/components/Feed';
import SearchBar from '@/components/SearchBar';
import PeopleToFollow from '@/components/PeopleToFollow';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* Mobile Search - Show above feed on mobile */}
        <div className="lg:hidden mb-4">
          <SearchBar currentUserId={session.user.id} />
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar - Navigation */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20">
              <nav className="space-y-2">
                <Link
                  href="/"
                  className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-gray-900 transition-colors text-white font-semibold"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                  </svg>
                  <span>Home</span>
                </Link>
                <Link
                  href="/messages"
                  className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-gray-900 transition-colors text-gray-400 hover:text-white"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Messages</span>
                </Link>
                <Link
                  href={`/profile/${session.user.username}`}
                  className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-gray-900 transition-colors text-gray-400 hover:text-white"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile</span>
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="col-span-12 lg:col-span-6">
            <Feed currentUserId={session.user.id} />
          </main>

          {/* Right Sidebar - Search & Suggestions */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20 space-y-4">
              <SearchBar currentUserId={session.user.id} />
              <PeopleToFollow currentUserId={session.user.id} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
