import { Metadata } from 'next'
import { ClientLayout } from './ClientLayout'

export const metadata: Metadata = {
  title: 'MyTodo - Gérez vos tâches efficacement',
  description: 'Application de gestion de tâches moderne et intuitive',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}