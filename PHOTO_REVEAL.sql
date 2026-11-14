-- Lonely Hearts Club — foto-onthulling die de server afdwingt
-- Draai dit na schema.sql, PROFILE_PHOTOS.sql en SECURITY_HARDENING.sql.
-- Veilig om meerdere keren te draaien.
--
-- Hoe het werkt:
-- - Bij het opslaan van een profielfoto maakt de app vier varianten:
--   <user-id>/reveal-25.jpg (sterk vervaagd), reveal-50.jpg, reveal-75.jpg
--   en reveal-100.jpg (scherp).
-- - Een match mag alleen de varianten ophalen tot en met het niveau dat
--   bij de fase van het contact hoort. Het origineel is alleen voor de
--   eigenaar. Dat wordt hier afgedwongen, niet in de browser.
--
-- Niveaus:
--   25  = er is een match
--   50  = beide leden hebben minstens één bericht gestuurd
--   75  = er is een belmoment van minstens 30 seconden afgerond
--   100 = beide leden hebben aangegeven te willen afspreken

create table if not exists public.meet_intents (
  match_id uuid not null references public.matches(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (match_id, user_id)
);

alter table public.meet_intents enable row level security;

drop policy if exists "Match deelnemers lezen afspraakwens" on public.meet_intents;
drop policy if exists "Eigen afspraakwens toevoegen" on public.meet_intents;
drop policy if exists "Eigen afspraakwens intrekken" on public.meet_intents;

create policy "Match deelnemers lezen afspraakwens"
  on public.meet_intents for select using (is_match_participant(match_id));

create policy "Eigen afspraakwens toevoegen"
  on public.meet_intents for insert
  with check (auth.uid() = user_id and is_match_participant(match_id));

create policy "Eigen afspraakwens intrekken"
  on public.meet_intents for delete using (auth.uid() = user_id);

-- Belmomenten: de server bepaalt begin, einde en duur, niet de browser.
create or replace function public.lhc_guard_call_times()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    new.started_at := now();
    new.ended_at := null;
    new.duration_seconds := null;
    return new;
  end if;

  new.match_id := old.match_id;
  new.caller_id := old.caller_id;
  new.started_at := old.started_at;
  if old.ended_at is not null then
    new.ended_at := old.ended_at;
    new.duration_seconds := old.duration_seconds;
  elsif new.ended_at is not null then
    new.ended_at := now();
    new.duration_seconds := greatest(0, floor(extract(epoch from (new.ended_at - old.started_at))))::int;
  end if;
  return new;
end;
$$;

revoke execute on function public.lhc_guard_call_times() from public, anon, authenticated;

drop trigger if exists guard_call_times on public.calls;
create trigger guard_call_times
  before insert or update on public.calls
  for each row execute function public.lhc_guard_call_times();

create or replace function public.match_reveal_level(target_match_id uuid)
returns int
language sql
stable
security definer
set search_path = public
as $$
  select case
    when not exists (
      select 1 from matches m
      where m.id = target_match_id
        and (m.user_a = auth.uid() or m.user_b = auth.uid())
    ) then 0
    when (select count(*) from meet_intents i where i.match_id = target_match_id) >= 2 then 100
    when exists (
      select 1 from calls c
      where c.match_id = target_match_id
        and c.ended_at is not null
        and coalesce(c.duration_seconds, 0) >= 30
    ) then 75
    when (select count(distinct s.sender_id) from messages s where s.match_id = target_match_id) >= 2 then 50
    else 25
  end;
$$;

create or replace function public.photo_reveal_level_for_owner(owner_id text)
returns int
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(max(match_reveal_level(m.id)), 0)
  from matches m
  where (m.user_a = auth.uid() and m.user_b::text = owner_id)
     or (m.user_b = auth.uid() and m.user_a::text = owner_id);
$$;

create or replace function public.photo_variant_level(object_name text)
returns int
language sql
immutable
set search_path = public
as $$
  select (regexp_match(object_name, '/reveal-(25|50|75|100)\.jpg$'))[1]::int;
$$;

revoke execute on function public.match_reveal_level(uuid) from public, anon;
revoke execute on function public.photo_reveal_level_for_owner(text) from public, anon;
grant execute on function public.match_reveal_level(uuid) to authenticated;
grant execute on function public.photo_reveal_level_for_owner(text) to authenticated;
grant execute on function public.photo_variant_level(text) to authenticated;

drop policy if exists "Profile photos are readable by signed-in members" on storage.objects;

create policy "Profile photos are readable by signed-in members"
  on storage.objects for select
  using (
    bucket_id = 'profile-photos'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or (
        public.photo_variant_level(name) is not null
        and public.photo_variant_level(name) <= public.photo_reveal_level_for_owner((storage.foldername(name))[1])
      )
    )
  );

-- Controle
select
  (select count(*) from pg_policies where schemaname = 'storage' and tablename = 'objects'
     and policyname = 'Profile photos are readable by signed-in members' and qual like '%photo_variant_level%') as foto_policy_per_niveau,
  (select count(*) from pg_trigger where tgname = 'guard_call_times') as bel_trigger,
  to_regclass('public.meet_intents') is not null as afspraakwens_tabel;
