const { createClient } = require('@supabase/supabase-js');
const { expect } = require('chai');
require('dotenv').config({ path: '.env.test' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

describe('Database Structure Tests', () => {
  let workspace, taskList, task, tag;
  let testUser;

  before(async () => {
    try {
      // D'abord, essayer de se connecter
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'testuser@gmail.com',
        password: 'testPassword123!'
      });

      if (signInError) {
        console.log('Tentative de création d\'un nouvel utilisateur...');
        // Si la connexion échoue, créer un nouvel utilisateur
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'testuser@gmail.com',
          password: 'testPassword123!'
        });

        if (signUpError) {
          console.error('Erreur lors de la création de l\'utilisateur:', signUpError);
          throw signUpError;
        }

        // Attendre que l'utilisateur soit confirmé (dans un environnement de test, cela devrait être automatique)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Essayer de se connecter à nouveau
        const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
          email: 'testuser@gmail.com',
          password: 'testPassword123!'
        });

        if (newSignInError) throw newSignInError;
        testUser = newSignInData.user;
      } else {
        testUser = signInData.user;
      }

      if (!testUser) {
        throw new Error('Impossible d\'obtenir l\'utilisateur de test');
      }

      console.log('Utilisateur de test authentifié avec succès:', testUser.id);
    } catch (error) {
      console.error('Erreur d\'authentification détaillée:', error);
      throw error;
    }
  });

  describe('Workspace Management', () => {
    it('should create a workspace', async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          name: 'Test Workspace',
          description: 'Test Description',
          created_by: testUser.id
        })
        .select()
        .single();

      expect(error).to.be.null;
      expect(data).to.have.property('id');
      expect(data.name).to.equal('Test Workspace');
      workspace = data;
    });

    it('should enforce unique workspace names per user', async () => {
      const { error } = await supabase
        .from('workspaces')
        .insert({
          name: 'Test Workspace',
          description: 'Duplicate',
          created_by: testUser.id
        });

      expect(error).to.not.be.null;
    });
  });

  describe('Task List Management', () => {
    it('should create a task list', async () => {
      const { data, error } = await supabase
        .from('task_lists')
        .insert({
          name: 'Test List',
          description: 'Test List Description',
          workspace_id: workspace.id,
          created_by: testUser.id
        })
        .select()
        .single();

      expect(error).to.be.null;
      expect(data).to.have.property('id');
      expect(data.name).to.equal('Test List');
      taskList = data;
    });

    it('should enforce workspace reference', async () => {
      const { error } = await supabase
        .from('task_lists')
        .insert({
          name: 'Invalid List',
          workspace_id: '00000000-0000-0000-0000-000000000000',
          created_by: testUser.id
        });

      expect(error).to.not.be.null;
    });
  });

  describe('Task Management', () => {
    it('should create a task', async () => {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: 'Test Task',
          description: 'Test Task Description',
          list_id: taskList.id,
          created_by: testUser.id,
          priority: 3
        })
        .select()
        .single();

      expect(error).to.be.null;
      expect(data).to.have.property('id');
      expect(data.title).to.equal('Test Task');
      task = data;
    });

    it('should enforce valid status values', async () => {
      const { error } = await supabase
        .from('tasks')
        .insert({
          title: 'Invalid Status Task',
          list_id: taskList.id,
          created_by: testUser.id,
          status: 'invalid_status'
        });

      expect(error).to.not.be.null;
    });

    it('should enforce priority range', async () => {
      const { error } = await supabase
        .from('tasks')
        .insert({
          title: 'Invalid Priority Task',
          list_id: taskList.id,
          created_by: testUser.id,
          priority: 6
        });

      expect(error).to.not.be.null;
    });
  });

  describe('Tag Management', () => {
    it('should create a tag', async () => {
      const { data, error } = await supabase
        .from('tags')
        .insert({
          name: 'Test Tag',
          color: '#FF0000',
          workspace_id: workspace.id,
          created_by: testUser.id
        })
        .select()
        .single();

      expect(error).to.be.null;
      expect(data).to.have.property('id');
      expect(data.name).to.equal('Test Tag');
      tag = data;
    });

    it('should enforce unique tag names per workspace', async () => {
      const { error } = await supabase
        .from('tags')
        .insert({
          name: 'Test Tag',
          workspace_id: workspace.id,
          created_by: testUser.id
        });

      expect(error).to.not.be.null;
    });

    it('should associate a tag with a task', async () => {
      const { error } = await supabase
        .from('task_tags')
        .insert({
          task_id: task.id,
          tag_id: tag.id
        });

      expect(error).to.be.null;
    });
  });

  describe('Security Policies', () => {
    let unauthorizedUser;

    before(async () => {
      // Créer un utilisateur non autorisé
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: 'unauthorized.user@gmail.com',
        password: 'testpassword123'
      });
      if (userError) throw userError;
      unauthorizedUser = userData.user;
    });

    it('should prevent unauthorized access to workspaces', async () => {
      const supabaseUnauth = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
      );

      const { data: signInData, error: signInError } = await supabaseUnauth.auth.signInWithPassword({
        email: 'unauthorized.user@gmail.com',
        password: 'testpassword123'
      });

      expect(signInError).to.be.null;

      const { error } = await supabaseUnauth
        .from('workspaces')
        .select()
        .eq('id', workspace.id)
        .single();

      expect(error).to.not.be.null;
    });
  });

  after(async () => {
    try {
      // Nettoyage dans l'ordre inverse des dépendances
      await supabase.from('task_tags').delete().eq('task_id', task?.id);
      await supabase.from('tags').delete().eq('id', tag?.id);
      await supabase.from('tasks').delete().eq('id', task?.id);
      await supabase.from('task_lists').delete().eq('id', taskList?.id);
      await supabase.from('workspaces').delete().eq('id', workspace?.id);
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
    }
  });
}); 