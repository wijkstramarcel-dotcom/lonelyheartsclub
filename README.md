# Lonely Hearts Club

React/Vite dating-app prototype met Supabase-ready auth, profielen, matches,
berichten en Twilio-ready anoniem bellen.

## Status

- Zonder `.env.local` draait de app in demo-modus met lokale voorbeelddata.
- Met Supabase keys gebruikt de app live auth, database en realtime berichten.
- Met gedeployde Supabase Edge Functions en Twilio secrets start de bel-flow via Twilio Voice.
- SEO/social basis staat klaar: metadata, canonical URL, JSON-LD, sitemap, robots, manifest en share image.
- Vercel en Netlify hebben rewrites, cache headers en privacy/security headers.

## Lokaal starten

```bash
npm install
npm run dev
```

## Supabase koppelen

1. Kopieer `.env.example` naar `.env.local`.
2. Vul `VITE_SUPABASE_URL` en `VITE_SUPABASE_ANON_KEY`.
3. Run `schema.sql` in de Supabase SQL Editor.
4. Deploy de Edge Functions:

```bash
supabase link --project-ref <project-ref>
supabase secrets set TWILIO_ACCOUNT_SID=AC... TWILIO_API_KEY=SK... TWILIO_API_SECRET=... TWILIO_TWIML_APP_SID=AP...
supabase functions deploy twilio-token
supabase functions deploy twilio-voice
```

## Twilio instellen

Maak in Twilio een TwiML App en zet de Voice Request URL op:

```text
https://<project-ref>.supabase.co/functions/v1/twilio-voice
```

Gebruik de TwiML App SID als `TWILIO_TWIML_APP_SID`.

## Deploy

Vercel en Netlify config staan klaar.

```bash
npm run build
```

Publiceer daarna de `dist/` output via Vercel, Netlify of een andere static host.

## Vindbaarheid

Deze bestanden worden meegebouwd naar `dist/`:

- `robots.txt`
- `sitemap.xml`
- `site.webmanifest`
- `og-image.svg`
- `lhc-seal.svg`
- `humans.txt`

Na publicatie:

1. Zet `https://lonelyheartsclub.nl/` live op je host.
2. Controleer dat `https://lonelyheartsclub.nl/sitemap.xml` bereikbaar is.
3. Voeg het domein toe in Google Search Console.
4. Dien de sitemap in.
5. Gebruik dezelfde URL als canonical in eventuele social profielen.
