'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

type UserType = {
  _id: string;
  name: string;
  username: string;
  email: string;
};

interface JwtPayload {
  userId: string;
  exp: number;
  iat: number;
}

export default function SuggestedUsers() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setLoggedInUserId(decoded.userId);
      } catch (err) {
        console.error('Failed to decode token:', err);
        setError('Failed to authenticate user');
      }
    }

    // Fetch all users
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load user suggestions');
      }
    };

    // Fetch logged-in user info from /api/me
    const fetchLoggedInUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
        const data = await res.json();
        setLoggedInUser(data);
      } catch (err) {
        console.error('Failed to fetch current user info:', err);
      }
    };

    // Run both in parallel
    Promise.all([fetchUsers(), fetchLoggedInUser()]).finally(() => setLoading(false));
  }, []);

  const suggestedUsers = users.filter(
    user => user._id !== loggedInUserId && user.email !== loggedInUser?.email
  );


  const handleFollow = (userId: string) => {
    console.log(`Following user ${userId}`);
    // fetch(`/api/follow/${userId}`, { method: 'POST' });
  };

  if (loading) {
    return (
      <div className="bg-black/5 backdrop-blur-md rounded-xl p-4 text-sm w-full max-w-xs">
        <p className="text-white text-center">Loading suggestions...</p>
        <ul className="space-y-3 mt-4">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 h-full flex items-center justify-between animate-pulse">
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-24"></div>
                <div className="h-3 bg-gray-800 rounded w-16"></div>
              </div>
              <div className="h-6 bg-gray-700 rounded-full w-16"></div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black/5 backdrop-blur-md rounded-xl p-4 text-sm w-full max-w-xs">
        <div className="text-red-400 text-center p-4 border border-red-900/30 rounded-xl">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-yellow-400 hover:underline text-xs"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (suggestedUsers.length === 0) {
    return (
      <div className="bg-black/5 backdrop-blur-md rounded-xl p-4 text-sm w-full max-w-xs">
        <div className="text-center py-6 text-gray-400">
          <p>No user suggestions available</p>
          <p className="text-xs mt-2">Follow more people to see suggestions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/5 backdrop-blur-md rounded-xl p-4 text-sm w-full max-w-xs">



      <ul className="space-y-3">
        {suggestedUsers.map(user => (
          <li
            key={user._id}
            className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 transition-all hover:border-yellow-900/50 hover:shadow-lg hover:shadow-yellow-900/10 hover:scale-[1.015] h-full flex items-center justify-between"
          >
            <div>
              <p className="text-white">{user.name}</p>
              <p className="text-gray-400 text-xs">@{user.username}</p>
            </div>
            <button
              onClick={() => handleFollow(user._id)}
              className="text-yellow-400 hover:underline text-xs bg-black/30 px-3 py-1 rounded-full border border-yellow-900/50 transition-colors hover:bg-yellow-900/10"
            >
              Follow
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
