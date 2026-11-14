// Supabase Edge Function: verwijdert het account van het ingelogde lid.
// Deploy: supabase functions deploy delete-account
//
// Het lid wordt bepaald uit het eigen inlogtoken; er wordt nooit een
// gebruikers-id uit de aanvraag gelezen. Verwijderd worden: profielfoto's,
// de wachtlijstregel met hetzelfde e-mailadres en het account zelf. Profiel,
// likes, matches, berichten, blokkades en meldingen verdwijnen mee via de
// cascade in de database. Beheerders kunnen zichzelf hier niet verwijderen.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PHOTO_BUCKET = "profile-photos";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Niet ingelogd." }, 401);

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) return json({ error: "Niet ingelogd." }, 401);

    const payload = await req.json().catch(() => ({}));
    if (payload?.confirm !== "VERWIJDER") {
      return json({ error: "Bevestiging ontbreekt." }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: adminRow } = await admin
      .from("app_admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (adminRow) {
      return json({ error: "Een beheerdersaccount kan hier niet worden verwijderd." }, 403);
    }

    const { data: photos } = await admin.storage.from(PHOTO_BUCKET).list(user.id, { limit: 100 });
    if (photos && photos.length > 0) {
      await admin.storage.from(PHOTO_BUCKET).remove(photos.map((file) => `${user.id}/${file.name}`));
    }

    if (user.email) {
      await admin.from("waitlist").delete().eq("email", user.email.toLowerCase());
    }

    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error("delete-account: verwijderen mislukt:", deleteError.message);
      return json({ error: "Verwijderen lukte niet. Probeer het later opnieuw." }, 500);
    }

    return json({ ok: true });
  } catch (err) {
    console.error("delete-account fout:", err);
    return json({ error: "Verwijderen lukte niet. Probeer het later opnieuw." }, 500);
  }
});
