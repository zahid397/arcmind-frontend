import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/app/components/layout/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ArcMind',
  description: 'AI Chat Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ClientLayout এর ভেতরে চিলড্রেন র‍্যাপ করা হলো যাতে এরর না খায় */}
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
