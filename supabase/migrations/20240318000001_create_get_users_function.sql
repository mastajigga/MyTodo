-- Create a function to safely get user information
CREATE OR REPLACE FUNCTION public.get_users_by_ids(user_ids UUID[])
RETURNS TABLE (
    id UUID,
    full_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.raw_user_meta_data->>'full_name' as full_name
    FROM auth.users u
    WHERE u.id = ANY(user_ids);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_users_by_ids(UUID[]) TO authenticated; 