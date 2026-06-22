-- Lonely Hearts Club - server-side chat safety guard.
-- Safe to run multiple times in the Supabase SQL Editor.

create or replace function public.lhc_chat_safety_violation(message text)
returns text
language plpgsql
immutable
as $$
declare
  raw_message text := coalesce(message, '');
  clean_message text := btrim(raw_message);
  normalized_message text := lower(regexp_replace(raw_message, '[^[:alnum:]@.:/+_-]+', ' ', 'g'));
  compact_digits text := regexp_replace(raw_message, '[^0-9]', '', 'g');
begin
  if clean_message = '' then
    return 'Bericht is leeg.';
  end if;

  if char_length(clean_message) > 1000 then
    return 'Bericht is te lang.';
  end if;

  if
    raw_message ~* '(^|[^0-9])((\+31|0031|0)[[:space:].()/-]*6([[:space:].()/-]*[0-9]){8})([^0-9]|$)'
    or normalized_message ~* '(^|[[:space:]])(nul|zero)[[:space:]]+zes($|[[:space:]])'
    or (
      char_length(compact_digits) between 10 and 14
      and compact_digits ~ '^(0031|31|0)?6[0-9]{8,}$'
    )
  then
    return 'Telefoonnummers mogen nog niet gedeeld worden. Gebruik eerst de chat en het anonieme belmoment.';
  end if;

  if raw_message ~* '[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}' then
    return 'E-mailadressen mogen nog niet gedeeld worden.';
  end if;

  if normalized_message ~* '(https?://|www\.|(^|[^a-z0-9-])[a-z0-9-]+\.(nl|com|be|de|org|net|io)([^a-z]|$))' then
    return 'Links mogen nog niet gedeeld worden.';
  end if;

  if
    normalized_message ~* '(^|[[:space:]])@[a-z0-9._-]{3,}'
    or normalized_message ~* '(^|[[:space:]])(instagram|insta|snapchat|snap|tiktok|facebook|whatsapp|telegram|signal)($|[[:space:]])'
  then
    return 'Social handles en externe chatapps mogen nog niet gedeeld worden.';
  end if;

  if normalized_message ~* '(stuur|send|deel|drop).{0,24}(foto|pic|plaatje|selfie|naakt)' then
    return 'Fotoverzoeken worden in deze fase tegengehouden.';
  end if;

  if
    normalized_message ~* '(^|[[:space:]])(hoer|slet|mongool|idioot|verkracht)($|[[:space:]])'
    or normalized_message ~* '(kill yourself|ik maak je af|ik weet je te vinden|ga dood|stuur naakt|naaktfoto|neuk je)'
  then
    return 'Dit bericht klinkt onveilig of respectloos.';
  end if;

  return null;
end;
$$;

create or replace function public.lhc_enforce_message_safety()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  violation text;
begin
  new.content := btrim(coalesce(new.content, ''));
  violation := public.lhc_chat_safety_violation(new.content);

  if violation is not null then
    raise exception using
      errcode = '23514',
      message = 'Bericht tegengehouden',
      detail = violation,
      hint = 'Gebruik de chat eerst zonder contactgegevens. Deel privegegevens pas buiten de app als beide mensen daar bewust voor kiezen.';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_message_safety on public.messages;
create trigger enforce_message_safety
  before insert or update of content on public.messages
  for each row execute function public.lhc_enforce_message_safety();

select
  public.lhc_chat_safety_violation('Hoi, leuk profiel. Zullen we eerst even chatten?') is null as normal_message_allowed,
  public.lhc_chat_safety_violation('Bel mij op 0612345678') is not null as phone_blocked,
  public.lhc_chat_safety_violation('Mail mij op test@example.com') is not null as email_blocked,
  public.lhc_chat_safety_violation('Stuur een foto') is not null as photo_request_blocked;
