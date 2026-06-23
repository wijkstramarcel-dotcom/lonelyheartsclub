-- Lonely Hearts Club - repair profile insert access.
-- Safe to run multiple times in the Supabase SQL Editor.

create or replace function current_user_has_invite()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    auth.uid() is not null
    and (
      exists (
        select 1
        from invite_redemptions r
        where r.user_id = auth.uid()
      )
      or exists (
        select 1
        from app_admins a
        where a.user_id = auth.uid()
      )
      or exists (
        select 1
        from waitlist w
        where lower(w.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
    );
$$;

drop policy if exists "Eigen profiel aanmaken" on profiles;

create policy "Eigen profiel aanmaken"
  on profiles for insert
  with check (auth.uid() = id and current_user_has_invite());

select
  current_user_has_invite() as current_user_can_create_profile,
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Eigen profiel aanmaken'
  ) as profile_insert_policy_ready;
