import { User } from '@/types/user';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardHeaderProps {
  profile: User;
}

export const DashboardHeader = ({ profile }: DashboardHeaderProps) => {
  return (
    <Card className="mb-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
      <CardContent className="flex items-center space-x-4 p-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} role="img" />
          <AvatarFallback>{profile?.full_name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Bienvenue, {profile?.full_name || 'Utilisateur'}
          </h1>
          <p className="text-muted-foreground">
            Voici un aperçu de vos tâches et de votre progression
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 