'use client';

import { useEffect, useState } from 'react';

export type MeType = {
  questionsCount: number;
  _id: string;
  name: string;
  username: string;
  email: string;
  dob: string;
  createdAt: string;
  updatedAt: string;
};

export function useMe() {
  const [me, setMe] = useState<MeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) throw new Error('Not authenticated');
        const data = await res.json();
        setMe(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return { me, loading, error };
}
