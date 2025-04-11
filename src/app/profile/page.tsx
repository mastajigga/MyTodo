'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { AlertCircle, User, Mail, Calendar, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

type Profile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  updated_at: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) {
          router.push('/auth/login');
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router, supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (e) {
      toast.error('Erreur lors de la mise à jour du profil');
      setError(e as Error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      setUploadingImage(true);
      
      // Vérification du type de fichier
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image');
      }

      // Vérification de la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('L\'image ne doit pas dépasser 5MB');
      }

      // Génération d'un nom unique pour le fichier
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;

      // Upload de l'image
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Récupération de l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Mise à jour du profil avec la nouvelle URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // Mise à jour du state
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      toast.success('Photo de profil mise à jour avec succès');
    } catch (e) {
      const error = e as Error;
      toast.error(error.message || 'Erreur lors du téléchargement de l\'image');
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-6">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Une erreur est survenue lors du chargement du profil. Veuillez
            réessayer plus tard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="relative">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-purple-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        <PageHeader
          heading="Profil"
          text="Gérez vos informations personnelles"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 backdrop-blur-sm bg-card/50 shadow-xl">
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="relative group">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'Avatar'} />
                <AvatarFallback className="text-lg">
                  {profile?.full_name?.charAt(0) || profile?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Upload className="h-6 w-6 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
              {uploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Cliquez sur l'avatar pour changer votre photo
            </p>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  value={profile?.full_name || ''}
                  onChange={(e) =>
                    setProfile(prev =>
                      prev ? { ...prev, full_name: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Enregistrer</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{profile?.full_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Membre depuis {format(new Date(profile?.updated_at || ''), 'PP', { locale: fr })}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profile?.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Dernière mise à jour le{' '}
                    {format(new Date(profile?.updated_at || ''), 'PPp', {
                      locale: fr,
                    })}
                  </span>
                </div>
              </div>

              <Button onClick={() => setIsEditing(true)}>
                Modifier le profil
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
} 