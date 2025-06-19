// components/ClientHome.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Assests/NavBar';
import WhyCard from '@/components/Assests/WhyCard';
import GridBackground from '@/components/Background/GridBackground';
import GradientBackground from '@/components/Background/GradientBackground';

export default function ClientHome({ whys }: { whys: any[] }) {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white font-mono">
      {/* Gradient yellow background elements */}
      <GradientBackground
        className="z-0" // Optional additional className
      />

      {/* Grid pattern */}
      <GridBackground
        opacity={0.03}
        color="fde047"
        strokeWidth="0.7"
        size={60}
        className="z-0" // Optional additional className
      />

      {/* Header */}
      <Navbar />

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-light mb-4 tracking-tight">
            Recent <span className="text-yellow-400">Whys</span>
          </h1>
        </div>

        {whys.length === 0 ? (
          <div className="bg-black/50 backdrop-blur-sm border border-yellow-900/30 rounded-xl p-8 text-center">
            <p className="text-gray-500">
              No Whys yet.{' '}
              <Link
                href="/ask"
                className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors"
              >
                Ask your first question →
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whys.map((why: any) => (
              <WhyCard key={why._id} why={why} />
            ))}
          </div>
        )}
      </div>



    </main>
  );
}
