import { Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
        </div>
      </div>
      <p className="text-gray-400 font-mono text-sm animate-pulse">
        Initializing ArcMind Core...
      </p>
    </div>
  );
}
