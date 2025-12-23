'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-black/80 backdrop-blur-sm">
      <div className="mx-auto max-w-2xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            whyer
          </Link>
          
          {session ? (
            <div className="flex items-center gap-4">
              <Link
                href="/messages"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Messages
              </Link>
              <Link
                href={`/profile/${session.user.username}`}
                className="flex items-center gap-2"
              >
                <img
                  src={session.user.image || '/default-avatar.png'}
                  alt={session.user.name || 'User'}
                  className="h-8 w-8 rounded-full"
                />
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

