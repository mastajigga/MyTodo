const https = require('https');
require('dotenv').config();

const options = {
  hostname: new URL(process.env.SUPABASE_URL).hostname,
  path: '/rest/v1/sql',
  method: 'POST',
  headers: {
    'apikey': process.env.SUPABASE_API_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_API_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);
    console.log('Body:', data);
  });
});

const createTableSQL = {
  query: `
    -- Create tasks table
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
      priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
      due_date TIMESTAMP WITH TIME ZONE,
      list_id UUID NOT NULL REFERENCES task_lists(id) ON DELETE CASCADE,
      assigned_to UUID REFERENCES auth.users(id),
      created_by UUID NOT NULL REFERENCES auth.users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
      position INTEGER NOT NULL DEFAULT 0
    );

    -- Enable RLS
    ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

    -- Create indexes
    CREATE INDEX tasks_list_id_idx ON tasks(list_id);
    CREATE INDEX tasks_assigned_to_idx ON tasks(assigned_to);
    CREATE INDEX tasks_created_by_idx ON tasks(created_by);

    -- Add updated_at trigger
    CREATE TRIGGER set_tasks_updated_at
      BEFORE UPDATE ON tasks
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

    -- Policies
    CREATE POLICY "Users can read tasks if workspace member"
      ON tasks
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM task_lists
          JOIN workspace_members ON workspace_members.workspace_id = task_lists.workspace_id
          WHERE task_lists.id = tasks.list_id
          AND workspace_members.user_id = auth.uid()
        )
      );

    CREATE POLICY "Users can create tasks if workspace member"
      ON tasks
      FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM task_lists
          JOIN workspace_members ON workspace_members.workspace_id = task_lists.workspace_id
          WHERE task_lists.id = list_id
          AND workspace_members.user_id = auth.uid()
        )
      );

    CREATE POLICY "Users can update tasks if workspace member"
      ON tasks
      FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM task_lists
          JOIN workspace_members ON workspace_members.workspace_id = task_lists.workspace_id
          WHERE task_lists.id = tasks.list_id
          AND workspace_members.user_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM task_lists
          JOIN workspace_members ON workspace_members.workspace_id = task_lists.workspace_id
          WHERE task_lists.id = tasks.list_id
          AND workspace_members.user_id = auth.uid()
        )
      );

    CREATE POLICY "Only workspace owners, admins, and task creator can delete tasks"
      ON tasks
      FOR DELETE
      USING (
        EXISTS (
          SELECT 1 FROM task_lists
          JOIN workspace_members ON workspace_members.workspace_id = task_lists.workspace_id
          WHERE task_lists.id = tasks.list_id
          AND workspace_members.user_id = auth.uid()
          AND (
            workspace_members.role IN ('owner', 'admin')
            OR tasks.created_by = auth.uid()
          )
        )
      );
  `
};

req.write(JSON.stringify(createTableSQL));
req.end(); 