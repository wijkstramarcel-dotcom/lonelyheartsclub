-- Lonely Hearts Club live setup
-- Run this after schema.sql in the Supabase SQL Editor.
-- Safe to run multiple times.

-- Required Supabase Auth settings outside SQL:
-- Authentication > URL Configuration > Site URL:
-- https://www.lonelyheartsclub.nl
--
-- Authentication > URL Configuration > Redirect URLs:
-- https://www.lonelyheartsclub.nl/auth/callback

insert into app_admins (user_id)
select id
from auth.users
where lower(email) in (
  lower('marcel.wijkstra@oracle.com'),
  lower('wijkstramarcel@hotmail.com')
)
on conflict (user_id) do nothing;

select admin_create_invite_code(
  raw_code := 'LHC-EERSTE-RONDE-001',
  label := 'Eerste ledenronde',
  max_uses := 25,
  reserved_email := null,
  expires_at := now() + interval '30 days'
);

select
  (select count(*) from app_admins) as admins,
  (select count(*) from waitlist) as waitlist,
  (select count(*) from auth.users) as auth_users,
  (select count(*) from profiles) as profiles,
  (select count(*) from invite_codes where disabled_at is null and (expires_at is null or expires_at > now()) and used_count < max_uses) as active_invite_codes;
