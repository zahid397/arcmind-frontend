// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import ClientLayout from '@/app/components/layout/ClientLayout'

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
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
