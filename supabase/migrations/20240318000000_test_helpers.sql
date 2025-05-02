-- Fonction pour désactiver RLS sur les tables spécifiées
CREATE OR REPLACE FUNCTION disable_rls_for_testing(tables text[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    table_name text;
BEGIN
    -- Vérifier que nous sommes en environnement de test
    IF current_setting('app.environment', TRUE) != 'test' THEN
        RAISE EXCEPTION 'Cette fonction ne peut être utilisée qu''en environnement de test';
    END IF;

    FOREACH table_name IN ARRAY tables
    LOOP
        EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', table_name);
    END LOOP;
END;
$$;

-- Fonction pour réactiver RLS sur les tables spécifiées
CREATE OR REPLACE FUNCTION enable_rls_for_testing(tables text[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    table_name text;
BEGIN
    -- Vérifier que nous sommes en environnement de test
    IF current_setting('app.environment', TRUE) != 'test' THEN
        RAISE EXCEPTION 'Cette fonction ne peut être utilisée qu''en environnement de test';
    END IF;

    FOREACH table_name IN ARRAY tables
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    END LOOP;
END;
$$;

-- Accorder les permissions nécessaires
GRANT EXECUTE ON FUNCTION disable_rls_for_testing(text[]) TO service_role;
GRANT EXECUTE ON FUNCTION enable_rls_for_testing(text[]) TO service_role; 