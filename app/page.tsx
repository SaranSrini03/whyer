// app/page.tsx
import WelcomePage from '@/components/Welcome';
import HomePage from '@/components/HomePage';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  const isLoggedIn = !!token;

  return isLoggedIn ? <HomePage /> : <WelcomePage />;
}
