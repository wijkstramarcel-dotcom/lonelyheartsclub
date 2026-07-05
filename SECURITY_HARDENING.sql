-- Lonely Hearts Club — security hardening (2026-07-02)
-- Draai dit in de Supabase SQL Editor. Veilig om meerdere keren te draaien.
--
-- Dicht twee gaten:
-- 1. Profielfoto's waren leesbaar voor ELK ingelogd lid (foto-onthulling was
--    alleen visueel). Nu: alleen jijzelf en je matches kunnen je foto ophalen.
-- 2. Profiel aanmaken kon zonder geldige uitnodiging (de wachtlijst telde als
--    uitnodiging, en de laatste insert-policy had geen invite-check meer).
--    Nu: profiel aanmaken vereist een ingewisselde code of adminrechten.

-- ─────────────────────────────────────────────────────────────
-- 1. Wachtlijst telt niet langer als uitnodiging
-- ─────────────────────────────────────────────────────────────

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
    );
$$;

-- ─────────────────────────────────────────────────────────────
-- 2. Profiel aanmaken vereist een echte uitnodiging
-- ─────────────────────────────────────────────────────────────

drop policy if exists "Eigen profiel aanmaken" on profiles;

create policy "Eigen profiel aanmaken"
  on profiles for insert
  with check (auth.uid() = id and current_user_has_invite());

-- ─────────────────────────────────────────────────────────────
-- 3. Profielen lezen: alleen actieve profielen zonder blokkade,
--    jezelf, en je match-partners (ook als die gepauzeerd zijn)
-- ─────────────────────────────────────────────────────────────

drop policy if exists "Profielen lezen" on profiles;

create policy "Profielen lezen"
  on profiles for select using (
    auth.uid() = id
    or exists (
      select 1 from matches m
      where (m.user_a = auth.uid() and m.user_b = profiles.id)
         or (m.user_b = auth.uid() and m.user_a = profiles.id)
    )
    or (
      auth.role() = 'authenticated'
      and actief is true
      and not has_block_between(auth.uid(), profiles.id)
    )
  );

-- ─────────────────────────────────────────────────────────────
-- 4. Profielfoto's: alleen eigenaar en match-partners
-- ─────────────────────────────────────────────────────────────

drop policy if exists "Profile photos are readable by signed-in members" on storage.objects;

create policy "Profile photos are readable by signed-in members"
  on storage.objects for select
  using (
    bucket_id = 'profile-photos'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or exists (
        select 1 from matches m
        where (m.user_a = auth.uid() and m.user_b::text = (storage.foldername(name))[1])
           or (m.user_b = auth.uid() and m.user_a::text = (storage.foldername(name))[1])
      )
    )
  );

-- ─────────────────────────────────────────────────────────────
-- Controle
-- ─────────────────────────────────────────────────────────────

select
  (select with_check from pg_policies where tablename = 'profiles' and policyname = 'Eigen profiel aanmaken') as profiel_insert_check,
  (select count(*) from pg_policies where tablename = 'objects' and schemaname = 'storage' and policyname = 'Profile photos are readable by signed-in members') as foto_policy_aanwezig;
