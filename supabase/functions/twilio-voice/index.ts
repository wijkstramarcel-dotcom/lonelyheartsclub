// Supabase Edge Function: TwiML webhook — routeert anonieme gesprekken
// Twilio belt deze URL als iemand een gesprek start
// Stel in bij Twilio Console → Voice → TwiML Apps → jouw app → Voice URL
// Deploy: supabase functions deploy twilio-voice

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const body = await req.formData();
  const to = escapeXml(body.get("To")?.toString() ?? "");    // het user_id van de ontvanger
  const from = escapeXml(body.get("From")?.toString() ?? ""); // Twilio identity van de beller

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
