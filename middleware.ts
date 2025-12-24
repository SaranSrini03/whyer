import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/api/posts/:path*',
    '/api/like/:path*',
    '/api/comments/:path*',
    '/api/follow/:path*',
    '/api/feed/:path*',
    '/api/messages/:path*',
    '/profile/:path*',
    '/messages/:path*',
    '/post/:path*',
  ],
};

