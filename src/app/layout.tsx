import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './components/layout/ClientLayout'; // র‍্যাপার ইম্পোর্ট

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ArcMind - AI Chat Assistant',
  description: 'Intelligent conversations powered by advanced AI',
  keywords: ['AI', 'Chat', 'Assistant', 'Conversation', 'ArcMind'],
  authors: [{ name: 'ArcMind Team' }],
  creator: 'ArcMind',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        {/* সব UI এখন ClientLayout এর ভেতরে */}
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
