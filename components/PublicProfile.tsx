'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Assests/NavBar';

type PublicProfileProps = {
  username: string;
};

export default function PublicProfile({ username }: PublicProfileProps) {
  const [activeTab, setActiveTab] = useState<'questions' | 'pulses' | 'followers' | 'following'>('questions');
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  // Mock user with dynamic username
  const user = {
    _id: 'u123',
    name: 'Sanji',
    username: username,
    email: 'sanji@example.com',
    createdAt: '2024-12-01',
    followersCount: 123,
    followingCount: 89,
    questionsCount: 7,
    pulsesCount: 15,
  };

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
              <h1 className="text-2xl font-medium">@{user.username}</h1>
              <p className="text-gray-400 mb-4">{user.name}</p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-4">
                <div className="text-center">
                  <div className="text-yellow-400">{user.questionsCount}</div>
                  <div className="text-sm text-gray-500">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400">{user.pulsesCount}</div>
                  <div className="text-sm text-gray-500">Pulses</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400">{user.followersCount}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400">{user.followingCount}</div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
              </div>

              <button
                onClick={handleFollow}
                className={`mt-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isFollowing
                    ? 'bg-gray-800 text-yellow-500 border border-yellow-500'
                    : 'bg-yellow-500 text-black hover:bg-yellow-400'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 mb-6">
          <nav className="flex space-x-4 justify-center sm:justify-start">
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

        {/* Tab Content */}
        <div className="bg-black/50 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-500">
            {activeTab === 'questions' && "This user hasn't asked any questions yet."}
            {activeTab === 'pulses' && "This user hasn't shared any pulses yet."}
            {activeTab === 'followers' && "No followers yet."}
            {activeTab === 'following' && "Not following anyone yet."}
          </p>
        </div>
      </div>
    </main>
  );
}
