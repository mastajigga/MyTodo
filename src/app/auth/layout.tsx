import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentification - MyTodo",
  description: "Page d'authentification de MyTodo",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20 animate-pulse" />
        <div className="relative bg-white dark:bg-gray-950 rounded-xl shadow-xl backdrop-blur-sm border border-gray-200 dark:border-gray-800">
          {children}
        </div>
      </div>
    </div>
  )
} 