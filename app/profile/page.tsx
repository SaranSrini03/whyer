// app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/NavBar';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'questions' | 'pulses' | 'followers' | 'following'>('questions');
  const [user, setUser] = useState<any>(null);
  const [userWhys, setUserWhys] = useState<any[]>([]);
  const [userPulses, setUserPulses] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUser({
        _id: 'user123',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        joinDate: '2023-01-15T12:00:00Z',
        pulseCount: 42,
        questionCount: 8,
        followersCount: 128,
        followingCount: 64
      });
      
      setUserWhys([
        { _id: '1', title: 'Why do we dream?', createdAt: '2023-10-15T14:30:00Z', commentCount: 12 },
        { _id: '2', title: 'Why is the sky blue?', createdAt: '2023-09-22T10:15:00Z', commentCount: 7 },
        { _id: '3', title: 'Why do leaves change color?', createdAt: '2023-08-05T16:45:00Z', commentCount: 5 },
      ]);
      
      setUserPulses([
        { _id: 'p1', content: 'Dreams might be our brain\'s way of processing emotions and experiences from the day.', whyId: '1', whyTitle: 'Why do we dream?', createdAt: '2023-10-16T09:30:00Z' },
        { _id: 'p2', content: 'The sky appears blue due to Rayleigh scattering of sunlight in the atmosphere.', whyId: '2', whyTitle: 'Why is the sky blue?', createdAt: '2023-09-23T14:20:00Z' },
      ]);
      
      setFollowers([
        { _id: 'f1', name: 'Taylor Swift', email: 'taylor@example.com', joined: '2022-05-12T10:00:00Z' },
        { _id: 'f2', name: 'Chris Evans', email: 'chris@example.com', joined: '2022-08-23T14:30:00Z' },
        { _id: 'f3', name: 'Emma Watson', email: 'emma@example.com', joined: '2023-01-15T09:15:00Z' },
      ]);
      
      setFollowing([
        { _id: 'fl1', name: 'Neil deGrasse Tyson', email: 'neil@example.com', joined: '2021-11-03T16:45:00Z' },
        { _id: 'fl2', name: 'Bill Nye', email: 'bill@example.com', joined: '2022-02-18T11:20:00Z' },
        { _id: 'fl3', name: 'Michio Kaku', email: 'michio@example.com', joined: '2022-07-30T13:10:00Z' },
      ]);
      
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

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

      <Navbar />

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-yellow-900/20 border border-yellow-900/30 flex items-center justify-center">
              <span className="text-3xl text-yellow-500 font-medium">
                {user.name.charAt(0)}
              </span>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl font-medium text-white">
                  {user.name}
                </h1>
                <div className="flex gap-3">
                  <button className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-600 to-yellow-800 text-black font-medium rounded-lg hover:from-yellow-700 hover:to-yellow-900 transition-all">
                    Follow
                  </button>
                  <button className="px-4 py-2 text-sm bg-black border border-gray-800 rounded-lg hover:bg-gray-900 transition-colors">
                    Message
                  </button>
                </div>
              </div>
              
              <p className="text-gray-400 mb-6">{user.email}</p>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-6 mb-6">
                <div className="text-center">
                  <div className="text-xl font-medium text-yellow-400">{user.questionCount}</div>
                  <div className="text-sm text-gray-500">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-medium text-yellow-400">{user.pulseCount}</div>
                  <div className="text-sm text-gray-500">Pulses</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-medium text-yellow-400">{user.followersCount}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-medium text-yellow-400">{user.followingCount}</div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-medium text-yellow-400">
                    {new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric' })}
                  </div>
                  <div className="text-sm text-gray-500">Member since</div>
                </div>
              </div>
              
              <div className="flex justify-center sm:justify-start gap-3">
                <button className="px-4 py-2 text-sm bg-black border border-gray-800 rounded-lg hover:bg-gray-900 transition-colors">
                  Edit Profile
                </button>
                <button className="px-4 py-2 text-sm bg-black border border-gray-800 rounded-lg hover:bg-gray-900 transition-colors">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Tabs */}
        <div className="border-b border-gray-800 mb-6 overflow-x-auto">
          <nav className="flex space-x-4 min-w-max">
            <button
              onClick={() => setActiveTab('questions')}
              className={`py-3 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'questions'
                  ? 'border-yellow-500 text-yellow-400'
                  : 'border-transparent text-gray-400 hover:text-yellow-400'
              }`}
            >
              My Questions
            </button>
            <button
              onClick={() => setActiveTab('pulses')}
              className={`py-3 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'pulses'
                  ? 'border-yellow-500 text-yellow-400'
                  : 'border-transparent text-gray-400 hover:text-yellow-400'
              }`}
            >
              My Pulses
            </button>
            <button
              onClick={() => setActiveTab('followers')}
              className={`py-3 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'followers'
                  ? 'border-yellow-500 text-yellow-400'
                  : 'border-transparent text-gray-400 hover:text-yellow-400'
              }`}
            >
              Followers
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`py-3 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'following'
                  ? 'border-yellow-500 text-yellow-400'
                  : 'border-transparent text-gray-400 hover:text-yellow-400'
              }`}
            >
              Following
            </button>
          </nav>
        </div>
        
        {/* Content Area */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            {userWhys.length === 0 ? (
              <div className="bg-black/50 backdrop-blur-sm border border-yellow-900/30 rounded-xl p-8 text-center">
                <p className="text-gray-500">
                  You haven't asked any questions yet.{' '}
                  <Link
                    href="/ask"
                    className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors"
                  >
                    Ask your first question →
                  </Link>
                </p>
              </div>
            ) : (
              userWhys.map((why) => (
                <Link href={`/why/${why._id}`} key={why._id} className="group">
                  <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 transition-all hover:border-yellow-900/50 hover:shadow-lg hover:shadow-yellow-900/10">
                    <h2 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                      {why.title}
                    </h2>
                    <div className="flex items-center mt-4 text-xs text-gray-600">
                      <time dateTime={why.createdAt}>
                        {new Date(why.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                      <span className="mx-2">•</span>
                      <span>{why.commentCount} responses</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
        
        {activeTab === 'pulses' && (
          <div className="space-y-6">
            {userPulses.length === 0 ? (
              <div className="bg-black/50 backdrop-blur-sm border border-yellow-900/30 rounded-xl p-8 text-center">
                <p className="text-gray-500">
                  You haven't shared any pulses yet.{' '}
                  <Link
                    href="/"
                    className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors"
                  >
                    Join a conversation →
                  </Link>
                </p>
              </div>
            ) : (
              userPulses.map((pulse) => (
                <div key={pulse._id} className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 group">
                  <div className="mb-4">
                    <Link 
                      href={`/why/${pulse.whyId}`}
                      className="text-yellow-500 hover:text-yellow-400 font-medium"
                    >
                      {pulse.whyTitle}
                    </Link>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-8 h-8 rounded-full bg-yellow-900/20 border border-yellow-900/30 flex items-center justify-center">
                        <span className="text-yellow-500 text-sm">{user.name.charAt(0)}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-gray-300 whitespace-pre-line">{pulse.content}</p>
                      
                      <div className="flex items-center mt-4 text-xs text-gray-600">
                        <time dateTime={pulse.createdAt}>
                          {new Date(pulse.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {activeTab === 'followers' && (
          <div className="space-y-4">
            {followers.length === 0 ? (
              <div className="bg-black/50 backdrop-blur-sm border border-yellow-900/30 rounded-xl p-8 text-center">
                <p className="text-gray-500">
                  You don't have any followers yet.
                </p>
              </div>
            ) : (
              followers.map((follower) => (
                <div key={follower._id} className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5 flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-900/20 border border-yellow-900/30 flex items-center justify-center">
                      <span className="text-xl text-yellow-500 font-medium">
                        {follower.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{follower.name}</h3>
                    <p className="text-sm text-gray-500">{follower.email}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Joined {new Date(follower.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs bg-black border border-gray-800 rounded-lg hover:bg-gray-900 transition-colors">
                      Message
                    </button>
                    <button className="px-3 py-1.5 text-xs bg-gradient-to-r from-yellow-600 to-yellow-800 text-black font-medium rounded-lg hover:from-yellow-700 hover:to-yellow-900 transition-all">
                      Follow
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {activeTab === 'following' && (
          <div className="space-y-4">
            {following.length === 0 ? (
              <div className="bg-black/50 backdrop-blur-sm border border-yellow-900/30 rounded-xl p-8 text-center">
                <p className="text-gray-500">
                  You're not following anyone yet.{' '}
                  <Link
                    href="/"
                    className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors"
                  >
                    Discover users →
                  </Link>
                </p>
              </div>
            ) : (
              following.map((followed) => (
                <div key={followed._id} className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5 flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-900/20 border border-yellow-900/30 flex items-center justify-center">
                      <span className="text-xl text-yellow-500 font-medium">
                        {followed.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{followed.name}</h3>
                    <p className="text-sm text-gray-500">{followed.email}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Joined {new Date(followed.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs bg-black border border-gray-800 rounded-lg hover:bg-gray-900 transition-colors">
                      Message
                    </button>
                    <button className="px-3 py-1.5 text-xs bg-black border border-gray-800 text-gray-400 rounded-lg hover:bg-gray-900 transition-colors">
                      Unfollow
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-yellow-900/30 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <div className="mb-3 sm:mb-0">
            <span>© 2025 WHYER</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-yellow-400 transition-colors duration-300">
              PRIVACY
            </Link>
            <Link href="/terms" className="hover:text-yellow-400 transition-colors duration-300">
              TERMS
            </Link>
            <Link href="/support" className="hover:text-yellow-400 transition-colors duration-300">
              SUPPORT
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}