'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="relative mb-6 sm:mb-8 lg:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
          Paramètres
        </h1>
        <div className="absolute -bottom-2 left-0 w-24 sm:w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
        <div className="absolute -bottom-2 left-0 w-24 sm:w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm" />
      </div>

      <Card className="backdrop-blur-sm bg-card/50">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle>Préférences</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <ProfileSettings />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>
            <TabsContent value="security">
              <SecuritySettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 