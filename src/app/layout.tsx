import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import dynamic from 'next/dynamic';

export const dynamic = 'force-dynamic'; // 🔥 VERY IMPORTANT

const inter = Inter({ subsets: ['latin'] });

// ✅ Client components MUST be dynamic
const Header = dynamic(() => import('./components/layout/Header'), {
  ssr: false,
});

const Sidebar = dynamic(() => import('./components/layout/Sidebar'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'ArcMind - Advanced AI Assistant',
  description:
    'Production-grade AI assistant with blockchain integration and advanced features',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background text-foreground antialiased`}
      >
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1 overflow-hidden">{children}</main>
          </div>
        </div>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}
