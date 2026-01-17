import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import dynamicImport from 'next/dynamic';

const Header = dynamicImport(() => import('./components/layout/Header'), {
  ssr: false,
});

const Sidebar = dynamicImport(() => import('./components/layout/Sidebar'), {
  ssr: false,
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ArcMind',
  description: 'AI Assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
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
