// Supabase Edge Function: genereert een Twilio Voice access token
// Deploy: supabase functions deploy twilio-token
// Secrets instellen:
//   supabase secrets set TWILIO_ACCOUNT_SID=AC...
//   supabase secrets set TWILIO_API_KEY=SK...
//   supabase secrets set TWILIO_API_SECRET=...
//   supabase secrets set TWILIO_TWIML_APP_SID=AP...

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const encoder = new TextEncoder();

function base64Url(input: string | Uint8Array) {
  const bytes = typeof input === "string" ? encoder.encode(input) : input;
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function signTwilioAccessToken({
  accountSid,
  apiKey,
  apiSecret,
  twimlAppSid,
  identity,
}: {
  accountSid: string;
  apiKey: string;
  apiSecret: string;
  twimlAppSid: string;
  identity: string;
}) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT", cty: "twilio-fpa;v=1" };
  const payload = {
    jti: `${apiKey}-${now}`,
    iss: apiKey,
    sub: accountSid,
    exp: now + 3600,
    grants: {
      identity,
      voice: {
        outgoing: { application_sid: twimlAppSid },
        incoming: { allow: true },
      },
    },
  };

  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(JSON.stringify(payload));
  const body = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(apiSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));

  return `${body}.${base64Url(new Uint8Array(signature))}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verifieer de ingelogde gebruiker via Supabase JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Geen autorisatie");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Niet ingelogd");

    // Twilio token aanmaken met gebruiker-id als identity
    const accountSid   = Deno.env.get("TWILIO_ACCOUNT_SID")!;
    const apiKey       = Deno.env.get("TWILIO_API_KEY")!;
    const apiSecret    = Deno.env.get("TWILIO_API_SECRET")!;
    const twimlAppSid  = Deno.env.get("TWILIO_TWIML_APP_SID")!;

    if (!accountSid || !apiKey || !apiSecret || !twimlAppSid) {
      throw new Error("Twilio secrets ontbreken");
    }

    const token = await signTwilioAccessToken({
      accountSid,
      apiKey,
      apiSecret,
      twimlAppSid,
      identity: user.id,
    });

    return new Response(
      JSON.stringify({ token, identity: user.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Onbekende fout";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
