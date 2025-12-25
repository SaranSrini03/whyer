'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
  userImage?: string;
  userName?: string;
  unreadCount?: number;
}

export default function MobileSidebar({
  isOpen,
  onClose,
  username,
  userImage,
  userName,
  unreadCount = 0,
}: MobileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
    onClose();
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-black border-r border-gray-800 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" onClick={handleLinkClick} className="text-xl font-bold">
              whyer
            </Link>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            <Link
              href="/"
              prefetch={true}
              onClick={handleLinkClick}
              className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors ${
                pathname === '/'
                  ? 'bg-gray-900 text-white font-semibold'
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
              <span>Home</span>
            </Link>
            <Link
              href="/messages"
              prefetch={true}
              onClick={handleLinkClick}
              className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors relative ${
                pathname?.startsWith('/messages')
                  ? 'bg-gray-900 text-white font-semibold'
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Messages</span>
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            {username && (
              <Link
                href={`/profile/${username}`}
                prefetch={true}
                onClick={handleLinkClick}
                className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors ${
                  pathname?.startsWith(`/profile/${username}`)
                    ? 'bg-gray-900 text-white font-semibold'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Profile</span>
              </Link>
            )}
          </nav>

          <div className="border-t border-gray-800 pt-4">
            {username && (
              <Link
                href={`/profile/${username}`}
                prefetch={true}
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-gray-900 transition-colors mb-2"
              >
                <img
                  src={userImage || '/default-avatar.png'}
                  alt={userName || 'User'}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{userName}</p>
                  <p className="text-sm text-gray-500 truncate">@{username}</p>
                </div>
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-full text-gray-400 hover:bg-gray-900 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

