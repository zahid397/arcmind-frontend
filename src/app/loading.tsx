import { Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
      <div className="relative">
        {/* Spinner Ring */}
        <div className="w-16 h-16 border-4 border-arc-purple/30 border-t-arc-purple rounded-full animate-spin"></div>
        
        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-arc-purple animate-pulse" />
        </div>
      </div>
      
      {/* Loading Text */}
      <p className="text-muted-foreground font-mono text-sm animate-pulse">
        Initializing ArcMind Core...
      </p>
    </div>
  );
}
