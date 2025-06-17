'use client';

import { useEffect, useState } from 'react';

export default function MePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setUser(data);
      })
      .catch(err => {
        console.error(err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  if (!user) return <div className="p-6 text-red-500">You are not logged in.</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-black text-white font-mono">
      <h1 className="text-2xl font-bold mb-4">👤 Your Profile</h1>
      <ul className="space-y-2 text-yellow-300">
        <li><strong>ID:</strong> {user.id}</li>
        <li><strong>Name:</strong> {user.name}</li>
        <li><strong>Username:</strong> {user.username}</li>
        <li><strong>Email:</strong> {user.email}</li>
        <li><strong>Joined:</strong> {user.joined}</li>
        <li><strong>Questions Asked:</strong> {user.questionsAsked}</li>
        <li><strong>Answers Given:</strong> {user.answersGiven}</li>
      </ul>
    </div>
  );
}
