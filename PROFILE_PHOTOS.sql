-- Lonely Hearts Club - private profile photo storage.
-- Safe to run multiple times in the Supabase SQL Editor.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-photos',
  'profile-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Profile photos are readable by signed-in members" on storage.objects;
drop policy if exists "Members upload own profile photo" on storage.objects;
drop policy if exists "Members update own profile photo" on storage.objects;
drop policy if exists "Members delete own profile photo" on storage.objects;

create policy "Profile photos are readable by signed-in members"
  on storage.objects for select
  using (bucket_id = 'profile-photos' and auth.role() = 'authenticated');

create policy "Members upload own profile photo"
  on storage.objects for insert
  with check (
    bucket_id = 'profile-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Members update own profile photo"
  on storage.objects for update
  using (
    bucket_id = 'profile-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'profile-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Members delete own profile photo"
  on storage.objects for delete
  using (
    bucket_id = 'profile-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

select
  exists (select 1 from storage.buckets where id = 'profile-photos' and public is false) as private_bucket_ready,
  exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Members upload own profile photo'
  ) as upload_policy_ready,
  exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Profile photos are readable by signed-in members'
  ) as read_policy_ready;
