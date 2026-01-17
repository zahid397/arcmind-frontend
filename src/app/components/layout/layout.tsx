import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import dynamic from 'next/dynamic';

// Dynamic import for client components to avoid hydration errors
const Header = dynamic(() => import('./components/layout/Header'), {
  ssr: true,
  loading: () => (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-lg h-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="animate-pulse bg-gray-700 h-8 w-32 rounded"></div>
        <div className="animate-pulse bg-gray-700 h-8 w-24 rounded"></div>
      </div>
    </div>
  ),
});

const Sidebar = dynamic(() => import('./components/layout/Sidebar'), {
  ssr: false, // Important: Sidebar uses client-side features
  loading: () => (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-border bg-background/50">
      <div className="p-4 border-b border-border">
        <div className="animate-pulse bg-gray-700 h-12 w-full rounded-lg"></div>
      </div>
    </aside>
  ),
});

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
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ArcMind AI Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArcMind - Advanced AI Assistant',
    description: 'Production-grade AI assistant with blockchain integration',
    creator: '@zahid397',
    images: ['/og-image.png'],
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        {/* Background Elements */}
        <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-gray-900 -z-10" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10" />
        <div 
          className="fixed inset-0 opacity-5 -z-10"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
          }}
        />

        <div className="relative flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 relative overflow-hidden">
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
            error: {
              style: {
                background: 'hsl(var(--destructive))',
                color: 'hsl(var(--destructive-foreground))',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
