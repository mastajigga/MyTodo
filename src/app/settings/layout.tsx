import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Paramètres | MyTodo",
  description: "Gérez vos préférences et paramètres de compte",
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 