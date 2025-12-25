'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status, update } = useSession();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const hasRedirected = useRef(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session && !hasRedirected.current) {
      hasRedirected.current = true;
      window.location.href = callbackUrl;
    }
  }, [session, status, callbackUrl]);

  useEffect(() => {
    if (status === 'loading' && !isChecking) {
      setIsChecking(true);
      let attempts = 0;
      const maxAttempts = 30;
      
      const checkSession = async () => {
        attempts++;
        const updatedSession = await update();
        
        if (updatedSession && updatedSession.user) {
          setIsChecking(false);
          if (!hasRedirected.current) {
            hasRedirected.current = true;
            window.location.href = callbackUrl;
          }
          return;
        }
        
        if (attempts < maxAttempts) {
          setTimeout(checkSession, 500);
        } else {
          setIsChecking(false);
        }
      };
      
      checkSession();
    }
  }, [status, update, isChecking, router, callbackUrl]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      const checkUrlParams = async () => {
        const error = searchParams.get('error');
        if (error) {
          console.error('OAuth error:', error);
        }
      };
      checkUrlParams();
    }
  }, [status, searchParams]);

  const handleSignIn = () => {
    setIsLoading(true);
    signIn('github', { callbackUrl, redirect: true });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-grid-pattern"></div>
      
      <div className="relative z-10 max-w-md w-full px-6">
        <div className="text-center mb-12 opacity-0 animate-[fadeIn_0.7s_ease-out_0.2s_forwards]">

          <h1 className="text-5xl font-semibold mb-3 tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            whyer
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            A minimal text-based social platform
          </p>
        </div>
        
        <div className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] rounded-2xl p-8 border border-white/10 backdrop-blur-xl shadow-2xl opacity-0 translate-y-4 animate-[fadeInUp_0.7s_ease-out_0.4s_forwards]">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Welcome back</h2>
              <p className="text-sm text-gray-500">Sign in to continue to whyer</p>
            </div>
            
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="group relative w-full flex items-center justify-center gap-3 rounded-xl bg-white px-6 py-3.5 text-black font-medium hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/5 hover:shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>Continue with GitHub</span>
                </>
              )}
            </button>
            
            <p className="text-xs text-gray-600 text-center pt-2">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse delay-75"></div>
          <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse delay-150"></div>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}

