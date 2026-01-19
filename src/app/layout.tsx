import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// ফন্ট লোড করা হচ্ছে
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans' 
});

const mono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono' 
});

export const metadata: Metadata = {
  title: 'ArcMind | AI Commerce Agent',
  description: 'Autonomous AI Agent for seamless commerce via Circle Payment.',
  icons: {
    icon: '/favicon.ico', // যদি আইকন থাকে
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
