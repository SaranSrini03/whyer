'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Profile from '@/components/Profile';
import PublicProfile from '@/components/PublicProfile';

export default function UsernamePage() {
  const { username } = useParams();
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        setMe(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!me) return <div>Not logged in</div>;

  return me.username === username ? (
    <Profile />
  ) : (
    <PublicProfile username={username as string} />
  );
}
