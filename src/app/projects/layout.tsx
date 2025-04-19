import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projets | MyTodo',
  description: 'Gérez vos projets et suivez leur progression',
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 