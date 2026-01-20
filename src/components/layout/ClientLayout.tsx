'use client'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return <div className="min-h-screen bg-[#0f172a]" />

  return (
    <>
      {children}
      <Toaster position="bottom-right" toastOptions={{ className: '!bg-slate-900 !text-white !border !border-white/10' }} />
    </>
  )
}
