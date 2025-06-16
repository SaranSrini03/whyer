'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function SupportPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Integrate with support email or ticket system here
    alert('Thanks for reaching out! We’ll get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <main className="min-h-screen bg-black text-white font-mono">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-300px] left-[-300px] w-[800px] h-[800px] bg-gradient-to-r from-yellow-900/10 to-yellow-700/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-400px] right-[-300px] w-[700px] h-[700px] bg-gradient-to-r from-yellow-800/15 to-yellow-900/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] -z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23fde047' stroke-width='0.7'%3E%3Cpath d='M0 0h60v60H0z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-3xl mx-auto py-20 px-4 sm:px-6">
        <h1 className="text-4xl font-light mb-4 text-yellow-400">Support</h1>
        <p className="text-sm text-gray-400 mb-12">Need help? We're here for you.</p>

        {/* FAQ */}
        <section className="mb-12 space-y-6">
          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-1">How do I reset my password?</h2>
            <p className="text-sm text-gray-300">Go to the login page, click "Forgot password?" and follow the instructions.</p>
          </div>

          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-1">Where can I update my profile?</h2>
            <p className="text-sm text-gray-300">After logging in, go to your dashboard and click on your profile picture to access settings.</p>
          </div>

          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-1">How do I report a bug?</h2>
            <p className="text-sm text-gray-300">Use the form below or email us directly at <a href="mailto:support@whyer.app" className="underline text-yellow-400">support@whyer.app</a>.</p>
          </div>
        </section>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-600"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-600"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm text-gray-400 mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-600"
              placeholder="Tell us how we can help you..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-yellow-600 to-yellow-800 text-black font-medium rounded-lg hover:from-yellow-700 hover:to-yellow-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Send Message
          </button>
        </form>

        <div className="mt-12 text-sm text-gray-500">
          <Link href="/" className="text-yellow-400 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
