import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Arcmind - AI Chat Experience',
  description: 'Animated AI chat interface with immersive visual effects',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white overflow-hidden`}>
        {children}
      </body>
    </html>
  )
}
