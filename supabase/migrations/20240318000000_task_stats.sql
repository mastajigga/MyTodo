-- Créer la fonction pour obtenir les statistiques des tâches
create or replace function get_task_stats(p_workspace_id uuid)
returns json
language plpgsql
security definer
as $$
declare
  result json;
begin
  select json_build_object(
    'in_progress_count', coalesce(sum(case when status = 'in_progress' then 1 else 0 end), 0),
    'todo_count', coalesce(sum(case when status = 'todo' then 1 else 0 end), 0),
    'done_count', coalesce(sum(case when status = 'done' then 1 else 0 end), 0)
  )
  into result
  from tasks
  where workspace_id = p_workspace_id
  and deleted_at is null;

  return result;
end;
$$; 