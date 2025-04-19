import { useState, useEffect } from 'react';
import { WorkspaceMember, WorkspaceMemberService } from '@/services/workspace-member.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface MemberListProps {
  workspaceId: string;
  currentUserId: string;
  isCurrentUserAdmin: boolean;
}

export function MemberList({ workspaceId, currentUserId, isCurrentUserAdmin }: MemberListProps) {
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, [workspaceId]);

  const loadMembers = async () => {
    try {
      const members = await WorkspaceMemberService.getWorkspaceMembers(workspaceId);
      setMembers(members);
    } catch (error) {
      toast.error("Erreur lors du chargement des membres");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: WorkspaceMember['role']) => {
    try {
      await WorkspaceMemberService.updateMemberRole(memberId, newRole);
      toast.success("Rôle mis à jour avec succès");
      loadMembers();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du rôle");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await WorkspaceMemberService.removeWorkspaceMember(memberId);
      toast.success("Membre retiré avec succès");
      setMembers(members.filter(m => m.id !== memberId));
    } catch (error) {
      toast.error("Erreur lors de la suppression du membre");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {members.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={member.avatar_url || ''} />
                <AvatarFallback>
                  {member.full_name?.split(' ').map(n => n[0]).join('') || member.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{member.full_name || member.email}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>

            {isCurrentUserAdmin && member.user_id !== currentUserId && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'admin')}>
                    Promouvoir administrateur
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'member')}>
                    Rétrograder membre
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Retirer du workspace
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 