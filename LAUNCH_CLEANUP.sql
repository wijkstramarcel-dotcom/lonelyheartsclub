-- Lonely Hearts Club — testaccounts opschonen vóór launch
-- Draai dit in de Supabase SQL Editor, in twee stappen.

-- ─────────────────────────────────────────────────────────────
-- STAP 1: BEKIJK EERST WIE ER IN DE DATABASE STAAN
-- Draai alleen dit blok en controleer welke accounts echt zijn.
-- ─────────────────────────────────────────────────────────────

select
  u.id,
  u.email,
  u.created_at::date as aangemaakt,
  u.last_sign_in_at::date as laatst_ingelogd,
  p.naam as profiel_naam,
  (a.user_id is not null) as is_admin,
  (select count(*) from messages m where m.sender_id = u.id) as berichten,
  (select count(*) from matches mt where mt.user_a = u.id or mt.user_b = u.id) as matches
from auth.users u
left join profiles p on p.id = u.id
left join app_admins a on a.user_id = u.id
order by u.created_at;

-- ─────────────────────────────────────────────────────────────
-- STAP 2: VERWIJDER DE TESTACCOUNTS
-- Vul hieronder de e-mailadressen in die je wilt BEWAREN.
-- Alles wat NIET in de lijst staat wordt verwijderd, inclusief
-- profiel, matches, berichten, interesses en rapportages (cascade).
-- Draai dit blok pas nadat je stap 1 hebt gecontroleerd!
-- ─────────────────────────────────────────────────────────────

-- delete from auth.users
-- where lower(email) not in (
--   lower('wijkstramarcel@hotmail.com')
--   -- , lower('ander-echt-lid@voorbeeld.nl')
-- );

-- ─────────────────────────────────────────────────────────────
-- STAP 3 (optioneel): verwijder achtergebleven profielfoto's
-- van verwijderde gebruikers uit de storage bucket.
-- ─────────────────────────────────────────────────────────────

-- delete from storage.objects
-- where bucket_id = 'profile-photos'
--   and (string_to_array(name, '/'))[1] not in (
--     select id::text from auth.users
--   );

-- ─────────────────────────────────────────────────────────────
-- CONTROLE: draai dit na stap 2 om het resultaat te zien
-- ─────────────────────────────────────────────────────────────

select
  (select count(*) from auth.users) as auth_users,
  (select count(*) from profiles) as profiles,
  (select count(*) from matches) as matches,
  (select count(*) from messages) as messages,
  (select count(*) from app_admins) as admins;
