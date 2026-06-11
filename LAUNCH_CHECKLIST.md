# Lonely Hearts Club launch checklist

Gebruik deze checklist voordat echte gebruikers worden uitgenodigd.

## 1. Basis live

- [ ] `https://www.lonelyheartsclub.nl/` opent zonder console-errors.
- [ ] `robots.txt` en `sitemap.xml` zijn bereikbaar.
- [ ] Google Search Console property is geverifieerd.
- [ ] Sitemap is ingediend.

## 2. Registratie en data

- [ ] Supabase project is actief, niet gepauzeerd.
- [ ] `schema.sql` is uitgevoerd zonder fouten.
- [ ] `VITE_SUPABASE_URL` staat in Vercel Production.
- [ ] `VITE_SUPABASE_ANON_KEY` staat in Vercel Production.
- [ ] Nieuw account kan worden aangemaakt.
- [ ] Bevestigingsmail komt aan.
- [ ] Bestaand account kan inloggen via inloglink.
- [ ] Bestaand account kan inloggen via wachtwoord.
- [ ] Wachtlijst-inschrijving wordt opgeslagen.

## 3. Profiel en matching

- [ ] Nieuw profiel opslaan werkt.
- [ ] Geslacht, zoekvoorkeur, verhaal en passies worden opgeslagen.
- [ ] Matchfilter toont alleen wederzijds passende profielen.
- [ ] Demo toont geen verkeerde geslachten bij `Ik zoek vrouwen` of `Ik zoek mannen`.
- [ ] Lege matchlijsten leggen duidelijk uit wat er gebeurt.

## 4. Chat

- [ ] Match opent het berichtenscherm.
- [ ] Bericht versturen werkt.
- [ ] Bericht verschijnt bij de juiste match.
- [ ] Tweede gebruiker ziet het bericht na refresh of realtime update.

## 5. Anoniem bellen

- [ ] `VITE_ENABLE_VOICE_CALLS=false` zolang Twilio niet klaar is.
- [ ] Twilio TwiML App bestaat.
- [ ] TwiML App Voice Request URL wijst naar `https://<project-ref>.supabase.co/functions/v1/twilio-voice`.
- [ ] Supabase secrets staan ingesteld: `TWILIO_ACCOUNT_SID`, `TWILIO_API_KEY`, `TWILIO_API_SECRET`, `TWILIO_TWIML_APP_SID`.
- [ ] `twilio-token` is gedeployd.
- [ ] `twilio-voice` is gedeployd.
- [ ] Test met twee echte accounts werkt in twee browsers/apparaten.
- [ ] Microfoontoestemming werkt.
- [ ] Audio werkt beide kanten op.
- [ ] Telefoonnummers worden nergens getoond.
- [ ] Pas daarna: `VITE_ENABLE_VOICE_CALLS=true` in Vercel Production en redeploy.

## 6. Privacy en vertrouwen

- [ ] Privacytekst klopt met wat de app werkelijk verwerkt.
- [ ] Geen analytics of marketingcookies zonder aparte toestemming.
- [ ] Privacy-contactadres werkt.
- [ ] Verwijderverzoek-proces is bekend.
- [ ] `blocks` en `reports` uit `schema.sql` zijn actief in Supabase.
- [ ] Rapportages worden handmatig opgevolgd en afgesloten.
- [ ] Demo/testaccounts zijn herkenbaar en niet verwarrend voor echte leden.

## 7. Go/no-go

- [ ] Een nieuwe bezoeker kan zich voorinschrijven.
- [ ] Een nieuwe gebruiker kan registreren, bevestigen en profiel maken.
- [ ] Een gebruiker ziet alleen passende profielen.
- [ ] Match, chat, belroute en afspraakroute zijn begrijpelijk.
- [ ] Er is een handmatig proces voor support en dataverwijdering.
- [ ] Pas daarna echte gebruikers uitnodigen.
