import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { AnimatedLayout } from '@/components/layout/AnimatedLayout'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MyTodo - Gestion de tâches collaborative',
  description: 'Application de gestion de tâches collaborative moderne et intuitive',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="mytodo-theme"
        >
          <AnimatedLayout>
            {children}
          </AnimatedLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
} 