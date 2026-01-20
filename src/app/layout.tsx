import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

// ✅ FIX 1: সঠিক পাথ (app ফোল্ডার বাদ দেওয়া হয়েছে)
import ClientLayout from '@/components/layout/ClientLayout' 

// ✅ FIX 2: যদি EffectsClient ব্যবহার করিস, সেটার পাথও চেক করে নে। 
// যদি ফাইলটা src/components/effects এ থাকে তবে নিচের লাইনটা আনকমেন্ট কর:
// import EffectsClient from '@/components/effects/EffectsClient'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'ArcMind | AI-Powered Autonomous Commerce',
  description: 'Next-generation agentic commerce powered by Arc',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}>
        <ClientLayout>
          {/* <EffectsClient /> (যদি ইফেক্ট বানাস তবে এটা অন করিস) */}
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
