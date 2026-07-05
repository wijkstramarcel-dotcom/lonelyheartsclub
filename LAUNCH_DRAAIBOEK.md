# Launch-draaiboek Lonely Hearts Club

## 1. Zelf de registratie testen (± 5 min, met je eigen inbox)

Gebruik een tweede e-mailadres (niet je hotmail-admin-adres), bijv. een Gmail.

1. Ga naar https://www.lonelyheartsclub.nl → **Inloggen** → kies **Uitnodiging**
2. Vul in: je test-e-mailadres, een wachtwoord, en code `LHC-EERSTE-RONDE-001`
3. Verstuur → open de bevestigingsmail in je inbox → klik de link
4. Terug op de site: maak je profiel aan (de uitnodiging wordt daarbij geactiveerd)
5. Check daarna als admin op `/?admin=1` of de teller `active_invite_codes` het gebruik toont

**Let op:** Supabase's standaard mailserver mag maar ±2 mails per uur versturen.
Voor echte leden is een eigen SMTP (bijv. Resend, gratis tot 3.000 mails/maand)
sterk aan te raden: Supabase Dashboard → Authentication → SMTP Settings.

## 2. Mail voor de 2 wachtlijst-leden

Onderwerp: **Je bent als eerste welkom bij Lonely Hearts Club**

> Hoi,
>
> Een tijdje terug schreef je je in voor de wachtlijst van Lonely Hearts Club —
> daten zonder swipe-ruis, waarbij je eerst iemands verhaal ontdekt en pas
> daarna chat, anoniem belt en eventueel afspreekt.
>
> We openen nu de deuren voor een kleine eerste groep, en jij hoort daarbij.
>
> Zo doe je mee:
> 1. Ga naar https://www.lonelyheartsclub.nl en klik op **Inloggen**
> 2. Kies **Uitnodiging** en gebruik deze code: **LHC-EERSTE-RONDE-001**
> 3. Maak je profiel: geen perfecte foto's nodig, wél je echte verhaal
>
> We starten bewust klein, zodat elke match aandacht krijgt. Ken je iemand
> voor wie dit beter voelt dan swipen? De code is een aantal keer bruikbaar —
> deel hem gerust met één iemand die je het gunt.
>
> Veel plezier — en mail gerust terug als iets niet lekker werkt.
>
> Marcel
> Lonely Hearts Club

(Wachtlijst-adressen vind je in Supabase → Table Editor → `waitlist`.)

## 3. Twilio-beltest (pas daarna voice aanzetten)

Nodig: twee ingelogde accounts met een wederzijdse match, twee apparaten (of
twee browsers), microfoontoegang.

1. Zet in Vercel de env var `VITE_ENABLE_VOICE_CALLS=true` **alleen op Preview**
   (niet Production) en deploy een preview-branch
2. Log op apparaat A en B in met twee gematchte accounts
3. Start vanuit de chat het belmoment op A → neem op op B
4. Controleer: geluid twee kanten op, ophangen werkt, geen echte nummers zichtbaar
5. Werkt alles → zet `VITE_ENABLE_VOICE_CALLS=true` op Production

Tot die test geslaagd is: voice uit laten (nu correct uit).

## 4. Volgorde van lanceren

1. [ ] Testaccounts opschonen (`LAUNCH_CLEANUP.sql`, stap 1 eerst reviewen!)
2. [ ] Eigen SMTP instellen (Resend) — anders lopen bevestigingsmails vast op 2/uur
3. [ ] Registratie zelf testen (punt 1 hierboven)
4. [ ] Mail naar de wachtlijst (punt 2)
5. [ ] Twilio-beltest zodra er 2 echte accounts zijn (punt 3)

## 5. E-mailnotificaties activeren (match + bericht)

Zonder notificaties komt niemand terug: een lid dat offline is hoort nooit
van een nieuwe match. Dit systeem staat klaar en activeer je zo:

1. Maak een gratis account op https://resend.com (3.000 mails/maand gratis)
   en verifieer daar het domein lonelyheartsclub.nl → kopieer de API key
2. Installeer de Supabase CLI (of gebruik het dashboard) en deploy:
   ```
   supabase functions deploy notify-activity --no-verify-jwt
   supabase secrets set RESEND_API_KEY=re_...
   supabase secrets set NOTIFY_WEBHOOK_SECRET=<verzin een lang geheim>
   supabase secrets set MAIL_FROM="Lonely Hearts Club <hello@lonelyheartsclub.nl>"
   ```
3. Open `NOTIFICATIONS.sql`, vervang `<JOUW-GEHEIM>` door hetzelfde geheim,
   en draai het in de Supabase SQL Editor

Wat leden dan krijgen:
- **Nieuwe match** → beide leden direct een mail (zonder foto — bewust:
  Hinge mat dat mails zónder foto veel beter converteren, en het past bij ons merk)
- **Nieuw bericht** → mail naar de ontvanger, gedempt tot max 1 per gesprek
  per 30 minuten, zonder de berichtinhoud (privacy)

## 6. Security-hardening (draaien vóór launch!)

Draai `SECURITY_HARDENING.sql` in de SQL Editor. Dit dicht twee gaten:
- Profielfoto's waren voor elk ingelogd lid direct downloadbaar;
  nu alleen voor jezelf en je matches
- Profiel aanmaken kon zonder geldige uitnodigingscode; nu verplicht
