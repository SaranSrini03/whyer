import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Skip auth check for API routes - let them handle authentication and return JSON errors
        if (req.nextUrl.pathname.startsWith('/api/')) {
          return true;
        }
        // Check if token exists and has required user data
        if (!token) {
          return false;
        }
        return true;
      },
    },
    pages: {
      signIn: '/auth/signin',
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
    '/api/notifications/:path*',
    '/profile/:path*',
    '/messages/:path*',
    '/post/:path*',
  ],
};

