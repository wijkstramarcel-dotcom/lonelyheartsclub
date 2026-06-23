-- Lonely Hearts Club - grant profile creation access for known owner/test accounts.
-- Safe to run multiple times in the Supabase SQL Editor.

insert into waitlist (email, privacy_consent_at, consent_version)
values
  ('marcel.wijkstra@oracle.com', now(), 'owner-access'),
  ('wijkstramarcel@hotmail.com', now(), 'owner-access')
on conflict (email) do nothing;

insert into app_admins (user_id)
select id
from auth.users
where lower(email) in (
  lower('marcel.wijkstra@oracle.com'),
  lower('wijkstramarcel@hotmail.com')
)
on conflict (user_id) do nothing;

select
  u.email,
  p.id is not null as has_profile,
  a.user_id is not null as is_admin,
  w.email is not null as is_waitlisted
from auth.users u
left join profiles p on p.id = u.id
left join app_admins a on a.user_id = u.id
left join waitlist w on lower(w.email) = lower(u.email)
where lower(u.email) in (
  lower('marcel.wijkstra@oracle.com'),
  lower('wijkstramarcel@hotmail.com')
)
order by u.email;
