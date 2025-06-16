'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function WelcomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
        <div 
          className={`text-center max-w-4xl w-full transform transition-all duration-700 ease-out ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >


          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light mb-6 sm:mb-8 tracking-tight">
            Welcome to{' '}
            <span className="font-medium bg-yellow-400 bg-clip-text text-transparent">
              Whyer
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
            A space for focused inquiry. Ask <span className="text-yellow-400">why</span>, 
            exchange perspectives, and connect through curiosity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-12 sm:mb-16">
            <Link
              href="/signup"
              className="group relative px-6 py-3 sm:px-8 sm:py-3.5 bg-yellow-400 text-black font-medium hover:from-yellow-700 hover:to-yellow-900 transition-all duration-300 shadow-lg shadow-yellow-900/20 hover:shadow-yellow-900/30"
            >
              Get Started
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Link>
            
            <Link
              href="/login"
              className="group px-6 py-3 sm:px-8 sm:py-3.5 border border-yellow-900 text-white font-medium hover:border-yellow-700 hover:bg-yellow-900/10 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto border-t border-yellow-900/50 pt-10 sm:pt-12">
            <div className="text-center p-4 sm:p-5 hover:bg-yellow-900/5 transition-all duration-300 rounded-lg">
              <div className="w-10 h-10 border border-yellow-900/50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-normal text-white mb-2 tracking-wide">ASK QUESTIONS</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">Seek deeper understanding</p>
            </div>

            <div className="text-center p-4 sm:p-5 hover:bg-yellow-900/5 transition-all duration-300 rounded-lg">
              <div className="w-10 h-10 border border-yellow-900/50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-normal text-white mb-2 tracking-wide">SHARE THOUGHTS</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">Exchange perspectives</p>
            </div>

            <div className="text-center p-4 sm:p-5 hover:bg-yellow-900/5 transition-all duration-300 rounded-lg">
              <div className="w-10 h-10 border border-yellow-900/50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-normal text-white mb-2 tracking-wide">CONNECT</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">Build meaningful discourse</p>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}