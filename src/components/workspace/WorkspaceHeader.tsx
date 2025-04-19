import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InviteDialog } from './InviteDialog';
import { UserPlus } from 'lucide-react';

interface WorkspaceHeaderProps {
  workspaceId: string;
  name: string;
}

export function WorkspaceHeader({ workspaceId, name }: WorkspaceHeaderProps) {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between pb-4">
      <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
      <div className="flex gap-2">
        <Button
          onClick={() => setIsInviteDialogOpen(true)}
          variant="outline"
          size="sm"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Inviter
        </Button>
      </div>
      <InviteDialog
        workspaceId={workspaceId}
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
      />
    </div>
  );
} 