import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('./components/layout/Header'), {
  ssr: false, // ✅ MUST
});

const Sidebar = dynamic(() => import('./components/layout/Sidebar'), {
  ssr: false, // ✅ MUST
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ArcMind - Advanced AI Assistant',
  description: 'Production-grade AI assistant with blockchain integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </div>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}
