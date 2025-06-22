'use client';

export default function SuggestedUsers() {
  // Later you can fetch real suggestions
  const mockUsers = [
    { id: 1, name: 'Luffy', username: 'monkey_d_luffy' },
    { id: 2, name: 'Zoro', username: 'pirate_hunter' },
    { id: 3, name: 'Nami', username: 'navigator_nami' },
    { id: 4, name: 'Nami', username: 'navigator_nami' },
    { id: 5, name: 'Nami', username: 'navigator_nami' },
    { id: 6, name: 'Nami', username: 'navigator_nami' },
  ];

  return (
    <div className="bg-black/5 backdrop-blur-md rounded-xl p-4 text-sm w-full max-w-xs ">
      <ul className="space-y-3">
        {mockUsers.map(user => (
          <li key={user.id} className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 transition-all hover:border-yellow-900/50 hover:shadow-lg hover:shadow-yellow-900/10 hover:scale-[1.015] h-full flex  items-center justify-between">
            <div>
              <p className="text-white">{user.name}</p>
              <p className="text-gray-400 text-xs">@{user.username}</p>
            </div>
            <button className="text-yellow-400 hover:underline text-xs">Follow</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
