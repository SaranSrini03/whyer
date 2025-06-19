// components/PulseSection.tsx
'use client';

import { useEffect, useState } from 'react';

export default function PulseSection({ whyId }: { whyId: string }) {
  const [pulses, setPulses] = useState<any[]>([]);
  const [newPulse, setNewPulse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/pulse?whyId=${whyId}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          console.error('Fetch failed:', res.status, text);
          return [];
        }
        return res.json();
      })
      .then(setPulses)
      .catch((err) => {
        console.error('Error fetching pulses:', err);
        setPulses([]);
      });
  }, [whyId]);

  const submitPulse = async () => {
    if (!newPulse.trim()) return;
    setLoading(true);

    const res = await fetch('/api/pulse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newPulse, whyId }),
    });

    const updatedPulse = await res.json();
    setPulses(updatedPulse.replies);
    setNewPulse('');
    setLoading(false);
  };

  return (
    <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
      <div className="flex items-center mb-6">
        <h3 className="text-xl font-medium text-white">Pulses</h3>
        <div className="ml-2 bg-yellow-500/20 text-yellow-400 text-xs font-medium px-2 py-1 rounded-full">
          {pulses.length}
        </div>
      </div>

      <div className="mb-6">
        <textarea
          placeholder="Share your thoughts..."
          value={newPulse}
          onChange={(e) => setNewPulse(e.target.value)}
          className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-600 text-white resize-none"
          rows={3}
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={submitPulse}
            disabled={loading}
            className={`px-5 py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-800 text-black font-medium rounded-lg transition-all duration-300 shadow-lg shadow-yellow-900/20 hover:shadow-yellow-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-yellow-500 ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-yellow-700 hover:to-yellow-900'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting...
              </span>
            ) : (
              'Post Pulse'
            )}
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {pulses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pulses yet. Be the first to share your thoughts.
          </div>
        ) : (
          pulses.map((p) => (
            <div key={p._id || p.content} className="bg-black/30 border border-gray-800 rounded-lg p-5 group">
              <div className="flex items-start">
                {/* Avatar placeholder */}
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-900/20 border border-yellow-900/30 flex items-center justify-center">
                    <span className="text-yellow-500 font-medium">U</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-white">Anonymous</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Just now'}
                      </p>
                    </div>
                    <button className="p-1 rounded-full hover:bg-yellow-900/10 transition-colors opacity-0 group-hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 hover:text-yellow-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-gray-300 mt-3 whitespace-pre-line">{p.content}</p>
                  
                  <div className="flex items-center mt-4">
                    <button className="flex items-center text-xs text-gray-500 hover:text-yellow-400 transition-colors mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                      </svg>
                      Spark
                    </button>
                    
                    <button className="flex items-center text-xs text-gray-500 hover:text-yellow-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                      </svg>
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}