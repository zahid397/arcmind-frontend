import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';
import './globals.css';

/* -------------------- FONT -------------------- */
const inter = Inter({ subsets: ['latin'] });

/* -------------------- DYNAMIC CLIENT COMPONENTS -------------------- */
// Header uses hooks → client, but can render on server safely
const Header = dynamic(() => import('./components/layout/Header'), {
  ssr: true,
});

// Sidebar uses localStorage, window → client only
const Sidebar = dynamic(() => import('./components/layout/Sidebar'), {
  ssr: false,
});

/* -------------------- METADATA -------------------- */
export const metadata: Metadata = {
  title: 'ArcMind - Advanced AI Assistant',
  description:
    'Production-grade AI assistant with blockchain integration and advanced features',
  keywords: [
    'AI Assistant',
    'Blockchain',
    'Web3',
    'ChatGPT Alternative',
    'Smart Contracts',
  ],
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

/* -------------------- ROOT LAYOUT -------------------- */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background text-foreground antialiased`}
      >
        {/* Background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-background to-gray-900" />

        <div className="flex min-h-screen">
          {/* Sidebar */}
          <Sidebar />

          {/* Main */}
          <div className="flex flex-1 flex-col">
            <Header />

            <main className="flex-1 relative overflow-hidden">
              {children}
            </main>
          </div>
        </div>

        {/* Toasts */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
      </body>
    </html>
  );
}
