'use client';

import './globals.css';
import { MainNav } from '@/components/layout/MainNav';
import { UserNav } from '@/components/layout/UserNav';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { SearchBar } from '@/components/layout/SearchBar';
import { Toaster } from 'sonner';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-background" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen overflow-hidden">
            {/* Barre latérale avec dégradé et ombre */}
            <aside className="relative w-64 bg-gradient-to-b from-background to-background/95 shadow-xl">
              <div className="flex h-full flex-col px-6 py-8">
                <MainNav />
                {/* Effet de brillance */}
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                  <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-purple-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
                </div>
              </div>
            </aside>

            {/* Contenu principal avec design moderne */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="relative border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-16 items-center gap-4 px-6">
                  <div className="flex-1 flex justify-center">
                    <SearchBar />
                  </div>
                  <UserNav />
                </div>
                {/* Effet de ligne gradient */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              </header>

              <main className="flex-1 overflow-y-auto bg-muted/10">
                <div className="container mx-auto py-8 px-6">
                  {children}
                </div>
              </main>
            </div>
          </div>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
} 