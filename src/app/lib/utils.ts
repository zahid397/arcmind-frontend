import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/* Tailwind class merge */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* Currency formatter */
export function formatCurrency(amount: string, currency: string): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  });
  return formatter.format(Number(amount));
}

/* Time ago formatter */
export function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

/* Debounce (browser-safe) */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/* ID generator */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/* String truncation */
export function truncateString(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/* Mobile detection */
export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

/* Message animation */
export function createMessageAnimation(
  element: HTMLElement,
  type: "appear" | "disappear"
): Animation {
  return element.animate(
    [
      { opacity: 0, transform: "translateY(20px) scale(0.95)" },
      { opacity: 1, transform: "translateY(0) scale(1)" }
    ],
    {
      duration: 600,
      easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      direction: type === "disappear" ? "reverse" : "normal",
      fill: "forwards"
    }
  );
}
