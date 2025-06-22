// components/WhyCard.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

interface WhyCardProps {
  why: {
    _id: string;
    title: string;
    description?: string;
    createdAt: string;
    comments?: any[];
    sparkCount?: number;
    user?: {
      name?: string;
      image?: string;
    };
    tags?: string[];
  };
}

export default function WhyCard({ why }: WhyCardProps) {
  const router = useRouter();
  const [isSparked, setIsSparked] = useState(false);
  const [sparkCount, setSparkCount] = useState(why.sparkCount || 0);
  const [isCopied, setIsCopied] = useState(false);

  const handleSpark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSparked(!isSparked);
    setSparkCount(prev => isSparked ? prev - 1 : prev + 1);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/why/${why._id}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Safe user data handling
  const userName = why.user?.name || "Anonymous";
  const userInitial = userName.charAt(0).toUpperCase();
  const userImage = why.user?.image;

  return (
    <Link href={`/why/${why._id}`} className="group block">
      <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 transition-all hover:border-yellow-900/50 hover:shadow-lg hover:shadow-yellow-900/10 hover:scale-[1.015] h-full flex flex-col">
        {/* User Profile Section - Safe handling for missing user data */}
        <div className="flex items-center mb-4">
          <div className="relative h-8 w-8 rounded-full bg-gray-800 border border-yellow-900/50 overflow-hidden flex items-center justify-center">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                width={32}
                height={32}
                className="object-cover"
              />
            ) : (
              <span className="text-xs text-yellow-500 font-medium">
                {userInitial}
              </span>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-300">{userName}</p>
            <p className="text-xs text-gray-600">
              {new Date(why.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-grow">
          <h2 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors mb-2">
            {why.title}
          </h2>


          <p className="text-gray-400 mt-2 line-clamp-3 text-sm mb-4">
            {why.description?.trim() || 'No description'}
          </p>


          {/* Tags - Safe handling for missing tags */}
          {why.tags && why.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {why.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-yellow-900/20 text-yellow-500 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats and Actions */}
        <div className="mt-auto pt-4 border-t border-gray-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSpark}
                className="flex items-center text-xs group"
              >
                <div className={`p-1 rounded-full mr-1 ${isSparked ? 'bg-yellow-900/30' : 'group-hover:bg-yellow-900/20'}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isSparked ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-4 h-4 ${isSparked ? 'text-yellow-400' : 'text-gray-500 group-hover:text-yellow-400'}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                  </svg>
                </div>
                <span className={`${isSparked ? 'text-yellow-400' : 'text-gray-500 group-hover:text-yellow-400'}`}>
                  {sparkCount}
                </span>
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/why/${why._id}#comment`);
                }}
                className="flex items-center text-xs text-gray-500 hover:text-yellow-400 transition-colors"
              >
                <div className="p-1 rounded-full mr-1 group-hover:bg-yellow-900/20">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                </div>
                <span>{why.comments?.length || 0}</span>
              </button>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center text-xs text-gray-500 hover:text-yellow-400 transition-colors relative"
            >
              <div className="p-1 rounded-full group-hover:bg-yellow-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                </svg>
              </div>
              {isCopied && (
                <span className="absolute -top-6 right-0 bg-yellow-900/80 text-yellow-200 text-xs px-2 py-1 rounded">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}