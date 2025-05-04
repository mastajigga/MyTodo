'use client';

import React from 'react';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/lib/services/taskService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarIcon, UserIcon, BadgeCheck, Loader2, Save, Calendar, Tag, Info, ChevronDown, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TASK_STATUS_MAP, Task, TaskStatus } from '@/@types/task';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'À faire', icon: <Info className="h-4 w-4 mr-2 text-blue-500" /> },
  { value: 'in_progress', label: 'En cours', icon: <Loader2 className="h-4 w-4 mr-2 text-yellow-500 animate-spin" /> },
  { value: 'completed', label: 'Terminée', icon: <BadgeCheck className="h-4 w-4 mr-2 text-green-500" /> },
  { value: 'cancelled', label: 'Annulée', icon: <Tag className="h-4 w-4 mr-2 text-gray-400" /> },
];
const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Basse', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Moyenne', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Haute', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-800' },
];

export default function TaskEditPage() {
  const params = useParams() as Record<string, string>;
  const router = useRouter();
  const queryClient = useQueryClient();
  const taskId = params?.taskId;
  const projectId = params?.projectId;

  const { data: task, isLoading, isError } = useQuery<Task>({
    queryKey: ['task', taskId],
    queryFn: () => taskService.getTask(taskId as string),
  });

  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialise le formulaire à la première récupération de la tâche
  React.useEffect(() => {
    console.debug('[TaskEditPage] task:', task);
    if (task) {
      // Vérification des champs critiques
      const requiredFields = ['id', 'title', 'status', 'priority', 'project_id', 'workspace_id'];
      const t = task as unknown as Record<string, unknown>;
      const missing = requiredFields.filter(f => !(f in t) || t[f] === undefined || t[f] === null);
      if (missing.length > 0) {
        setError(`Tâche corrompue ou incomplète (champs manquants : ${missing.join(', ')})`);
        return;
      }
      setForm({ ...task });
    }
    if (!isLoading && !task) setError('Tâche introuvable');
    if (isError) setError('Erreur lors du chargement de la tâche');
  }, [task, isLoading, isError]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      setSaving(true);
      // On ne garde que les champs valides pour la base
      const updates = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        due_date: data.due_date,
        assigned_to: data.assigned_to || null,
      };
      console.debug('[updateTask] updates envoyés:', updates);
      await taskService.updateTask(taskId, updates);
      setSaving(false);
      toast.success('Tâche mise à jour !');
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      router.push(`/projects/${projectId}/tasks`);
    },
    onError: (err: any) => {
      setSaving(false);
      toast.error('Erreur lors de la mise à jour de la tâche');
      if (err) {
        if (typeof err === 'object') {
          console.error('[updateTask] erreur complète:', JSON.stringify(err, null, 2));
          if (err.message) console.error('[updateTask] message:', err.message);
          if (err.details) console.error('[updateTask] details:', err.details);
          if (err.hint) console.error('[updateTask] hint:', err.hint);
        } else {
          console.error('[updateTask] erreur:', err);
        }
      } else {
        console.error('[updateTask] erreur: inconnue');
      }
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8 flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <span className="text-muted-foreground">Chargement de la tâche...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 flex flex-col items-center">
        <span className="text-destructive font-semibold text-lg mb-2">{error}</span>
        <span className="text-muted-foreground">Vérifiez l'URL ou réessayez plus tard.</span>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <Card className="shadow-xl border-2 border-primary/10 bg-white/90 dark:bg-gray-900/90">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>
            <span className="flex items-center gap-2">
              <Pencil className="h-6 w-6 text-primary animate-pulse" />
              Modifier la tâche
            </span>
          </CardTitle>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={saving}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2 rounded-lg shadow transition-all duration-200 focus:ring-2 focus:ring-primary/50 animate-bounce"
          >
            <Save className="h-5 w-5 animate-spin-slow" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Titre */}
          <div className="flex items-center gap-3">
            <Input
              value={form.title}
              onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))}
              className="text-2xl font-bold border-0 border-b-2 border-primary/30 focus:border-primary/80 bg-transparent transition-all duration-200"
              placeholder="Titre de la tâche"
              aria-label="Titre de la tâche"
            />
            <Info className="h-5 w-5 text-primary animate-pulse" />
          </div>
          {/* Description */}
          <div className="flex items-center gap-3">
            <Textarea
              value={form.description || ''}
              onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))}
              className="border-0 border-b-2 border-primary/30 focus:border-primary/80 bg-transparent transition-all duration-200 min-h-[80px]"
              placeholder="Description de la tâche"
              aria-label="Description de la tâche"
            />
            <Tag className="h-5 w-5 text-primary animate-bounce" />
          </div>
          {/* Statut */}
          <div className="flex items-center gap-3">
            <Select
              value={form.status}
              onValueChange={v => setForm((f: any) => ({ ...f, status: v }))}
            >
              <SelectTrigger className="w-48 border-primary/30 focus:border-primary/80">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="flex items-center gap-2">
                    {opt.icon}
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge className="bg-primary/10 text-primary border-primary/20 animate-fade-in">
              {TASK_STATUS_MAP[(form.status as TaskStatus)]}
            </Badge>
          </div>
          {/* Priorité */}
          <div className="flex items-center gap-3">
            <Select
              value={form.priority}
              onValueChange={v => setForm((f: any) => ({ ...f, priority: v }))}
            >
              <SelectTrigger className="w-48 border-primary/30 focus:border-primary/80">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className={`flex items-center gap-2 ${opt.color}`}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge className={`animate-fade-in ${PRIORITY_OPTIONS.find(opt => opt.value === form.priority)?.color || ''}`}>
              {PRIORITY_OPTIONS.find(opt => opt.value === form.priority)?.label}
            </Badge>
          </div>
          {/* Date d'échéance */}
          <div className="flex items-center gap-3">
            <Input
              type="date"
              value={form.due_date ? format(new Date(form.due_date), 'yyyy-MM-dd') : ''}
              onChange={e => setForm((f: any) => ({ ...f, due_date: e.target.value }))}
              className="w-48 border-primary/30 focus:border-primary/80"
              aria-label="Date d'échéance"
            />
            <Calendar className="h-5 w-5 text-primary animate-spin-slow" />
          </div>
          {/* Assigné à */}
          <div className="flex items-center gap-3">
            <Input
              value={form.assigned_to_user?.full_name || ''}
              onChange={e => setForm((f: any) => ({ ...f, assigned_to_user: { ...f.assigned_to_user, full_name: e.target.value } }))}
              className="w-64 border-primary/30 focus:border-primary/80"
              aria-label="Assigné à"
              placeholder="Nom de l'utilisateur assigné"
            />
            <UserIcon className="h-5 w-5 text-primary animate-fade-in" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 