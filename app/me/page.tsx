'use client';

import { useEffect, useState } from 'react';

type UserType = {
  _id: string;
  name: string;
  username: string;
  email: string;
  dob?: string;
  createdAt: string;
  updatedAt: string;
  followers?: string[];
  following?: string[];
  questionsCount?: number;
  pulsesCount?: number;
  followersCount?: number;
  followingCount?: number;
};

export default function MePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/me');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch user');
        }

        setUser(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;
  if (error || !user) return <div className="p-6 text-red-500">Error: {error || 'Not logged in'}</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-black text-white font-mono">
      <h1 className="text-2xl font-bold mb-4">👤 Your Profile</h1>
      <ul className="space-y-2 text-yellow-300">
        <li><strong>ID:</strong> {user._id}</li>
        <li><strong>Name:</strong> {user.name}</li>
        <li><strong>Username:</strong> {user.username}</li>
        <li><strong>Email:</strong> {user.email}</li>
        {user.dob && <li><strong>Date of Birth:</strong> {new Date(user.dob).toLocaleDateString()}</li>}
        <li><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</li>
        <li><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</li>
        <li><strong>Questions Count:</strong> {user.questionsCount ?? 0}</li>
        <li><strong>Pulses Count:</strong> {user.pulsesCount ?? 0}</li>
        <li><strong>Followers Count:</strong> {user.followersCount ?? user.followers?.length ?? 10}</li>
        <li><strong>Following Count:</strong> {user.followingCount ?? user.following?.length ?? 0}</li>
        <li><strong>Followers:</strong> [{(user.followers || []).join(', ')}]</li>
        <li><strong>Following:</strong> [{(user.following || []).join(', ')}]</li>
      </ul>
    </div>
  );
}
