# Go-live: wat er nú nog moet gebeuren

De code is af en getest: de app bouwt zonder fouten, de landingspagina, wachtlijst
(met privacy-check), demo-route (match → chat → bellen → afspraak) en het
inlogscherm werken allemaal zonder console-errors. Alles hieronder is
dashboard-werk dat alleen de beheerder kan doen. Totaal: ± 45 minuten.

Volgorde aanhouden; elke stap verwijst naar het bestaande detail-document.

## Stap 1 — Supabase controleren (± 10 min)

Open de Supabase SQL Editor en controleer/draai in deze volgorde:

1. `schema.sql` — alleen als het project nieuw of gereset is.
2. `CHAT_SAFETY.sql` — server-side chatblokkade.
3. `PROFILE_PHOTOS.sql` — private fotobucket.
4. `SECURITY_HARDENING.sql` — **verplicht vóór launch**: dicht het fotolek en
   maakt een geldige uitnodigingscode verplicht bij profiel-aanmaak.
5. `LIVE_SETUP.sql` — adminrechten + eerste invitecode + controle.
6. `LAUNCH_CLEANUP.sql` — testaccounts opruimen (stap 1 in dat bestand eerst
   reviewen voordat je hem draait).

Controleer daarna in Supabase → Authentication → URL Configuration:

- Site URL: `https://www.lonelyheartsclub.nl`
- Redirect URL: `https://www.lonelyheartsclub.nl/auth/callback`

## Stap 2 — Eigen SMTP via Resend (± 15 min)

Zonder eigen SMTP verstuurt Supabase maar ±2 mails per uur — dan lopen
bevestigingsmails direct vast bij de eerste leden.

1. Account op https://resend.com (gratis tot 3.000 mails/maand).
2. Domein `lonelyheartsclub.nl` verifiëren (SPF/DKIM-records bij je DNS).
3. Supabase → Authentication → SMTP Settings → Resend-gegevens invullen.

## Stap 3 — Vercel Production env vars controleren (± 5 min)

In Vercel → Project → Settings → Environment Variables (Production):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_PUBLIC_SITE_URL=https://www.lonelyheartsclub.nl`
- `VITE_ADMIN_EMAILS` (jouw adminadres)
- `VITE_ENABLE_VOICE_CALLS` — pas `true` na de beltest uit stap 6

Na wijzigingen: redeploy.

## Stap 4 — Zelf de registratie testen (± 5 min)

Volg punt 1 van `LAUNCH_DRAAIBOEK.md`: registreer met een tweede e-mailadres
en code `LHC-EERSTE-RONDE-001`, bevestig de mail, maak een profiel en check
als admin op `/?admin=1` of de invite-teller meetelt.

## Stap 5 — E-mailnotificaties activeren (± 10 min)

Volg punt 5 van `LAUNCH_DRAAIBOEK.md`: `notify-activity` function deployen,
Resend/webhook-secrets zetten en `NOTIFICATIONS.sql` draaien. Zonder dit hoort
een offline lid nooit van een nieuwe match.

## Stap 6 — Beltest met twee accounts, dan voice aan

Volg punt 3 van `LAUNCH_DRAAIBOEK.md` en `TWILIO_LAUNCH.md`. Pas als geluid
twee kanten op werkt: `VITE_ENABLE_VOICE_CALLS=true` op Production.

## Stap 7 — Uitnodigen

Mail de wachtlijst met de tekst uit punt 2 van `LAUNCH_DRAAIBOEK.md`.
Loop als laatste check sectie 7 (go/no-go) van `LAUNCH_CHECKLIST.md` na.

---

Laatst geverifieerd op 2026-09-02: productie-build slaagt, demo-flows en
formuliervalidatie getest in Chromium zonder console-errors.
