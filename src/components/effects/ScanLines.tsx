import { cn } from "@/lib/utils";

interface ScanLinesProps {
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export default function ScanLines({ className, intensity = "medium" }: ScanLinesProps) {
  
  // ইনটেনসিটি অনুযায়ী অপাসিটি ঠিক করা
  const intensityClass = {
    low: "opacity-[0.02]",
    medium: "opacity-[0.05]",
    high: "opacity-[0.08]"
  }[intensity];

  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none",
        intensityClass,
        className
      )}
    >
      <div 
        className="h-full w-full bg-[linear-gradient(to_bottom,transparent_50%,#000_50%)] bg-[length:100%_4px]"
      />
    </div>
  );
}
