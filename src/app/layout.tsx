import { Metadata } from 'next'
import ClientLayout from './ClientLayout'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'MyTodo App',
  description: 'A simple todo app built with Next.js and Supabase',
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