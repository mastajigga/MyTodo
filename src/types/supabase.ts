export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          email: string;
          created_at: string;
          updated_at: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          workspace_id: string;
          created_at: string;
          updated_at: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          status: 'pending' | 'in-progress' | 'completed';
          priority: 'low' | 'medium' | 'high';
          due_date: string | null;
          user_id: string;
          workspace_id: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          type: 'family' | 'professional' | 'private';
          created_by: string;
          created_at: string;
          updated_at: string;
        };
      };
      workspace_members: {
        Row: {
          workspace_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member';
          joined_at: string;
        };
      };
    };
  };
}; 