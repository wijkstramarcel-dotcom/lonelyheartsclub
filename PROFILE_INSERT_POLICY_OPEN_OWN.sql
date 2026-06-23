-- Lonely Hearts Club - allow every signed-in user to create only their own profile.
-- This prevents onboarding dead-ends while updates/selects remain protected by RLS.

drop policy if exists "Eigen profiel aanmaken" on profiles;

create policy "Eigen profiel aanmaken"
  on profiles for insert
  with check (auth.uid() = id);

select
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Eigen profiel aanmaken'
      and qual is null
      and with_check like '%auth.uid() = id%'
  ) as profile_insert_policy_allows_own_profile;
