// components/ClientHome.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation'
import Navbar from '@/components/NavBar';

export default function ClientHome({ whys }: { whys: any[] }) {
  const router = useRouter();

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

      {/* Header */}
      <Navbar />

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-light mb-4 tracking-tight">
            Recent <span className="text-yellow-400">Whys</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Explore the latest questions and join the conversation
          </p>
        </div>

        {whys.length === 0 ? (
          <div className="bg-black/50 backdrop-blur-sm border border-yellow-900/30 rounded-xl p-8 text-center">
            <p className="text-gray-500">
              No Whys yet.{' '}
              <Link
                href="/ask"
                className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors"
              >
                Ask your first question →
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whys.map((why: any) => (
              <Link href={`/why/${why._id}`} key={why._id} className="group">
                <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 transition-all hover:border-yellow-900/50 hover:shadow-lg hover:shadow-yellow-900/10 hover:scale-[1.015]">
                  <h2 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                    {why.title}
                  </h2>
                  {why.description && (
                    <p className="text-gray-500 mt-2 line-clamp-2 text-sm">
                      {why.description}
                    </p>
                  )}
                  <div className="flex items-center mt-4 text-xs text-gray-600">
                    <time dateTime={new Date(why.createdAt).toISOString()}>
                      {new Date(why.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                    <span className="mx-2">•</span>
                    <span>{why.comments?.length || 0} responses</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between mt-4 pt-4 border-t border-gray-800">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Handle spark functionality
                      }}
                      className="flex items-center text-xs text-gray-500 hover:text-yellow-400 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                      </svg>
                      Spark
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Handle comment functionality
                        router.push(`/why/${why._id}#comment`);
                      }}
                      className="flex items-center text-xs text-gray-500 hover:text-yellow-400 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                      </svg>
                      Comment
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Handle share functionality
                        navigator.clipboard.writeText(`${window.location.origin}/why/${why._id}`);
                        alert('Link copied to clipboard!');
                      }}
                      className="flex items-center text-xs text-gray-500 hover:text-yellow-400 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                      </svg>
                      Share
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>



    </main>
  );
}
