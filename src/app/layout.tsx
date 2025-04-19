import { Metadata } from 'next'
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { inter } from "@/lib/fonts";
import "@/styles/globals.css";
import { MobileLayout } from "@/components/layout/MobileLayout";

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
    <html lang="fr" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background antialiased", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MobileLayout>
            {children}
          </MobileLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}