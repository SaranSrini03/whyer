'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <div className="relative z-10 border-t border-yellow-900/30 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
        <div className="mb-3 sm:mb-0">
          <span>© 2025 WHYER</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/privacy" className="hover:text-yellow-400 transition-colors duration-300">
            PRIVACY
          </Link>
          <Link href="/terms" className="hover:text-yellow-400 transition-colors duration-300">
            TERMS
          </Link>
          <Link href="/support" className="hover:text-yellow-400 transition-colors duration-300">
            SUPPORT
          </Link>
        </div>
      </div>
    </div>
  );
}
