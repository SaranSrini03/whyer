// app/why/[id]/page.tsx
import { connectToDB } from '@/lib/db';
import PulseSection from '@/components/Assests/PulseSection';
import Why from '@/models/Why';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: {
    id: string;
  };
}

export default async function WhyDetailPage({ params }: Props) {
  const { id } = params;

  try {
    await connectToDB();
    const why = await Why.findById(id).lean();

    if (!why) return notFound();

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

        {/* Header */}
        <div className="relative z-10 border-b border-yellow-900/30 py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 border border-yellow-500/40 text-yellow-400 flex items-center justify-center text-lg mr-2">
                W
              </div>
              <span className="text-xl font-light">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Whyer
                </span>
              </span>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
                Home
              </Link>
              <Link href="/ask" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
                Ask
              </Link>
              <Link href="/profile" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
                Profile
              </Link>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 sm:p-8 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-medium text-white mb-4">
                  {why.title}
                </h1>
                {why.description && (
                  <p className="text-gray-400 whitespace-pre-line mb-6">
                    {why.description}
                  </p>
                )}
              </div>
              <div className="flex space-x-3">
                <button className="p-2 rounded-full hover:bg-yellow-900/10 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 hover:text-yellow-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 pt-4 border-t border-gray-800">
              <time dateTime={new Date(why.createdAt).toISOString()}>
                Asked on {new Date(why.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span className="mx-2">•</span>
              <span>{why.comments?.length || 0} responses</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-between mt-6 pt-6 border-t border-gray-800">
              <button className="flex items-center text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
                Spark
              </button>
              
              <button className="flex items-center text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                </svg>
                Share
              </button>
            </div>
          </div>

          {/* Pulse Section */}
          <PulseSection whyId={id} />
        </div>


      </main>
    );
  } catch (err) {
    console.error('Error fetching Why:', err);
    return notFound();
  }
}