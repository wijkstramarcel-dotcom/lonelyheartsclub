-- Lonely Hearts Club — e-mailnotificaties bij nieuwe match en nieuw bericht
-- Vereist dat de Edge Function `notify-activity` is gedeployed (zie
-- supabase/functions/notify-activity/index.ts). Er hoeft hier niets
-- ingevuld te worden: er is geen gedeeld geheim meer.
--
-- Veilig om meerdere keren te draaien.

create extension if not exists pg_net with schema extensions;

-- Elke melding wordt hier één keer vastgelegd door de Edge Function
-- (service role). Geen policies: leden kunnen deze tabel niet lezen.
create table if not exists public.notification_log (
  kind text not null,
  record_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (kind, record_id)
);

alter table public.notification_log enable row level security;

create or replace function public.lhc_notify_activity()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  begin
    perform net.http_post(
      url := 'https://kdkccffbvdrgqnvfkcqd.supabase.co/functions/v1/notify-activity',
      headers := jsonb_build_object('Content-Type', 'application/json'),
      body := jsonb_build_object('table', TG_TABLE_NAME, 'id', new.id),
      timeout_milliseconds := 5000
    );
  exception when others then
    -- Een mislukte melding mag een match of bericht nooit tegenhouden.
    raise warning 'lhc_notify_activity: %', sqlerrm;
  end;
  return new;
end;
$$;

revoke execute on function public.lhc_notify_activity() from public, anon, authenticated;

drop trigger if exists notify_on_new_match on public.matches;
create trigger notify_on_new_match
  after insert on public.matches
  for each row execute function public.lhc_notify_activity();

drop trigger if exists notify_on_new_message on public.messages;
create trigger notify_on_new_message
  after insert on public.messages
  for each row execute function public.lhc_notify_activity();

-- Controle
select
  (select count(*) from pg_trigger where tgname = 'notify_on_new_match') as match_trigger,
  (select count(*) from pg_trigger where tgname = 'notify_on_new_message') as message_trigger;
