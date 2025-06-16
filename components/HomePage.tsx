// app/page.tsx (Server Component)
import { connectToDB } from '@/lib/db';
import Why from '@/models/Why';
import ClientHome from '@/components/ClientHome';

export default async function HomePage() {
  await connectToDB();
  const whys = await Why.find().sort({ createdAt: -1 }).lean();

  return <ClientHome whys={JSON.parse(JSON.stringify(whys))} />;
}
