'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle signup logic here
    console.log({ name, email, username, dob, password, confirmPassword, agreeTerms });
  };

  return (
    <main className="min-h-screen bg-black text-white font-mono">
      {/* Gradient yellow background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-300px] left-[-300px] w-[800px] h-[800px] bg-gradient-to-r from-yellow-900/10 to-yellow-700/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-400px] right-[-300px] w-[700px] h-[700px] bg-gradient-to-r from-yellow-800/15 to-yellow-900/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23fde047' stroke-width='0.7'%3E%3Cpath d='M0 0h60v60H0z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">

            <h1 className="text-3xl sm:text-4xl font-light mb-2 tracking-tight">
              Create your{' '}
              <span className="font-medium bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Whyer
              </span>{' '}
              account
            </h1>
            <p className="text-gray-500 text-sm">
              Join our community of curious minds
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-600"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                Username
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-600"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-400 mb-2">
                Date of Birth
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-300"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-600"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-600"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-600">
                Use at least 8 characters with a mix of letters, numbers & symbols
              </p>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-400 mb-2">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-700 rounded bg-black mt-0.5"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-400">
                  I agree to the{' '}
                  <Link href="/terms" className="text-yellow-500 hover:text-yellow-400">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-yellow-500 hover:text-yellow-400">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-yellow-600 to-yellow-800 text-black font-medium rounded-lg hover:from-yellow-700 hover:to-yellow-900 transition-all duration-300 shadow-lg shadow-yellow-900/20 hover:shadow-yellow-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-yellow-500"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-yellow-500 hover:text-yellow-400">
                Sign in
              </Link>
            </p>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-500">Or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex justify-center items-center py-2.5 px-4 bg-black border border-gray-800 rounded-lg hover:bg-gray-900 transition-all duration-300"
            >
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-300">GitHub</span>
            </button>
            
            <button
              type="button"
              className="flex justify-center items-center py-2.5 px-4 bg-black border border-gray-800 rounded-lg hover:bg-gray-900 transition-all duration-300"
            >
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-300">Facebook</span>
            </button>
          </div>
        </div>
      </div>

    </main>
  );
}