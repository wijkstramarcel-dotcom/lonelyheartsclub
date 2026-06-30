# Private migration checklist

Goal: move Lonely Hearts Club away from any work-owned account and keep the public site stable.

## 1. Code

- Create or choose a private personal GitHub repository.
- Push this repo to the new remote.
- Do not commit `.env.local`, Supabase service keys, Twilio secrets, Vercel tokens, or exported user data.
- After the new repo works, disconnect the old repository from Vercel.

## 2. Hosting

- In Vercel, create/import the project from the private repository.
- Add these Production environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_PUBLIC_SITE_URL=https://www.lonelyheartsclub.nl`
  - `VITE_ADMIN_EMAILS=<private owner email>`
  - `VITE_ENABLE_VOICE_CALLS=false` until voice has been retested
- Deploy once on a preview URL before moving the domain.

## 3. Domain

- Keep `www.lonelyheartsclub.nl` live on the current deployment until the new deployment is verified.
- Move the domain in Vercel only after the preview build works.
- Confirm:
  - `https://www.lonelyheartsclub.nl/`
  - `https://www.lonelyheartsclub.nl/auth/callback`
  - `https://www.lonelyheartsclub.nl/sitemap.xml`

## 4. Supabase

- Prefer moving the project into a personal Supabase organization if possible.
- If recreating Supabase, export schema first and handle user/profile/waitlist data as personal data.
- Update Supabase Auth settings:
  - Site URL: `https://www.lonelyheartsclub.nl`
  - Redirect URL: `https://www.lonelyheartsclub.nl/auth/callback`
- Recreate Edge Function secrets for Twilio in the target Supabase project.

## 5. Twilio

- Keep Twilio under a personal/business account, not a work account.
- Rotate API keys if they were ever entered in a work browser, chat, or shared environment.
- Retest voice with two accounts before setting `VITE_ENABLE_VOICE_CALLS=true`.

## 6. Email

- Use domain addresses, not personal/work addresses, on the public site:
  - `hello@lonelyheartsclub.nl`
  - `privacy@lonelyheartsclub.nl`
  - `support@lonelyheartsclub.nl` when real users need support

## 7. After migration

- Rotate Supabase anon/publishable key if the old setup was shared broadly.
- Rotate Twilio API key and secret.
- Remove old Vercel env vars from any work-owned project.
- Archive or delete old deployment only after the new domain and auth callback work.
