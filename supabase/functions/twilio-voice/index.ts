// Supabase Edge Function: TwiML webhook — routeert anonieme gesprekken
// Twilio belt deze URL als iemand een gesprek start
// Stel in bij Twilio Console → Voice → TwiML Apps → jouw app → Voice URL
// Deploy: supabase functions deploy twilio-voice
//
// Veiligheid: een gesprek wordt alleen doorverbonden als beller en ontvanger
// een actieve match hebben. Zonder deze check kon elk lid met een geldig
// Twilio-token elk ander lid bellen, ook zonder match of na een blokkade
// (een blokkade verwijdert de match).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function normalizeClientIdentity(value: FormDataEntryValue | null) {
  return value?.toString().trim().replace(/^client:/i, "") ?? "";
}

function reject(status = 200) {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Reject reason="rejected" /></Response>`,
    { status, headers: { "Content-Type": "text/xml" } },
  );
}

async function haveActiveMatch(firstUser: string, secondUser: string) {
  // matches slaat het paar gesorteerd op (least/greatest), maar we checken
  // beide richtingen zodat dit niet van die conventie afhangt.
  const { data, error } = await supabaseAdmin
    .from("matches")
    .select("id")
    .or(
      `and(user_a.eq.${firstUser},user_b.eq.${secondUser}),and(user_a.eq.${secondUser},user_b.eq.${firstUser})`,
    )
    .limit(1);
  if (error) {
    console.error("twilio-voice: match-check mislukt:", error.message);
    return false;
  }
  return (data?.length ?? 0) > 0;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let body: FormData;
  try {
    body = await req.formData();
  } catch {
    return reject(400);
  }

  const toIdentity = normalizeClientIdentity(body.get("To"));    // het user_id van de ontvanger
  const fromIdentity = normalizeClientIdentity(body.get("From")); // Twilio identity van de beller

  if (!UUID_PATTERN.test(toIdentity) || !UUID_PATTERN.test(fromIdentity) || toIdentity === fromIdentity) {
    return reject(400);
  }

  if (!(await haveActiveMatch(fromIdentity, toIdentity))) {
    console.warn("twilio-voice: gesprek geweigerd, geen match tussen beller en ontvanger");
    return reject();
  }

  const to = escapeXml(toIdentity);
  const from = escapeXml(fromIdentity);

  // Bouw TwiML om de ontvanger te bellen via hun Twilio identity (user_id)
  // Beide nummers blijven volledig verborgen — Twilio verbindt alleen de clients
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="client:${from}" timeout="30" record="do-not-record">
    <Client>
      <Identity>${to}</Identity>
      <Parameter name="match_context" value="lonely_hearts_club" />
    </Client>
  </Dial>
</Response>`;

  return new Response(twiml, {
    headers: { "Content-Type": "text/xml" },
  });
});
