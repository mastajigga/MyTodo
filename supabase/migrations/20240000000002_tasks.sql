create type task_position_update as (
  id uuid,
  position integer
);

create or replace function reorder_tasks(task_updates task_position_update[], list_id_param uuid)
returns void
language plpgsql
security definer
as $$
declare
  task_update task_position_update;
begin
  -- Vérifie que l'utilisateur a accès à la liste de tâches
  if not exists (
    select 1 from task_lists tl
    join workspace_members wm on wm.workspace_id = tl.workspace_id
    where tl.id = list_id_param
    and wm.user_id = auth.uid()
  ) then
    raise exception 'Accès non autorisé à cette liste de tâches';
  end if;

  -- Met à jour les positions des tâches
  foreach task_update in array task_updates
  loop
    update tasks
    set position = task_update.position,
        updated_at = now()
    where id = task_update.id
    and list_id = list_id_param;
  end loop;
end;
$$; 