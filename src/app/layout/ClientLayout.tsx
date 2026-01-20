'use client'

import * as React from 'react'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/components/theme-provider'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#18181b', // dark bg
            color: '#fff',
            border: '1px solid #27272a',
          },
        }}
      />
    </ThemeProvider>
  )
}
