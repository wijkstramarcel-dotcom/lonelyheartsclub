# Twilio launch plan

Deadline: vrijdag 19 juni 2026.

## Doel

Live anoniem bellen werkt alleen als deze hele keten groen is:

1. Twilio account is actief en geschikt voor productie.
2. TwiML App wijst naar de Supabase `twilio-voice` function.
3. Supabase Edge Functions zijn gedeployed.
4. Supabase secrets bevatten de Twilio credentials.
5. Twee ingelogde gebruikers kunnen elkaar bellen vanuit een bestaande match/chat.
6. Daarna pas staat `VITE_ENABLE_VOICE_CALLS=true` in Vercel Production.

## Twilio account

Maak of gebruik een Twilio account voor Lonely Hearts Club.

Nodig:

- Account SID: begint met `AC`.
- API Key SID: begint met `SK`.
- API Key Secret: wordt eenmalig getoond.
- TwiML App SID: begint met `AP`.

Gebruik liever geen trial-account voor de echte lancering. Upgrade het account en zet billing goed,
zodat gesprekken niet onverwacht stoppen door trialbeperkingen.

## TwiML App

Twilio Console:

1. Ga naar Voice > TwiML Apps.
2. Maak een app: `Lonely Hearts Club Voice`.
3. Zet Voice Request URL op:

```text
https://kdkccffbvdrgqnvfkcqd.supabase.co/functions/v1/twilio-voice
```

4. Method: `POST`.
5. Kopieer de TwiML App SID.

## Supabase functions deployen

Als de Supabase CLI is ingelogd:

```bash
/private/tmp/supabase-cli/supabase functions deploy twilio-token --project-ref kdkccffbvdrgqnvfkcqd
/private/tmp/supabase-cli/supabase functions deploy twilio-voice --project-ref kdkccffbvdrgqnvfkcqd
```

Controle:

```bash
curl -L -i -X POST \
  -F "To=client:test-recipient" \
  -F "From=client:test-caller" \
  https://kdkccffbvdrgqnvfkcqd.supabase.co/functions/v1/twilio-voice
```

Goed teken: geen `404 Requested function was not found`; de response bevat TwiML met `<Dial>`.

## Supabase secrets

Zet deze alleen in Supabase, nooit in Vercel of frontend code:

```bash
/private/tmp/supabase-cli/supabase secrets set \
  --project-ref kdkccffbvdrgqnvfkcqd \
  TWILIO_ACCOUNT_SID=AC... \
  TWILIO_API_KEY=SK... \
  TWILIO_API_SECRET=... \
  TWILIO_TWIML_APP_SID=AP...
```

Status 19 juni 2026: de oude API key stond in Ireland (`ie1`) terwijl de TwiML
App in US1 stond. Er is een nieuwe US1 Standard API key gemaakt, Supabase is
bijgewerkt en Twilio accepteert de key tegen de bestaande TwiML App.

## Live feature flag

Laat dit uit totdat Twilio API key, TwiML App en Supabase secrets groen zijn:

```text
VITE_ENABLE_VOICE_CALLS=false
```

Pas daarna in Vercel Production:

```text
VITE_ENABLE_VOICE_CALLS=true
```

Daarna redeployen.

## End-to-end test

Gebruik twee echte testaccounts in twee browsers of apparaten:

1. Beide accounts hebben een compleet profiel.
2. Beide profielen passen wederzijds bij geslacht/zoekvoorkeur.
3. Maak een match.
4. Stuur minimaal een chatbericht.
5. Start anoniem bellen vanuit Berichten.
6. De ontvanger ziet `Neem op` en `Weiger`.
7. Beide browsers vragen microfoontoegang.
8. Audio werkt twee kanten op.
9. Telefoonnummers zijn nergens zichtbaar.
10. Na ophangen kan `Afspraak voorstellen` gebruikt worden.

## Go/no-go

Go-live alleen als:

- `twilio-token` en `twilio-voice` geen 404 meer geven.
- `twilio-token` voor een ingelogde gebruiker een token kan maken.
- Twilio call logs tonen succesvolle client-to-client call.
- De UI toont inkomende oproep, actief gesprek, beëindigd gesprek en afspraakvoorstel correct.
- `VITE_ENABLE_VOICE_CALLS=true` staat pas aan na de test.
