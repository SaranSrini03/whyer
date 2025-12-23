import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }
  return {
    id: session.user.id,
    username: session.user.username,
  };
}

