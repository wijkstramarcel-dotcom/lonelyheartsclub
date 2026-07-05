-- Lonely Hearts Club — e-mailnotificaties bij nieuwe match en nieuw bericht
-- Vereist dat de Edge Function `notify-activity` is gedeployed (zie
-- supabase/functions/notify-activity/index.ts) en de secrets zijn gezet.
--
-- VERVANG HIERONDER EERST:
--   <JOUW-GEHEIM>  → dezelfde waarde als secret NOTIFY_WEBHOOK_SECRET
--
-- Veilig om meerdere keren te draaien.

create extension if not exists pg_net with schema extensions;

create or replace function public.lhc_notify_activity()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  perform net.http_post(
    url := 'https://kdkccffbvdrgqnvfkcqd.supabase.co/functions/v1/notify-activity',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-notify-secret', '<JOUW-GEHEIM>'
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', TG_TABLE_NAME,
      'record', to_jsonb(new)
    ),
    timeout_milliseconds := 5000
  );
  return new;
end;
$$;

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
