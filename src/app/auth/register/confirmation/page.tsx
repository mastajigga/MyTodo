'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function RegisterConfirmationPage() {
  const router = useRouter();

  return (
    <div className="p-4 sm:p-8 min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-6"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="space-y-2 text-center"
        >
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Vérifiez votre boîte mail
          </h1>
          <p className="text-sm text-muted-foreground">
            Un email de confirmation a été envoyé à votre adresse
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 bg-card/50 backdrop-blur-sm p-6 rounded-lg border shadow-sm text-center"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Cliquez sur le lien dans l'email pour confirmer votre compte et commencer à utiliser MyTodo
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-2"
          >
            <Button
              onClick={() => router.push('/auth/login')}
              className="w-full h-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
            >
              Retourner à la page de connexion
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="text-sm">
            <span className="text-muted-foreground">Vous n'avez pas reçu l'email ? </span>
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:underline transition-all"
            >
              Réessayer
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 