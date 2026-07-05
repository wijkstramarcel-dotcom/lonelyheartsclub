// Supabase Edge Function: mailt leden bij een nieuwe match of nieuw bericht.
// Wordt aangeroepen door database-triggers (zie NOTIFICATIONS.sql).
//
// Deploy: supabase functions deploy notify-activity --no-verify-jwt
// Secrets instellen:
//   supabase secrets set RESEND_API_KEY=re_...
//   supabase secrets set NOTIFY_WEBHOOK_SECRET=<lang willekeurig geheim>
//   supabase secrets set MAIL_FROM="Lonely Hearts Club <hello@lonelyheartsclub.nl>"
//
// Ontwerpkeuzes:
// - Geen foto's of berichtinhoud in de mail (privacy + merk: eerst verhaal, dan beeld).
// - Berichtmails zijn gedempt: max 1 mail per gesprek per 30 minuten.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://www.lonelyheartsclub.nl";
const MESSAGE_THROTTLE_MINUTES = 30;

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

async function getEmail(userId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (error || !data?.user?.email || !data.user.email_confirmed_at) return null;
  return data.user.email;
}

async function getFirstName(userId: string): Promise<string> {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("voornaam, naam")
    .eq("id", userId)
    .maybeSingle();
  return (data?.voornaam || data?.naam || "iemand").trim().split(/\s+/)[0];
}

async function sendMail(to: string, subject: string, text: string) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("MAIL_FROM") || "Lonely Hearts Club <onboarding@resend.dev>";
  if (!apiKey) {
    console.warn("RESEND_API_KEY ontbreekt; mail niet verstuurd:", subject, "->", to);
    return;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, text }),
  });
  if (!response.ok) {
    console.error("Resend fout:", response.status, await response.text());
  }
}

function matchMail(recipientName: string, otherName: string) {
  return {
    subject: "Je hebt een nieuwe match bij Lonely Hearts Club",
    text: [
      `Hoi ${recipientName},`,
      "",
      `${otherName} toonde ook interesse in jou. Jullie zijn nu een match en de chat staat open.`,
      "",
      `Lees het verhaal nog eens rustig terug en stuur een opening die daarover gaat: ${SITE_URL}`,
      "",
      "Geen haast. Eerst chatten, dan anoniem bellen, en pas afspreken als het goed voelt.",
      "",
      "Lonely Hearts Club",
    ].join("\n"),
  };
}

function messageMail(recipientName: string, otherName: string) {
  return {
    subject: `Nieuw bericht van ${otherName} bij Lonely Hearts Club`,
    text: [
      `Hoi ${recipientName},`,
      "",
      `${otherName} stuurde je een bericht. Lees het op je eigen moment: ${SITE_URL}`,
      "",
      "We tonen de inhoud bewust niet in deze mail; het gesprek blijft privé in de app.",
      "",
      "Lonely Hearts Club",
    ].join("\n"),
  };
}

async function handleNewMatch(record: { id: string; user_a: string; user_b: string }) {
  const pairs: Array<[string, string]> = [
    [record.user_a, record.user_b],
    [record.user_b, record.user_a],
  ];
  for (const [recipientId, otherId] of pairs) {
    const email = await getEmail(recipientId);
    if (!email) continue;
    const [recipientName, otherName] = await Promise.all([
      getFirstName(recipientId),
      getFirstName(otherId),
    ]);
    const mail = matchMail(recipientName, otherName);
    await sendMail(email, mail.subject, mail.text);
  }
}

async function handleNewMessage(record: {
  id: string;
  match_id: string;
  sender_id: string;
  created_at: string;
}) {
  const { data: match } = await supabaseAdmin
    .from("matches")
    .select("user_a, user_b")
    .eq("id", record.match_id)
    .maybeSingle();
  if (!match) return;

  const recipientId = match.user_a === record.sender_id ? match.user_b : match.user_a;

  // Demping: geen mail als er in de afgelopen 30 min al een bericht
  // van dezelfde afzender in dit gesprek zat (die mail is al verstuurd).
  const since = new Date(
    new Date(record.created_at).getTime() - MESSAGE_THROTTLE_MINUTES * 60_000,
  ).toISOString();
  const { count } = await supabaseAdmin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("match_id", record.match_id)
    .eq("sender_id", record.sender_id)
    .gte("created_at", since)
    .lt("created_at", record.created_at);
  if ((count ?? 0) > 0) return;

  const email = await getEmail(recipientId);
  if (!email) return;
  const [recipientName, otherName] = await Promise.all([
    getFirstName(recipientId),
    getFirstName(record.sender_id),
  ]);
  const mail = messageMail(recipientName, otherName);
  await sendMail(email, mail.subject, mail.text);
}

serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const secret = Deno.env.get("NOTIFY_WEBHOOK_SECRET") ?? "";
  if (!secret || request.headers.get("x-notify-secret") !== secret) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const payload = await request.json();
    if (payload?.type !== "INSERT" || !payload?.record) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), { status: 200 });
    }

    if (payload.table === "matches") {
      await handleNewMatch(payload.record);
    } else if (payload.table === "messages") {
      await handleNewMessage(payload.record);
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("notify-activity fout:", err);
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }
});
