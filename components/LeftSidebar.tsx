'use client';

import Link from 'next/link';
import { Home, Search, Mail, Bell, User,TrendingUp,Sword } from 'lucide-react';

const menuItems = [
  { name: 'Home', href: '/', icon: <Home className="w-6 h-6" /> },
  { name: 'Trending', href: '/explore', icon: <TrendingUp className="w-6 h-6" /> },
  { name: 'Live', href: '/explore', icon: <Sword className="w-6 h-6" /> },
  { name: 'Search', href: '/search', icon: <Search className="w-6 h-6" /> },
  { name: 'Messages', href: '/messages', icon: <Mail className="w-6 h-6" /> },
  { name: 'Notifications', href: '/notifications', icon: <Bell className="w-6 h-6" /> },
  { name: 'Profile', href: '/profile', icon: <User className="w-6 h-6" /> },
];

export default function LeftSidebar() {
  return (
    <aside className="hidden  xl:flex flex-col gap-6 w-[300px] sticky top-46  h-fit self-start z-10">
      <div className="bg-black/10 border border-yellow-900/30 backdrop-blur-md p-6 rounded-3xl shadow-2xl">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex  items-center gap-4 text-white hover:text-yellow-400 hover:bg-white/10 transition px-5 py-4 rounded-2xl text-lg font-medium"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
