-- Script pour désactiver temporairement RLS sur les tables spécifiées
-- ⚠️ ATTENTION: Ce script désactive temporairement la sécurité au niveau des lignes
-- À utiliser uniquement dans un environnement de développement ou pour le débogage

-- Désactiver RLS sur la table des tâches
ALTER TABLE task DISABLE ROW LEVEL SECURITY;

-- Désactiver RLS sur la table des projets
ALTER TABLE project DISABLE ROW LEVEL SECURITY;

-- Désactiver RLS sur la table des membres de projet
ALTER TABLE project_member DISABLE ROW LEVEL SECURITY;

-- Vérifier que RLS est bien désactivé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('task', 'project', 'project_member');

-- Note: Pour réactiver RLS plus tard, utilisez:
-- ALTER TABLE task ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE project ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE project_member ENABLE ROW LEVEL SECURITY; 