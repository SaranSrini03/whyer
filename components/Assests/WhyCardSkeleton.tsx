// components/Assests/WhyCardSkeleton.tsx
export default function WhyCardSkeleton() {
  return (
    <div className="animate-pulse bg-white/5 rounded-xl p-4 border border-white/10 shadow-sm space-y-4">
      <div className="h-4 w-1/2 bg-gray-700 rounded" />
      <div className="h-3 w-3/4 bg-gray-800 rounded" />
      <div className="h-3 w-full bg-gray-800 rounded" />
      <div className="h-3 w-2/3 bg-gray-700 rounded" />
    </div>
  );
}
