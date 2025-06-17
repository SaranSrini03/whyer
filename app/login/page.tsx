'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loadingToast = toast.loading('Logging in...');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.dismiss(loadingToast);

      if (res.ok) {
        toast.success('Login successful!');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        const data = await res.json();
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Something went wrong');
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white font-mono">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-300px] left-[-300px] w-[800px] h-[800px] bg-gradient-to-r from-yellow-900/10 to-yellow-700/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-400px] right-[-300px] w-[700px] h-[700px] bg-gradient-to-r from-yellow-800/15 to-yellow-900/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23fde047' stroke-width='0.7'%3E%3Cpath d='M0 0h60v60H0z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Login box */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-light mb-2 tracking-tight">
              Sign in to{' '}
              <span className="font-medium bg-yellow-400 bg-clip-text text-transparent">
                Whyer
              </span>
            </h1>
            <p className="text-gray-500 text-sm">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-400 mb-2">
                Email address or Username
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-600"
                placeholder="you@example.com or yourusername"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-yellow-500 hover:text-yellow-400">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-700 rounded bg-black"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-yellow-600 to-yellow-800 text-black font-medium rounded-lg hover:from-yellow-700 hover:to-yellow-900 transition-all duration-300 shadow-lg shadow-yellow-900/20 hover:shadow-yellow-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-yellow-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-yellow-500 hover:text-yellow-400">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
