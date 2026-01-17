import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/* ======================================================
   TYPES
====================================================== */

export interface AnimationOptions extends KeyframeAnimationOptions {
  direction?: PlaybackDirection;
}

export interface FormatCurrencyOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  notation?: Intl.NumberFormatOptions['notation'];
  compactDisplay?: Intl.NumberFormatOptions['compactDisplay'];
}

export interface TruncateOptions {
  maxLength: number;
  ellipsis?: string;
  preserveWords?: boolean;
}

/* ======================================================
   CLASS NAME UTILS
====================================================== */

export function cn(...inputs: ClassValue[]): string {
  try {
    return twMerge(clsx(inputs));
  } catch {
    return inputs.filter(Boolean).join(' ');
  }
}

/* ======================================================
   CURRENCY
====================================================== */

export function formatCurrency(
  amount: number | string,
  currency: string,
  options: FormatCurrencyOptions = {}
): string {
  const value = typeof amount === 'string' ? Number(amount) : amount;

  if (!Number.isFinite(value)) {
    return `${currency.toUpperCase()} 0.00`;
  }

  try {
    return new Intl.NumberFormat(options.locale ?? 'en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: options.minimumFractionDigits ?? 2,
      maximumFractionDigits: options.maximumFractionDigits ?? 2,
      notation: options.notation,
      compactDisplay: options.compactDisplay,
    }).format(value);
  } catch {
    return `${currency.toUpperCase()} ${value.toFixed(2)}`;
  }
}

/* ======================================================
   TIME AGO
====================================================== */

export function formatTimeAgo(
  input: number | string | Date,
  opts: { includeSeconds?: boolean; longFormat?: boolean } = {}
): string {
  const date =
    typeof input === 'number'
      ? new Date(input)
      : typeof input === 'string'
      ? new Date(input)
      : input;

  if (isNaN(date.getTime())) return 'Invalid time';

  const diff = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diff < 0) return formatFutureDate(date);

  const units: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
    [1, 'second'],
  ];

  for (const [sec, label] of units) {
    const count = Math.floor(diff / sec);
    if (count >= 1) {
      if (label === 'second' && !opts.includeSeconds) {
        return opts.longFormat ? 'Just now' : 'Now';
      }
      return opts.longFormat
        ? `${count} ${label}${count > 1 ? 's' : ''} ago`
        : `${count}${label[0]} ago`;
    }
  }

  return 'Now';
}

function formatFutureDate(date: Date): string {
  const days = Math.ceil((date.getTime() - Date.now()) / 86400000);
  if (days === 1) return 'Tomorrow';
  if (days < 7) return `In ${days} days`;
  if (days < 30) return `In ${Math.ceil(days / 7)} weeks`;
  return `In ${Math.ceil(days / 30)} months`;
}

/* ======================================================
   DEBOUNCE / THROTTLE
====================================================== */

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/* ======================================================
   ID GENERATOR
====================================================== */

export function generateId(
  strategy: 'timestamp' | 'random' | 'uuid' = 'timestamp'
): string {
  if (strategy === 'uuid' && typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  if (strategy === 'random') {
    return Math.random().toString(36).slice(2, 10);
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ======================================================
   STRING UTILS
====================================================== */

export function truncateString(
  text: string,
  options: number | TruncateOptions
): string {
  const opts =
    typeof options === 'number' ? { maxLength: options } : options;

  if (text.length <= opts.maxLength) return text;

  const ellipsis = opts.ellipsis ?? '...';
  const max = opts.maxLength - ellipsis.length;

  if (opts.preserveWords) {
    const sliced = text.slice(0, max);
    return sliced.slice(0, sliced.lastIndexOf(' ')) + ellipsis;
  }

  return text.slice(0, max) + ellipsis;
}

/* ======================================================
   DEVICE
====================================================== */

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  if (window.innerWidth < 768) return 'mobile';
  if (window.innerWidth < 1024) return 'tablet';
  return 'desktop';
}

/* ======================================================
   ANIMATION (CLIENT ONLY)
====================================================== */

export function createMessageAnimation(
  el: HTMLElement | null,
  type: 'appear' | 'slide' | 'bounce'
): Animation | null {
  if (!el || typeof el.animate !== 'function') return null;

  const frames: Keyframe[] =
    type === 'bounce'
      ? [
          { transform: 'scale(0.9)', opacity: 0 },
          { transform: 'scale(1.05)', opacity: 1 },
          { transform: 'scale(1)', opacity: 1 },
        ]
      : type === 'slide'
      ? [
          { transform: 'translateY(20px)', opacity: 0 },
          { transform: 'translateY(0)', opacity: 1 },
        ]
      : [
          { opacity: 0, transform: 'scale(0.95)' },
          { opacity: 1, transform: 'scale(1)' },
        ];

  return el.animate(frames, {
    duration: 300,
    easing: 'ease-out',
    fill: 'forwards',
  });
}

/* ======================================================
   MISC
====================================================== */

export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let i = 0;

  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }

  return `${size.toFixed(1)} ${units[i]}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined') return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function groupBy<T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const k = String(item[key]);
    (acc[k] ||= []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
}
