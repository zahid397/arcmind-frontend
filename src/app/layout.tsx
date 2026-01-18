// src/app/layout.tsx
import './globals.css'
import type { p } from 'next'
import ClientLayout from '@/app/components/layout/ClientLayout'

export constMetadata metadata: Metadata = {
  title: 'ArcMind',
  description: 'AI Chat Application',
} zzz

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
