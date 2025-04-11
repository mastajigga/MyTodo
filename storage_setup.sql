-- Création du bucket pour les avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Politique pour permettre l'accès public aux avatars
create policy "Avatars are publicly accessible"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Politique pour permettre aux utilisateurs authentifiés de télécharger leur avatar
create policy "Users can upload their own avatar"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Politique pour permettre aux utilisateurs de mettre à jour leur avatar
create policy "Users can update their own avatar"
on storage.objects for update
to authenticated
using (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
)
with check (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Politique pour permettre aux utilisateurs de supprimer leur avatar
create policy "Users can delete their own avatar"
on storage.objects for delete
to authenticated
using (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
); 