'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useRef } from 'react';
import { useSession } from 'next-auth/react';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status, update } = useSession();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (status === 'authenticated' && session && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push(callbackUrl);
    }
  }, [session, status, router, callbackUrl]);

  useEffect(() => {
    if (status === 'loading') {
      const interval = setInterval(async () => {
        await update();
      }, 1000);
      
      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 15000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [status, update]);

  const handleSignIn = () => {
    signIn('github', { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">whyer</h1>
          <p className="text-gray-400">A minimal text-based social platform</p>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-black font-semibold hover:bg-gray-200 transition-colors"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}

