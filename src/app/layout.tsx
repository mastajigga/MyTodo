import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import { ClientLayoutContent } from "@/components/layout/ClientLayoutContent";
import "./globals.css";
import { Logger } from '@/lib/logger';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyTodo",
  description: "Une application de gestion de tâches moderne et intuitive",
};

const logger = Logger.getInstance();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <ClientLayoutContent session={session}>
            {children}
          </ClientLayoutContent>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}