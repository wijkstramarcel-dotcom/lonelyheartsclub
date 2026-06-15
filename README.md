# Lonely Hearts Club

React/Vite datingapp-prototype met Supabase-ready auth, profielen, matches,
berichten en Twilio-ready anoniem bellen.

## Status

- Zonder `.env.local` draait de app in demo-modus met lokale voorbeelddata.
- Met Supabase keys gebruikt de app live auth, database en realtime berichten.
- Met gedeployde Supabase Edge Functions, Twilio secrets en `VITE_ENABLE_VOICE_CALLS=true` start de bel-flow via Twilio Voice.
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
3. Zet `VITE_PUBLIC_SITE_URL=https://www.lonelyheartsclub.nl`, zodat Supabase mails altijd naar de live site terugkeren.
4. Zet `VITE_ADMIN_EMAILS` op de e-mailadressen die de Live status-tab mogen zien.
5. Laat `VITE_ENABLE_VOICE_CALLS=false` totdat Twilio volledig getest is.
6. Zet in Supabase Auth > URL Configuration:

```text
Site URL: https://www.lonelyheartsclub.nl
Redirect URLs: https://www.lonelyheartsclub.nl/auth/callback
```

7. Run `schema.sql` in de Supabase SQL Editor.
8. Run daarna `LIVE_SETUP.sql` voor adminrechten, eerste invitecode en een korte controle.
9. Of voeg minimaal één adminaccount handmatig toe:

```sql
insert into app_admins (user_id)
select id
from auth.users
where lower(email) in (
  lower('marcel.wijkstra@oracle.com'),
  lower('wijkstramarcel@hotmail.com')
)
on conflict (user_id) do nothing;
```

10. Deploy de Edge Functions:

```bash
supabase link --project-ref <project-ref>
supabase secrets set TWILIO_ACCOUNT_SID=AC... TWILIO_API_KEY=SK... TWILIO_API_SECRET=... TWILIO_TWIML_APP_SID=AP...
supabase functions deploy twilio-token
supabase functions deploy twilio-voice
```

## Uitnodigingen

Nieuwe accounts kunnen pas een profiel maken nadat een uitnodigingscode is verzilverd. Codes worden
alleen gehasht opgeslagen in Supabase. Maak codes aan via de SQL Editor:

```sql
select admin_create_invite_code(
  raw_code := 'LHC-EERSTE-RONDE-001',
  label := 'Eerste ledenronde',
  max_uses := 1,
  reserved_email := null,
  expires_at := now() + interval '30 days'
);
```

Gebruik `reserved_email` als een code maar voor één specifiek e-mailadres mag werken. Deel de ruwe
code alleen met de persoon die je wilt toelaten.

## Twilio instellen

Maak in Twilio een TwiML App en zet de Voice Request URL op:

```text
https://<project-ref>.supabase.co/functions/v1/twilio-voice
```

Gebruik de TwiML App SID als `TWILIO_TWIML_APP_SID`.

## Anoniem bellen live zetten

De app houdt echte gesprekken standaard dicht. Demo-calls blijven werken, maar live gebruikers zien
`Belprovider nog niet actief` totdat je de voice launch bewust aanzet.

Checklist:

1. Maak of controleer een Twilio TwiML App.
2. Zet de TwiML App Voice Request URL op:

```text
https://<project-ref>.supabase.co/functions/v1/twilio-voice
```

3. Zet de Twilio secrets alleen in Supabase:

```bash
supabase secrets set TWILIO_ACCOUNT_SID=AC... TWILIO_API_KEY=SK... TWILIO_API_SECRET=... TWILIO_TWIML_APP_SID=AP...
```

4. Deploy beide functions opnieuw:

```bash
supabase functions deploy twilio-token
supabase functions deploy twilio-voice
```

5. Log in met twee testaccounts in twee browsers of apparaten.
6. Maak twee profielen die wederzijds bij elkaar passen.
7. Maak een match, stuur eerst een chatbericht en start daarna het anonieme belmoment.
8. Controleer dat de browser om microfoontoegang vraagt en dat beide kanten audio hebben.
9. Controleer dat telefoonnummers nergens zichtbaar zijn.
10. Zet pas daarna in Vercel `VITE_ENABLE_VOICE_CALLS=true` voor Production en redeploy.

Niet doen:

- Twilio secrets in `.env.local`, Vercel of frontend JavaScript zetten.
- `VITE_ENABLE_VOICE_CALLS=true` zetten voordat de test met twee accounts werkt.
- Gesprekken opnemen zonder aparte juridische basis en expliciete communicatie naar gebruikers.

Relevante docs:

- Twilio Voice JavaScript SDK: https://www.twilio.com/docs/voice/sdks/javascript
- Twilio `<Client>` TwiML: https://www.twilio.com/docs/voice/twiml/client

## Conversiemeting

De site gebruikt geen externe analytics en plaatst geen trackingcookies. Conversies worden als losse
events in Supabase opgeslagen in `analytics_events`.

Vastgelegde events:

- `landing_view`: openbare landingspagina geopend.
- `waitlist_cta_click`: klik op een wachtlijstknop.
- `waitlist_view`: wachtlijstsectie in beeld.
- `waitlist_submit`: wachtlijstformulier succesvol opgeslagen.
- `demo_open`: demo geopend.
- `account_start`: accountformulier geopend vanuit de wachtlijst.

We slaan hierbij geen e-mailadres, profieldata, cookie-ID of volledige referrer op. Voor een snelle
dagrapportage in de Supabase SQL Editor:

```sql
select
  date_trunc('day', created_at) as day,
  event_name,
  count(*) as events
from analytics_events
group by 1, 2
order by 1 desc, 2;
```

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
