'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Assests/NavBar';
import WhyCard from '@/components/Assests/WhyCard';
import GridBackground from '@/components/Background/GridBackground';
import GradientBackground from '@/components/Background/GradientBackground';
import SuggestedUsers from '@/components/SuggestedUsers';
import WhyCardSkeleton from '@/components/Assests/WhyCardSkeleton';
import LeftSidebar from '@/components/LeftSidebar';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ClientHome({ whys }: { whys: any[] }) {

  const router = useRouter();

  const fadeInVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
  };

  return (
    <main className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
      {/* Backgrounds */}
      <GradientBackground className="z-0" />
      <GridBackground
        opacity={0.03}
        color="fde047"
        strokeWidth="0.7"
        size={60}
        className="z-0"
      />

      {/* Navbar */}
      <Navbar />

      {/* Page Content Layout */}
      <div className="relative z-10 flex justify-center gap-8 px-4 sm:px-6 pt-8 pb-16 h-[calc(100vh-4rem)]">
        {/* Left Spacer */}
        <LeftSidebar />

        {/* Scrollable Main Feed */}
        <div className="w-full max-w-5xl overflow-y-auto pl-2 pr-2  hide-scrollbar">
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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-16 items-stretch">
              {whys.length === 0 ? (
                Array.from({ length: 6 }).map((_, i) => <WhyCardSkeleton key={i} />)
              ) : (
                <>
                  {whys.map((why: any, i: number) => (
                    <motion.div
                      key={why._id}
                      custom={i}
                      variants={fadeInVariant}
                      initial="hidden"
                      animate="visible"
                      className="h-full  flex-row"
                    >
                      <WhyCard why={why} />
                    </motion.div>
                  ))}
                </>
              )}
            </div>


          )}

        </div>

        {/* Suggested Users Sidebar (Fixed/Sticky) */}
        <div className="hidden xl:block w-[360px] sticky top-44 h-fit self-start">
          <div className="bg-black/5 border border-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold text-yellow-300 mb-4">
              People You May Know

            </h2>
            <SuggestedUsers />
          </div>
        </div>
      </div>
    </main>
  );
}
