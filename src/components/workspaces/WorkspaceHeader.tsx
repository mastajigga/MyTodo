import { Database } from '@/types/supabase';

type Workspace = Database['public']['Tables']['workspaces']['Row'];

interface WorkspaceHeaderProps {
  workspace: Workspace;
}

export function WorkspaceHeader({ workspace }: WorkspaceHeaderProps) {
  return (
    <div className="relative">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
        {workspace.name}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">
        {workspace.description}
      </p>
      <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
      <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm" />
    </div>
  );
} 