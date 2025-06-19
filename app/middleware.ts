import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore paths that start with /@, /api, /_next, /static, or have a file extension
  if (
    pathname.startsWith('/@') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.\w+$/)
  ) {
    return NextResponse.next();
  }

  // Extract the username from root-level path like "/saransrini"
  const match = pathname.match(/^\/([a-zA-Z0-9_]+)/);
  if (match) {
    const username = match[1];
    const url = request.nextUrl.clone();
    url.pathname = `/@${username}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
