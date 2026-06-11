-- Lonely Hearts Club · Supabase repair/install schema
-- Safe to run multiple times. Designed for fresh and partially-created projects.

create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade
);

alter table profiles add column if not exists naam text;
alter table profiles add column if not exists voornaam text;
alter table profiles add column if not exists leeftijd int;
alter table profiles add column if not exists geslacht text;
alter table profiles add column if not exists zoekt text;
alter table profiles add column if not exists verhaal text;
alter table profiles add column if not exists passies text[] default '{}';
alter table profiles add column if not exists tags text[] default '{}';
alter table profiles add column if not exists foto_url text;
alter table profiles add column if not exists actief boolean default true;
alter table profiles add column if not exists privacy_consent_at timestamptz;
alter table profiles add column if not exists privacy_consent_version text;
alter table profiles add column if not exists sensitive_data_consent_at timestamptz;
alter table profiles add column if not exists consent_version text;
alter table profiles add column if not exists created_at timestamptz default now();
alter table profiles add column if not exists updated_at timestamptz default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'passies'
      and data_type <> 'ARRAY'
  ) then
    alter table profiles
      alter column passies type text[]
      using case
        when passies is null or trim(passies::text) = '' then '{}'::text[]
        else regexp_split_to_array(passies::text, '\s*,\s*')
      end;
  end if;
end;
$$;

create table if not exists waitlist (
  email text primary key,
  created_at timestamptz default now()
);

alter table waitlist add column if not exists privacy_consent_at timestamptz;
alter table waitlist add column if not exists consent_version text;

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid()
);

alter table analytics_events add column if not exists event_name text;
alter table analytics_events add column if not exists page_path text;
alter table analytics_events add column if not exists referrer_host text;
alter table analytics_events add column if not exists metadata jsonb default '{}'::jsonb;
alter table analytics_events add column if not exists created_at timestamptz default now();

create table if not exists interests (
  id uuid primary key default gen_random_uuid()
);

alter table interests add column if not exists from_user uuid references profiles(id) on delete cascade;
alter table interests add column if not exists to_user uuid references profiles(id) on delete cascade;
alter table interests add column if not exists created_at timestamptz default now();

create table if not exists matches (
  id uuid primary key default gen_random_uuid()
);

alter table matches add column if not exists user_a uuid references profiles(id) on delete cascade;
alter table matches add column if not exists user_b uuid references profiles(id) on delete cascade;
alter table matches add column if not exists created_at timestamptz default now();

create table if not exists calls (
  id uuid primary key default gen_random_uuid()
);

alter table calls add column if not exists match_id uuid references matches(id) on delete cascade;
alter table calls add column if not exists caller_id uuid references profiles(id) on delete cascade;
alter table calls add column if not exists started_at timestamptz default now();
alter table calls add column if not exists ended_at timestamptz;
alter table calls add column if not exists duration_seconds int;

create table if not exists messages (
  id uuid primary key default gen_random_uuid()
);

alter table messages add column if not exists match_id uuid references matches(id) on delete cascade;
alter table messages add column if not exists sender_id uuid references profiles(id) on delete cascade;
alter table messages add column if not exists content text;
alter table messages add column if not exists created_at timestamptz default now();

create table if not exists blocks (
  id uuid primary key default gen_random_uuid()
);

alter table blocks add column if not exists blocker_id uuid references profiles(id) on delete cascade;
alter table blocks add column if not exists blocked_id uuid references profiles(id) on delete cascade;
alter table blocks add column if not exists created_at timestamptz default now();

create table if not exists reports (
  id uuid primary key default gen_random_uuid()
);

alter table reports add column if not exists reporter_id uuid references profiles(id) on delete cascade;
alter table reports add column if not exists reported_id uuid references profiles(id) on delete cascade;
alter table reports add column if not exists reason text;
alter table reports add column if not exists details text;
alter table reports add column if not exists status text default 'open';
alter table reports add column if not exists created_at timestamptz default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_leeftijd_check'
  ) then
    alter table profiles add constraint profiles_leeftijd_check
      check (leeftijd is null or leeftijd between 18 and 120) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'interests_from_user_to_user_key'
  ) then
    alter table interests add constraint interests_from_user_to_user_key
      unique (from_user, to_user);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'interests_not_self_check'
  ) then
    alter table interests add constraint interests_not_self_check
      check (from_user is null or to_user is null or from_user <> to_user) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'matches_user_a_user_b_key'
  ) then
    alter table matches add constraint matches_user_a_user_b_key
      unique (user_a, user_b);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'matches_order_check'
  ) then
    alter table matches add constraint matches_order_check
      check (user_a is null or user_b is null or user_a < user_b) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'calls_duration_seconds_check'
  ) then
    alter table calls add constraint calls_duration_seconds_check
      check (duration_seconds is null or duration_seconds >= 0) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'messages_content_check'
  ) then
    alter table messages add constraint messages_content_check
      check (content is null or char_length(trim(content)) between 1 and 1000) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'analytics_events_event_name_check'
  ) then
    alter table analytics_events add constraint analytics_events_event_name_check
      check (
        event_name in (
          'landing_view',
          'waitlist_cta_click',
          'waitlist_view',
          'waitlist_submit',
          'demo_open',
          'account_start'
        )
      ) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'analytics_events_page_path_check'
  ) then
    alter table analytics_events add constraint analytics_events_page_path_check
      check (page_path is null or char_length(page_path) <= 180) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'analytics_events_referrer_host_check'
  ) then
    alter table analytics_events add constraint analytics_events_referrer_host_check
      check (referrer_host is null or char_length(referrer_host) <= 180) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'analytics_events_metadata_check'
  ) then
    alter table analytics_events add constraint analytics_events_metadata_check
      check (metadata is null or (jsonb_typeof(metadata) = 'object' and char_length(metadata::text) <= 1000)) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'blocks_blocker_id_blocked_id_key'
  ) then
    alter table blocks add constraint blocks_blocker_id_blocked_id_key
      unique (blocker_id, blocked_id);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'blocks_not_self_check'
  ) then
    alter table blocks add constraint blocks_not_self_check
      check (blocker_id is null or blocked_id is null or blocker_id <> blocked_id) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'reports_not_self_check'
  ) then
    alter table reports add constraint reports_not_self_check
      check (reporter_id is null or reported_id is null or reporter_id <> reported_id) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'reports_reporter_id_reported_id_key'
  ) then
    alter table reports add constraint reports_reporter_id_reported_id_key
      unique (reporter_id, reported_id);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'reports_reason_check'
  ) then
    alter table reports add constraint reports_reason_check
      check (reason is null or char_length(trim(reason)) between 2 and 80) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'reports_details_check'
  ) then
    alter table reports add constraint reports_details_check
      check (details is null or char_length(trim(details)) <= 1000) not valid;
  end if;
end;
$$;

create index if not exists interests_from_user_idx on interests(from_user);
create index if not exists interests_to_user_idx on interests(to_user);
create index if not exists analytics_events_event_created_idx on analytics_events(event_name, created_at desc);
create index if not exists matches_user_a_idx on matches(user_a);
create index if not exists matches_user_b_idx on matches(user_b);
create index if not exists messages_match_created_idx on messages(match_id, created_at);
create index if not exists calls_match_started_idx on calls(match_id, started_at desc);
create index if not exists blocks_blocker_idx on blocks(blocker_id);
create index if not exists blocks_blocked_idx on blocks(blocked_id);
create index if not exists reports_reporter_idx on reports(reporter_id);
create index if not exists reports_reported_status_idx on reports(reported_id, status);

create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on profiles;
create trigger profiles_touch_updated_at
  before update on profiles
  for each row execute function touch_updated_at();

create or replace function is_match_participant(target_match_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from matches m
    where m.id = target_match_id
      and (m.user_a = auth.uid() or m.user_b = auth.uid())
  );
$$;

create or replace function has_block_between(first_user uuid, second_user uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from blocks b
    where (b.blocker_id = first_user and b.blocked_id = second_user)
       or (b.blocker_id = second_user and b.blocked_id = first_user)
  );
$$;

create or replace function close_matches_on_block()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.blocker_id is null or new.blocked_id is null then
    return new;
  end if;

  delete from matches
  where user_a = least(new.blocker_id, new.blocked_id)
    and user_b = greatest(new.blocker_id, new.blocked_id);

  return new;
end;
$$;

create or replace function create_match_on_mutual_interest()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.from_user is null or new.to_user is null then
    return new;
  end if;

  if exists (
    select 1 from interests
    where from_user = new.to_user
      and to_user = new.from_user
  ) and not has_block_between(new.from_user, new.to_user) then
    insert into matches (user_a, user_b)
    values (least(new.from_user, new.to_user), greatest(new.from_user, new.to_user))
    on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_interest_inserted on interests;
create trigger on_interest_inserted
  after insert on interests
  for each row execute function create_match_on_mutual_interest();

drop trigger if exists on_block_inserted on blocks;
create trigger on_block_inserted
  after insert on blocks
  for each row execute function close_matches_on_block();

alter table profiles enable row level security;
alter table waitlist enable row level security;
alter table analytics_events enable row level security;
alter table interests enable row level security;
alter table matches enable row level security;
alter table calls enable row level security;
alter table messages enable row level security;
alter table blocks enable row level security;
alter table reports enable row level security;

do $$
declare
  policy_record record;
begin
  for policy_record in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('profiles', 'analytics_events', 'interests', 'matches', 'calls', 'messages', 'blocks', 'reports')
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      policy_record.policyname,
      policy_record.schemaname,
      policy_record.tablename
    );
  end loop;
end;
$$;

drop policy if exists "Profielen zijn leesbaar" on profiles;
drop policy if exists "Profielen lezen" on profiles;
drop policy if exists "Alleen eigenaar mag profiel aanpassen" on profiles;
drop policy if exists "Eigen profiel aanmaken" on profiles;
drop policy if exists "Eigen profiel bijwerken" on profiles;

create policy "Profielen lezen"
  on profiles for select using (auth.role() = 'authenticated');

create policy "Eigen profiel aanmaken"
  on profiles for insert with check (auth.uid() = id);

create policy "Eigen profiel bijwerken"
  on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Iedereen mag waitlist inschrijven" on waitlist;
drop policy if exists "Iedereen mag waitlist bijwerken" on waitlist;

create policy "Iedereen mag waitlist inschrijven"
  on waitlist for insert with check (true);

drop policy if exists "Conversie event toevoegen" on analytics_events;

create policy "Conversie event toevoegen"
  on analytics_events for insert with check (
    event_name in (
      'landing_view',
      'waitlist_cta_click',
      'waitlist_view',
      'waitlist_submit',
      'demo_open',
      'account_start'
    )
    and (metadata is null or (jsonb_typeof(metadata) = 'object' and char_length(metadata::text) <= 1000))
  );

drop policy if exists "Eigen interesses lezen" on interests;
drop policy if exists "Interesse toevoegen" on interests;

create policy "Eigen interesses lezen"
  on interests for select using (auth.uid() = from_user or auth.uid() = to_user);

create policy "Interesse toevoegen"
  on interests for insert with check (auth.uid() = from_user and from_user <> to_user);

drop policy if exists "Match deelnemers zien match" on matches;
drop policy if exists "Match deelnemers lezen" on matches;

create policy "Match deelnemers lezen"
  on matches for select using (auth.uid() = user_a or auth.uid() = user_b);

drop policy if exists "Match deelnemers zien gesprekken" on calls;
drop policy if exists "Beller kan gesprek aanmaken" on calls;
drop policy if exists "Beller kan gesprek afsluiten" on calls;

create policy "Match deelnemers zien gesprekken"
  on calls for select using (is_match_participant(match_id));

create policy "Beller kan gesprek aanmaken"
  on calls for insert with check (auth.uid() = caller_id and is_match_participant(match_id));

create policy "Beller kan gesprek afsluiten"
  on calls for update using (auth.uid() = caller_id and is_match_participant(match_id));

drop policy if exists "Match deelnemers lezen berichten" on messages;
drop policy if exists "Match deelnemers versturen berichten" on messages;

create policy "Match deelnemers lezen berichten"
  on messages for select using (is_match_participant(match_id));

create policy "Match deelnemers versturen berichten"
  on messages for insert with check (auth.uid() = sender_id and is_match_participant(match_id));

drop policy if exists "Eigen blokkades lezen" on blocks;
drop policy if exists "Blokkade toevoegen" on blocks;
drop policy if exists "Eigen blokkade verwijderen" on blocks;

create policy "Eigen blokkades lezen"
  on blocks for select using (auth.uid() = blocker_id);

create policy "Blokkade toevoegen"
  on blocks for insert with check (auth.uid() = blocker_id and blocker_id <> blocked_id);

create policy "Eigen blokkade verwijderen"
  on blocks for delete using (auth.uid() = blocker_id);

drop policy if exists "Eigen rapportages lezen" on reports;
drop policy if exists "Rapportage toevoegen" on reports;

create policy "Eigen rapportages lezen"
  on reports for select using (auth.uid() = reporter_id);

create policy "Rapportage toevoegen"
  on reports for insert with check (auth.uid() = reporter_id and reporter_id <> reported_id);

alter table messages replica identity full;
alter table matches replica identity full;

do $$
begin
  alter publication supabase_realtime add table messages;
exception
  when duplicate_object then null;
  when undefined_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table matches;
exception
  when duplicate_object then null;
  when undefined_object then null;
end;
$$;
