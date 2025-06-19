// app/page.tsx
import WelcomePage from '@/components/Welcome/Welcome';
import HomePage from '@/components/Welcome/HomePage';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  const isLoggedIn = !!token;

  return isLoggedIn ? <HomePage /> : <WelcomePage />;
}
