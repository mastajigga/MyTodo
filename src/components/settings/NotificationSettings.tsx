'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useSupabase } from '@/lib/supabase/supabase-provider'

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(true);
  const { supabase } = useSupabase();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          notification_preferences: {
            email: emailNotifications,
            task_reminders: taskReminders,
            project_updates: projectUpdates
          }
        }
      });

      if (error) throw error;

      toast.success('Préférences de notifications mises à jour');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour des préférences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="emailNotifications" className="flex flex-col">
            <span>Notifications par email</span>
            <span className="text-sm text-muted-foreground">
              Recevoir des notifications par email
            </span>
          </Label>
          <Switch
            id="emailNotifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="taskReminders" className="flex flex-col">
            <span>Rappels de tâches</span>
            <span className="text-sm text-muted-foreground">
              Recevoir des rappels pour les tâches à venir
            </span>
          </Label>
          <Switch
            id="taskReminders"
            checked={taskReminders}
            onCheckedChange={setTaskReminders}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="projectUpdates" className="flex flex-col">
            <span>Mises à jour des projets</span>
            <span className="text-sm text-muted-foreground">
              Être notifié des changements dans les projets
            </span>
          </Label>
          <Switch
            id="projectUpdates"
            checked={projectUpdates}
            onCheckedChange={setProjectUpdates}
            disabled={isLoading}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Enregistrement...' : 'Enregistrer les préférences'}
      </Button>
    </form>
  );
} 