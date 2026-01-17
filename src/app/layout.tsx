import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ArcMind - Advanced AI Assistant',
  description: 'Production-grade AI assistant with blockchain integration and advanced features',
  keywords: ['AI Assistant', 'Blockchain', 'Web3', 'ChatGPT Alternative', 'Smart Contracts'],
  authors: [{ name: 'zahid397' }],
  creator: 'zahid397',
  publisher: 'ArcMind',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://arcmind.ai',
    title: 'ArcMind - Advanced AI Assistant',
    description: 'Production-grade AI assistant with blockchain integration',
    siteName: 'ArcMind',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArcMind - Advanced AI Assistant',
    description: 'Production-grade AI assistant with blockchain integration',
    creator: '@zahid397',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <div className="relative flex min-h-screen">
          {/* Gradient Background */}
          <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-gray-900" />
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          
          {/* Grid Pattern */}
          <div className="fixed inset-0 bg-grid-pattern bg-[size:100px_100px] opacity-5" />

          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 relative">
              {children}
            </main>
          </div>
        </div>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
              backdropFilter: 'blur(10px)',
            },
            success: {
              iconTheme: {
                primary: 'hsl(var(--primary))',
                secondary: 'hsl(var(--primary-foreground))',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
