import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ProjectFiltersProps {
  filters: {
    status: string | null;
    priority: string | null;
    assignee: string | null;
    dueDate: string | null;
  };
  onChange: (filters: any) => void;
  members: any[];
}

export const ProjectFilters = ({ filters, onChange, members }: ProjectFiltersProps) => {
  const handleFilterChange = (key: string, value: string | null) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">
      {/* Status Filter */}
      <div className="space-y-2">
        <Label>Statut</Label>
        <Select
          value={filters.status || ''}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous</SelectItem>
            <SelectItem value="todo">À faire</SelectItem>
            <SelectItem value="in_progress">En cours</SelectItem>
            <SelectItem value="review">En revue</SelectItem>
            <SelectItem value="done">Terminé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assignee Filter */}
      <div className="space-y-2">
        <Label>Assigné à</Label>
        <Select
          value={filters.assignee || ''}
          onValueChange={(value) => handleFilterChange('assignee', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tous les membres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous</SelectItem>
            {members.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.full_name || member.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Due Date Filter */}
      <div className="space-y-2">
        <Label>Date limite</Label>
        <Select
          value={filters.dueDate || ''}
          onValueChange={(value) => handleFilterChange('dueDate', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Toutes les dates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes</SelectItem>
            <SelectItem value="overdue">En retard</SelectItem>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="this_week">Cette semaine</SelectItem>
            <SelectItem value="this_month">Ce mois</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}; 