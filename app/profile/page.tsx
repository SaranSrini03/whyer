'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/NavBar';
import { useMe } from '@/hooks/useMe';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'questions' | 'pulses' | 'followers' | 'following'>('questions');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { me } = useMe();

  useEffect(() => {
    setTimeout(() => {
      setUser({
        name: me?.username || 'Anonymous User',
        email: me?.email || 'user@example.com',
        joinDate: new Date().toISOString(),
        stats: {
          questions: 8,
          pulses: 42,
          followers: 128,
          following: 64
        }
      });
      setLoading(false);
    }, 500);
  }, [me]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="fixed top-[-300px] left-[-300px] w-[800px] h-[800px] bg-gradient-to-r from-yellow-900/10 to-yellow-700/5 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="bg-black/50 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-yellow-900/20 border border-yellow-900/30 flex items-center justify-center">
              <span className="text-2xl text-yellow-500">{user.name.charAt(0)}</span>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-medium">{user.name}</h1>
              <p className="text-gray-400 mb-4">{user.email}</p>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                {Object.entries(user.stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-yellow-400">{value}</div>
                    <div className="text-sm text-gray-500 capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-800 mb-6">
          <nav className="flex space-x-4">
            {(['questions', 'pulses', 'followers', 'following'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 ${
                  activeTab === tab
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-transparent text-gray-400'
                }`}
              >
                {tab.replace(/^\w/, c => c.toUpperCase())}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Content */}
        <div className="bg-black/50 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-500">
            {activeTab === 'questions' && "You haven't asked any questions yet."}
            {activeTab === 'pulses' && "You haven't shared any pulses yet."}
            {activeTab === 'followers' && "You don't have any followers yet."}
            {activeTab === 'following' && "You're not following anyone yet."}
          </p>
          <Link
            href={activeTab === 'questions' ? "/ask" : "/"}
            className="mt-2 inline-block text-yellow-500 hover:text-yellow-400"
          >
            {activeTab === 'questions' ? "Ask your first question →" : "Discover content →"}
          </Link>
        </div>
      </div>
    </main>
  );
}