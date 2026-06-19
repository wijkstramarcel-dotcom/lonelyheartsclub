import { useEffect, useMemo, useRef, useState } from "react";
import { hasSupabaseConfig, supabase } from "./lib/supabase.js";
import {
  answerIncomingCall,
  hangUp,
  initTwilioDevice,
  isVoiceCallingEnabled,
  onIncomingCall,
  rejectIncomingCall,
  startCall,
} from "./lib/twilio.js";

const PASSIONS = [
  "Hardlopen",
  "Kunst",
  "Reizen",
  "Lezen",
  "Koken",
  "Muziek",
  "Wandelen",
  "Theater",
  "Yoga",
  "Koffie",
];

const DEMO_USER = {
  id: "demo-user",
  email: "demo@lonelyheartsclub.nl",
};

const DEMO_PROFILE = {
  id: DEMO_USER.id,
  naam: "Marcel",
  voornaam: "Marcel",
  leeftijd: 48,
  geslacht: "Man",
  zoekt: "Ik zoek vrouwen",
  verhaal: "Avontuurlijk, eerlijk en op zoek naar een gesprek dat langer blijft hangen.",
  passies: ["Hardlopen", "Kunst", "Reizen"],
  tags: ["Hardlopen", "Kunst", "Reizen"],
  actief: true,
};

const DEMO_PROFILES = [
  {
    id: "demo-sarah",
    naam: "Sarah",
    leeftijd: 42,
    geslacht: "Vrouw",
    zoekt: "Ik zoek mannen",
    verhaal: "Rustig van buiten, nieuwsgierig van binnen. Ik hou van lange wandelingen en directe eerlijkheid.",
    passies: ["Wandelen", "Lezen", "Koffie"],
    tags: ["Wandelen", "Lezen", "Koffie"],
    actief: true,
  },
  {
    id: "demo-linda",
    naam: "Linda",
    leeftijd: 45,
    geslacht: "Vrouw",
    zoekt: "Ik zoek mannen",
    verhaal: "Ik zoek iemand die kan luisteren, kan lachen en ook stilte niet hoeft op te vullen.",
    passies: ["Yoga", "Theater", "Reizen"],
    tags: ["Yoga", "Theater", "Reizen"],
    actief: true,
  },
  {
    id: "demo-nora",
    naam: "Nora",
    leeftijd: 39,
    geslacht: "Vrouw",
    zoekt: "Ik zoek mannen",
    verhaal: "Muziek, koken, buiten zijn. Geen haast, wel aandacht.",
    passies: ["Muziek", "Koken", "Wandelen"],
    tags: ["Muziek", "Koken", "Wandelen"],
    actief: true,
  },
];

const DEMO_MATCHES = [];
const DEMO_MESSAGES = {};

const tabs = [
  { id: "discover", label: "Ontdek" },
  { id: "matches", label: "Matches" },
  { id: "messages", label: "Berichten" },
  { id: "profile", label: "Profiel" },
];

const ADMIN_TAB = { id: "admin", label: "Live status" };

const PRODUCT_FLOW_STEPS = [
  ["01", "Match zoeken", "Ontdek leden op verhaal, intentie en voorkeuren, zonder foto als eerste oordeel."],
  ["02", "Interesse tonen", "Pas bij wederzijdse interesse ontstaat een match en gaat de chat open."],
  ["03", "Chatten", "Voel of er ritme, aandacht en nieuwsgierigheid in het gesprek zit."],
  ["04", "Anoniem bellen", "Bel afgeschermd voordat je telefoonnummers of privégegevens deelt."],
  ["05", "Afspreken", "Spreek pas af als het gesprek veilig en goed voelt."],
];

const TRUST_PILLARS = [
  [
    "Minder profielen, meer aandacht",
    "We tonen liever een kleine, passende selectie dan een eindeloze stapel profielen. Dat houdt het zoeken rustiger en serieuzer.",
  ],
  [
    "Een profiel dat gesprek start",
    "Verhaal, passies en intentie dragen het profiel. Zo geef je iemand een echte opening, niet alleen een snelle foto-reactie.",
  ],
  [
    "Veiligheid in elke stap",
    "Blokkeren en rapporteren zijn direct beschikbaar. Voor een afspraak zit er bewust eerst chat en anoniem bellen tussen.",
  ],
];

const LEARNING_ITEMS = [
  [
    "Beperk de ruis",
    "Goede datingproducten maken kiezen niet eindeloos. Lonely Hearts Club kiest daarom voor passende profielen en een rustige route.",
  ],
  [
    "Maak intentie zichtbaar",
    "Leden moeten voelen dat de ander serieus zoekt. Daarom draait het profiel om verhaal, passies en aandacht in plaats van alleen uiterlijk.",
  ],
  [
    "Breng veiligheid dichtbij",
    "Privacy, rapporteren, verbergen en anoniem bellen horen op de plekken te staan waar leden ze nodig hebben.",
  ],
];

const AUDIENCE_ITEMS = [
  "Singles die genoeg hebben van eindeloos swipen.",
  "Mensen die liever eerst karakter, stem en aandacht voelen.",
  "Daters die privacy belangrijk vinden en rustig willen opbouwen.",
];

const SAFETY_ITEMS = [
  [
    "Profielen niet openbaar",
    "Profielinformatie is bedoeld voor ingelogde leden en niet als openbare zoekmachinepagina.",
  ],
  [
    "Toestemming per stap",
    "Voor de wachtlijst, accountgegevens en profielgegevens vragen we expliciet om akkoord voordat data wordt opgeslagen.",
  ],
  [
    "Anoniem bellen als tussenstap",
    "Het doel is dat je eerst veilig kunt praten zonder direct telefoonnummers of privégegevens te delen.",
  ],
  [
    "Blokkeren en rapporteren",
    "Je kunt een profiel verbergen of rapporteren vanuit Ontdek en vanuit het gesprek. Rapportages blijven afgeschermd.",
  ],
  [
    "Menselijke schaal",
    "We laten liever gecontroleerd mensen toe dan meteen een groot, rommelig ledenbestand te vullen.",
  ],
];

const FAQ_ITEMS = [
  [
    "Wat is Lonely Hearts Club?",
    "Lonely Hearts Club is een Nederlandse datingcommunity met een wachtlijst. De app draait om rustig matchen, chatten en anoniem bellen voordat je eventueel afspreekt.",
  ],
  [
    "Is dit een datingapp zonder foto?",
    "Je profiel begint zonder foto als eerste oordeel. Leden ontdekken elkaar via verhaal, passies, intentie en gesprek voordat uiterlijk centraal staat.",
  ],
  [
    "Hoe werkt anoniem bellen?",
    "Na een match en chat kun je afgeschermd bellen. Het doel is dat telefoonnummers privé blijven totdat beide mensen zelf verder willen.",
  ],
  [
    "Kan ik me al inschrijven?",
    "Ja. Je kunt je e-mailadres achterlaten op de wachtlijst. Zodra we de eerste groep gebruikers toelaten, krijg je bericht om eventueel een profiel te maken.",
  ],
  [
    "Voor wie is Lonely Hearts Club bedoeld?",
    "Voor singles die bewuster willen daten: minder swipe-druk, meer aandacht voor verhaal, intentie, chat en een veilig belmoment.",
  ],
];

const AUTH_MODES = [
  {
    id: "link",
    label: "Bestaand account",
    hint: "mail zonder wachtwoord",
    title: "Log in met een veilige link",
    text: "Gebruik dit als je al een account hebt of je wachtwoord niet weet. We sturen een eenmalige link per e-mail. Dit maakt geen nieuw account aan.",
    submit: "Stuur veilige link",
  },
  {
    id: "login",
    label: "Wachtwoord",
    hint: "als je het weet",
    title: "Inloggen met wachtwoord",
    text: "Gebruik dit als je al een account hebt en je wachtwoord weet. Deze route werkt zonder e-mail. Wachtwoord kwijt? Vraag hieronder een herstel-link aan.",
    submit: "Log in",
  },
  {
    id: "signup",
    label: "Uitnodiging",
    hint: "nieuw account",
    title: "Maak account met uitnodiging",
    text: "Gebruik dit alleen als je een uitnodigingscode hebt ontvangen. Sta je alleen op de wachtlijst, dan heb je nog geen account.",
    submit: "Maak account",
  },
];

const AUTH_GUIDE_ITEMS = [
  ["Alleen op de wachtlijst?", "Dan heb je nog geen account. Wacht op je uitnodiging of schrijf je eerst in."],
  ["Uitnodiging ontvangen?", "Kies Uitnodiging en vul je code in om een account te maken."],
  ["Al een account?", "Kies Bestaand account voor een mail-link, of Wachtwoord als je je wachtwoord weet."],
];

const AUTH_RETURN_COPY = {
  signup: {
    title: "E-mailadres bevestigd",
    text: "Als je niet automatisch bent ingelogd, log dan in met je wachtwoord of vraag een inloglink aan.",
    action: "Open inloggen",
  },
  login: {
    title: "Inloglink geopend",
    text: "Als je sessie niet automatisch actief is, vraag dan een nieuwe inloglink aan of log in met je wachtwoord.",
    action: "Open inloggen",
  },
  recovery: {
    title: "Herstel-link geopend",
    text: "Als het wachtwoordformulier niet verschijnt, vraag dan via Inloggen > Wachtwoord een nieuwe herstel-link aan.",
    action: "Open inloggen",
  },
};

const AUTH_ERROR_COPY = {
  otp_expired: {
    title: "Link verlopen",
    text: "Deze e-maillink is eenmalig of te oud. Vraag via Inloggen een nieuwe veilige link of bevestigingsmail aan.",
    action: "Nieuwe link aanvragen",
  },
  access_denied: {
    title: "Link niet geaccepteerd",
    text: "De e-maillink kon niet worden gebruikt. Vraag een nieuwe link aan vanaf de live site en open de nieuwste mail.",
    action: "Nieuwe link aanvragen",
  },
  default: {
    title: "Inloggen niet gelukt",
    text: "De e-maillink werkte niet. Vraag een nieuwe link aan of log in met je wachtwoord als je al een account hebt.",
    action: "Open inloggen",
  },
};

const REPORT_REASONS = [
  "Onveilig of grensoverschrijdend gedrag",
  "Nepaccount of misleiding",
  "Spam of commercieel bericht",
  "Discriminerende of kwetsende inhoud",
  "Anders",
];

const CONVERSION_EVENTS = new Set([
  "landing_view",
  "waitlist_cta_click",
  "waitlist_view",
  "waitlist_submit",
  "demo_open",
  "account_start",
]);
const sentConversionEvents = new Set();

const CONTACT_EMAIL = "privacy@lonelyheartsclub.nl";
const DEFAULT_SITE_URL = "https://www.lonelyheartsclub.nl";
const CONSENT_VERSION = "2026-06-10";
const SENSITIVE_CONSENT_KEY = "lhc-sensitive-consent";
const PENDING_INVITE_KEY = "lhc-pending-invite";

function normalizeList(value) {
  const rawItems = Array.isArray(value) ? value : String(value || "").split(",");
  const seen = new Set();
  return rawItems
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function normalizeProfile(profile) {
  if (!profile) return null;
  const tags = normalizeList(profile.tags);
  const passies = normalizeList(profile.passies);
  return {
    ...profile,
    naam: profile.naam || profile.voornaam || "Nieuw lid",
    voornaam: profile.voornaam || profile.naam || "Nieuw lid",
    passies,
    tags: tags.length ? tags : passies,
  };
}

function normalizeGender(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return "";
  if (text.includes("vrouw")) return "women";
  if (text.includes("man")) return "men";
  if (text.includes("non") || text.includes("binair")) return "nonbinary";
  return "";
}

function normalizePreference(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return new Set();
  if (text.includes("iedereen")) return new Set(["women", "men", "nonbinary"]);

  const preference = new Set();
  if (text.includes("vrouw")) preference.add("women");
  if (text.includes("man")) preference.add("men");
  if (text.includes("non") || text.includes("binair")) preference.add("nonbinary");
  return preference;
}

function fitsPreference(viewerProfile, candidateProfile) {
  const wantedGenders = normalizePreference(viewerProfile?.zoekt);
  if (!wantedGenders.size) return true;

  const candidateGender = normalizeGender(candidateProfile?.geslacht);
  return Boolean(candidateGender && wantedGenders.has(candidateGender));
}

function isPotentialMatch(viewerProfile, candidateProfile) {
  return fitsPreference(viewerProfile, candidateProfile) && fitsPreference(candidateProfile, viewerProfile);
}

function normalizeTextKey(value) {
  return String(value || "").trim().toLowerCase();
}

function profileCompletenessScore(profile) {
  if (!profile) return 0;
  let score = 0;
  if (profile.naam || profile.voornaam) score += 12;
  if (Number(profile.leeftijd)) score += 12;
  if (profile.geslacht) score += 10;
  if (profile.zoekt) score += 10;
  if (String(profile.verhaal || "").trim().length >= 80) score += 26;
  else if (String(profile.verhaal || "").trim().length >= 30) score += 16;
  score += Math.min(normalizeList(profile.passies).length, 4) * 7;
  return Math.min(score, 100);
}

function daysSince(value) {
  if (!value) return null;
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return null;
  return Math.max(0, (Date.now() - time) / 86400000);
}

function scoreMatch(viewerProfile, candidateProfile) {
  if (!isPotentialMatch(viewerProfile, candidateProfile)) {
    return { score: 0, reasons: [], sharedTags: [], level: "Geen match", compass: [] };
  }

  const viewerTags = new Set(normalizeList(viewerProfile?.tags?.length ? viewerProfile.tags : viewerProfile?.passies).map(normalizeTextKey));
  const candidateTags = normalizeList(candidateProfile?.tags?.length ? candidateProfile.tags : candidateProfile?.passies);
  const sharedTags = candidateTags.filter((tag) => viewerTags.has(normalizeTextKey(tag))).slice(0, 3);
  const ageDistance =
    Number.isFinite(Number(viewerProfile?.leeftijd)) && Number.isFinite(Number(candidateProfile?.leeftijd))
      ? Math.abs(Number(viewerProfile.leeftijd) - Number(candidateProfile.leeftijd))
      : null;
  const completeness = profileCompletenessScore(candidateProfile);
  const lastTouchedDays = daysSince(candidateProfile?.updated_at || candidateProfile?.created_at);

  let score = 46;
  score += Math.min(sharedTags.length, 3) * 12;
  if (ageDistance !== null) {
    if (ageDistance <= 4) score += 14;
    else if (ageDistance <= 8) score += 9;
    else if (ageDistance <= 14) score += 4;
  }
  score += Math.round(completeness * 0.18);
  if (lastTouchedDays !== null) {
    if (lastTouchedDays <= 7) score += 8;
    else if (lastTouchedDays <= 30) score += 4;
  }

  const lifeStageScore =
    ageDistance === null ? 55 : ageDistance <= 4 ? 100 : ageDistance <= 8 ? 82 : ageDistance <= 14 ? 62 : 42;
  const activityScore = lastTouchedDays === null ? 55 : lastTouchedDays <= 7 ? 100 : lastTouchedDays <= 30 ? 78 : 46;
  const compass = [
    { label: "Voorkeur", value: 100 },
    { label: "Passies", value: Math.max(34, Math.min(100, sharedTags.length * 34)) },
    { label: "Levensfase", value: lifeStageScore },
    { label: "Verhaal", value: Math.max(38, Math.min(100, Math.round(completeness * 0.78 + activityScore * 0.22))) },
  ];

  const reasons = [];
  if (sharedTags.length) reasons.push(`${sharedTags.length} gedeelde ${sharedTags.length === 1 ? "passie" : "passies"}`);
  if (ageDistance !== null && ageDistance <= 8) reasons.push("zelfde levensfase");
  if (completeness >= 70) reasons.push("vol verhaal");
  if (lastTouchedDays !== null && lastTouchedDays <= 30) reasons.push("recent actief");
  if (!reasons.length) reasons.push("voorkeuren passen wederzijds");

  const finalScore = Math.max(0, Math.min(99, score));
  const level = finalScore >= 82 ? "Sterke match" : finalScore >= 68 ? "Goede match" : "Rustige kans";
  return { score: finalScore, reasons, sharedTags, level, compass };
}

function describeMatchFilter(profile) {
  return {
    gender: profile?.geslacht || "Nog niet ingevuld",
    seeking: profile?.zoekt || "Nog niet ingevuld",
    summary:
      profile?.geslacht && profile?.zoekt
        ? "Je ziet leden die wederzijds bij je voorkeur passen. De volgorde kijkt daarna naar verhaal, passies en recente activiteit."
        : "Maak je profiel compleet om passende leden te kunnen tonen.",
  };
}

function getOtherUserId(match, userId) {
  return match.user_a === userId ? match.user_b : match.user_a;
}

function formatTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return "Nog niet";
  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function classNames(...parts) {
  return parts.filter(Boolean).join(" ");
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isConfiguredAdminEmail(email) {
  const configured = String(import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);
  return configured.includes(normalizeEmail(email));
}

function getAdminModeRequested() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.has("admin") || window.location.hash === "#admin";
  } catch {
    return false;
  }
}

function normalizeInviteCode(value) {
  return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function pendingInviteKey(email) {
  return `${PENDING_INVITE_KEY}:${normalizeEmail(email) || "unknown"}`;
}

function rememberPendingInviteCode(email, code) {
  const normalizedCode = normalizeInviteCode(code);
  if (!normalizedCode) return;
  try {
    window.localStorage.setItem(pendingInviteKey(email), normalizedCode);
  } catch {
    // Local storage is only a convenience for email-confirmation redirects.
  }
}

function readPendingInviteCode(email) {
  try {
    return window.localStorage.getItem(pendingInviteKey(email)) || "";
  } catch {
    return "";
  }
}

function clearPendingInviteCode(email) {
  try {
    window.localStorage.removeItem(pendingInviteKey(email));
  } catch {
    // Nothing to clean up.
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));
}

function consentTimestamp() {
  return new Date().toISOString();
}

function appRedirectOrigin() {
  const configuredSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL?.trim();
  try {
    const currentHost = window.location.hostname;
    const isLocalHost = ["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(currentHost);
    const baseUrl = configuredSiteUrl || (isLocalHost ? DEFAULT_SITE_URL : window.location.origin);
    return new URL(baseUrl).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

function authRedirectUrl(flow = "login") {
  const url = new URL("/auth/callback", appRedirectOrigin());
  url.searchParams.set("flow", flow);
  return url.toString();
}

function getAuthReturnNotice() {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace(/^#/, "");
    const hashParams = new URLSearchParams(hash);
    const errorKey =
      hashParams.get("error_code") ||
      searchParams.get("error_code") ||
      hashParams.get("error") ||
      searchParams.get("error");

    if (errorKey || hashParams.get("error_description") || searchParams.get("error_description")) {
      const copy = AUTH_ERROR_COPY[errorKey] || AUTH_ERROR_COPY.default;
      return { ...copy, variant: "error" };
    }

    const flow = searchParams.get("flow");
    if (Object.prototype.hasOwnProperty.call(AUTH_RETURN_COPY, flow)) {
      return { ...AUTH_RETURN_COPY[flow], variant: "success" };
    }

    const hashType = hashParams.get("type");
    if (hashType === "recovery") return { ...AUTH_RETURN_COPY.recovery, variant: "success" };
    if (hashType === "signup") return { ...AUTH_RETURN_COPY.signup, variant: "success" };
    if (hashType === "magiclink") return { ...AUTH_RETURN_COPY.login, variant: "success" };
  } catch {
    // The return notice is best effort; auth itself is handled by Supabase.
  }
  return null;
}

function consentMetadata(timestamp = consentTimestamp()) {
  return {
    privacy_consent_at: timestamp,
    privacy_consent_version: CONSENT_VERSION,
  };
}

function privacyRequestMailto(user, type = "Verwijderverzoek") {
  const subject = `${type} Lonely Hearts Club`;
  const body = [
    `Hallo Lonely Hearts Club,`,
    "",
    `Ik wil een ${type.toLowerCase()} indienen voor mijn account.`,
    `Account e-mail: ${user?.email || ""}`,
    `Gebruiker-id: ${user?.id || ""}`,
    "",
    "Graag ontvang ik een bevestiging en de vervolgstappen.",
  ].join("\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function authHelpMailto(email, modeLabel) {
  const subject = "Hulp met toegang Lonely Hearts Club";
  const body = [
    "Hallo Lonely Hearts Club,",
    "",
    "Ik probeer in te loggen of mijn account te bevestigen, maar ik ontvang geen e-mail.",
    `E-mailadres: ${email || ""}`,
    `Stap: ${modeLabel || "Onbekend"}`,
    "",
    "Kunnen jullie mijn toegang controleren?",
  ].join("\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function isEmailDeliveryMessage(value) {
  const message = String(value || "").toLowerCase();
  return (
    message.includes("inbox") ||
    message.includes("bevestig") ||
    message.includes("bevestigingsmail") ||
    message.includes("inloglink") ||
    message.includes("herstel-link")
  );
}

function isMissingConsentColumnError(error) {
  const message = String(error?.message || "");
  return (
    error?.code === "PGRST204" ||
    message.includes("privacy_consent_at") ||
    message.includes("privacy_consent_version") ||
    message.includes("sensitive_data_consent_at") ||
    message.includes("consent_version")
  );
}

function isDuplicateEmailError(error) {
  const message = String(error?.message || "");
  return error?.code === "23505" || message.includes("duplicate key");
}

function isMissingSafetyTableError(error) {
  const message = String(error?.message || "").toLowerCase();
  return (
    error?.code === "42P01" ||
    error?.code === "PGRST205" ||
    message.includes("blocks") ||
    message.includes("reports") ||
    message.includes("could not find the table") ||
    (message.includes("relation") && message.includes("does not exist"))
  );
}

function isMissingInviteSchemaError(error) {
  const message = String(error?.message || "").toLowerCase();
  return (
    error?.code === "42883" ||
    error?.code === "PGRST202" ||
    message.includes("redeem_invite_code") ||
    message.includes("current_user_has_invite") ||
    message.includes("could not find the function")
  );
}

function friendlyInviteError(error) {
  if (isMissingInviteSchemaError(error)) {
    return "De uitnodigingslaag staat nog niet in Supabase. Run eerst de nieuwste schema.sql.";
  }
  return error?.message || "Uitnodiging controleren lukte niet. Controleer je code en probeer opnieuw.";
}

async function upsertWaitlist(email, timestamp) {
  const fullPayload = {
    email,
    privacy_consent_at: timestamp,
    consent_version: CONSENT_VERSION,
  };

  const { error } = await supabase.from("waitlist").insert(fullPayload);
  if (!error) return { duplicate: false };
  if (isDuplicateEmailError(error)) return { duplicate: true };
  if (!isMissingConsentColumnError(error)) throw error;

  const { error: fallbackError } = await supabase.from("waitlist").insert({ email });
  if (!fallbackError) return { duplicate: false };
  if (isDuplicateEmailError(fallbackError)) return { duplicate: true };
  throw fallbackError;
}

async function upsertProfile(payload) {
  const { error } = await supabase.from("profiles").upsert(payload);
  if (!error) return { error: null };
  if (!isMissingConsentColumnError(error)) return { error };

  const {
    privacy_consent_at,
    privacy_consent_version,
    sensitive_data_consent_at,
    consent_version,
    ...legacyPayload
  } = payload;
  return supabase.from("profiles").upsert(legacyPayload);
}

async function checkCurrentUserInvite() {
  const { data, error } = await supabase.rpc("current_user_has_invite");
  if (error) return { invited: false, error };
  return { invited: Boolean(data), error: null };
}

async function redeemInviteCode(inviteCode) {
  const { data, error } = await supabase.rpc("redeem_invite_code", {
    raw_code: inviteCode,
  });
  if (error) return { ok: false, error };
  return { ok: Boolean(data?.ok ?? data), error: null };
}

function getPagePath() {
  try {
    return `${window.location.pathname || "/"}`.slice(0, 180);
  } catch {
    return "/";
  }
}

function getReferrerHost() {
  try {
    if (!document.referrer) return null;
    return new URL(document.referrer).hostname.slice(0, 180);
  } catch {
    return null;
  }
}

function compactAnalyticsMetadata(metadata = {}) {
  return Object.fromEntries(
    Object.entries(metadata)
      .filter(([, value]) => ["boolean", "number", "string"].includes(typeof value))
      .map(([key, value]) => [key.slice(0, 40), typeof value === "string" ? value.slice(0, 140) : value]),
  );
}

async function trackConversionEvent(eventName, metadata = {}, options = {}) {
  if (!CONVERSION_EVENTS.has(eventName) || !hasSupabaseConfig || !supabase) return;

  if (options.onceKey) {
    const key = `${eventName}:${options.onceKey}`;
    if (sentConversionEvents.has(key)) return;
    sentConversionEvents.add(key);
  }

  try {
    await supabase.from("analytics_events").insert({
      event_name: eventName,
      page_path: getPagePath(),
      referrer_host: getReferrerHost(),
      metadata: compactAnalyticsMetadata(metadata),
    });
  } catch {
    // Conversiemeting mag nooit de app of wachtlijst blokkeren.
  }
}

function sensitiveConsentStorageKey(userId) {
  return `${SENSITIVE_CONSENT_KEY}:${userId || "anonymous"}`;
}

function hasStoredSensitiveConsent(userId) {
  try {
    return window.localStorage.getItem(sensitiveConsentStorageKey(userId)) === CONSENT_VERSION;
  } catch {
    return false;
  }
}

function rememberSensitiveConsent(userId) {
  try {
    window.localStorage.setItem(sensitiveConsentStorageKey(userId), CONSENT_VERSION);
  } catch {
    // Local storage is only a graceful fallback; server-side consent is handled through Supabase columns.
  }
}

export default function App() {
  const [sessionUser, setSessionUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [passwordRecoveryOpen, setPasswordRecoveryOpen] = useState(false);
  const [authReturnNotice] = useState(() => getAuthReturnNotice());

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) {
      setLoadingSession(false);
      return;
    }

    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSessionUser(data.session?.user ?? null);
      setLoadingSession(false);
    });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setSessionUser(session?.user ?? null);
      if (event === "PASSWORD_RECOVERY") {
        setPasswordRecoveryOpen(true);
        setAuthOpen(false);
        return;
      }
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        setAuthOpen(false);
      }
      if (event === "SIGNED_OUT") {
        setPasswordRecoveryOpen(false);
      }
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    if (demoMode) {
      setDemoMode(false);
      return;
    }
    await supabase?.auth.signOut();
    setSessionUser(null);
  };

  if (loadingSession) {
    return <LoadingScreen />;
  }

  if (demoMode) {
    return (
      <>
        <ProductApp
          user={DEMO_USER}
          initialProfile={DEMO_PROFILE}
          demoMode
          onLogout={handleLogout}
          onPrivacy={() => setPrivacyOpen(true)}
        />
        {privacyOpen && <PrivacyDialog onClose={() => setPrivacyOpen(false)} />}
        {passwordRecoveryOpen && <PasswordResetDialog onClose={() => setPasswordRecoveryOpen(false)} />}
      </>
    );
  }

  if (sessionUser) {
    return (
      <>
        <ProductApp user={sessionUser} onLogout={handleLogout} onPrivacy={() => setPrivacyOpen(true)} />
        {privacyOpen && <PrivacyDialog onClose={() => setPrivacyOpen(false)} />}
        {passwordRecoveryOpen && <PasswordResetDialog onClose={() => setPasswordRecoveryOpen(false)} />}
      </>
    );
  }

  return (
    <>
      <LandingPage
        authOpen={authOpen}
        authReturnNotice={authReturnNotice}
        setAuthOpen={setAuthOpen}
        onDemo={() => setDemoMode(true)}
        onPrivacy={() => setPrivacyOpen(true)}
      />
      {privacyOpen && <PrivacyDialog onClose={() => setPrivacyOpen(false)} />}
      {passwordRecoveryOpen && <PasswordResetDialog onClose={() => setPasswordRecoveryOpen(false)} />}
    </>
  );
}

function LoadingScreen() {
  return (
    <main className="loading-screen">
      <img src="/lhc-seal.svg" alt="" className="loading-logo" />
      <p>Lonely Hearts Club wordt geladen</p>
    </main>
  );
}

function LandingPage({ authOpen, authReturnNotice, setAuthOpen, onDemo, onPrivacy }) {
  useEffect(() => {
    void trackConversionEvent("landing_view", {}, { onceKey: "landing" });
  }, []);

  const scrollToWaitlist = () => {
    window.location.hash = "voorinschrijven";
    window.requestAnimationFrame(() => {
      document.getElementById("voorinschrijven")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const trackWaitlistCta = () => {
    void trackConversionEvent("waitlist_cta_click");
  };

  const openDemo = () => {
    void trackConversionEvent("demo_open");
    onDemo();
  };

  const openAccount = () => {
    void trackConversionEvent("account_start");
    setAuthOpen(true);
  };

  return (
    <main className="site-shell">
      <HeaderNav onLogin={() => setAuthOpen(true)} onPrivacy={onPrivacy} />

      {authReturnNotice && <AuthReturnNotice notice={authReturnNotice} onLogin={() => setAuthOpen(true)} />}

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Nederland · privacyvriendelijk daten · 2026</p>
          <h1>Lonely Hearts Club</h1>
          <p className="hero-subtitle">
            Je ontdekt eerst iemands verhaal. Bij wederzijdse interesse chat je, daarna bel je
            anoniem en pas daarna spreek je af als het echt goed voelt.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#voorinschrijven" onClick={trackWaitlistCta}>
              Schrijf je in voor de wachtlijst
            </a>
            <button className="secondary-button" onClick={openDemo}>
              Bekijk demo
            </button>
          </div>
          <div className="trust-row" aria-label="Belangrijkste voordelen">
            <span>Geen foto als eerste filter</span>
            <span>Anoniem contact</span>
            <span>Matches met aandacht</span>
          </div>
        </div>

        <div className="hero-product" aria-label="Product preview">
          <div className="phone-frame">
            <div className="phone-bar">
              <span />
              <span />
            </div>
            <div className="phone-content">
              <img src="/lhc-seal.svg" alt="" className="phone-logo" />
              <p className="phone-kicker">Eerst verhaal, dan stem</p>
              <h2>Van match naar chat, anoniem bellen en veilig afspreken.</h2>
              <div className="flow-list">
                <span>1. Ontdek op verhaal en intentie</span>
                <span>2. Chat pas na wederzijdse interesse</span>
                <span>3. Bel anoniem voordat je gegevens deelt</span>
                <span>4. Spreek af als het veilig en goed voelt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PreRegisterSection onPrivacy={onPrivacy} onCreateAccount={openAccount} />

      <section className="section-band" id="waarom">
        <div className="section-inner">
          <p className="eyebrow">Dating zonder swipe-ruis</p>
          <h2>Voor singles die eerst karakter willen leren kennen.</h2>
          <div className="story-grid">
            <article>
              <h3>Geen foto als eerste oordeel</h3>
              <p>
                Lonely Hearts Club is gebouwd voor mensen die genoeg hebben van eindeloos swipen.
                Je profiel begint met je verhaal, passies en intentie, niet met perfecte foto's.
              </p>
            </article>
            <article>
              <h3>Anoniem daten met rust</h3>
              <p>
                Je ontdekt leden op inhoud en wederzijdse interesse. Pas daarna ga je naar chat,
                anoniem bellen en eventueel een echte afspraak.
              </p>
            </article>
            <article>
              <h3>Nederlandse datingcommunity</h3>
              <p>
                We starten klein in Nederland, zodat er genoeg aandacht blijft voor veiligheid, privacy en
                echte gesprekken tussen actieve leden.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section-inner trust-section">
        <div className="section-heading">
          <p className="eyebrow">Waarom anders</p>
          <h2>Niet sneller swipen, maar beter beginnen.</h2>
        </div>
        <div className="trust-grid">
          {TRUST_PILLARS.map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="section-inner">
          <div className="section-heading">
            <p className="eyebrow">Wat we meenemen</p>
            <h2>De beste les van moderne dating: minder ruis, meer vertrouwen.</h2>
          </div>
          <div className="story-grid">
            {LEARNING_ITEMS.map(([title, text]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band audience-section">
        <div className="section-inner audience-layout">
          <div>
            <p className="eyebrow">Voor wie</p>
            <h2>Voor mensen die niet harder willen swipen.</h2>
            <p>
              Lonely Hearts Club is geen race naar zoveel mogelijk profielen. Het is bedoeld voor singles
              die eerst willen merken hoe iemand denkt, praat en aandacht geeft.
            </p>
          </div>
          <ul className="audience-list">
            {AUDIENCE_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-band" id="hoe">
        <div className="section-inner">
          <p className="eyebrow">Hoe het werkt</p>
          <h2>De route is bewust: match, chat, bel en spreek pas daarna af.</h2>
          <div className="steps-grid">
            {PRODUCT_FLOW_STEPS.map(([number, title, text]) => (
              <article className="step-card" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SafetySection />

      <FAQSection />

      <section className="closing-section">
        <div>
          <p className="eyebrow">Voor singles die eerst vertrouwen willen opbouwen</p>
          <h2>Wil je erbij zijn zodra we opengaan?</h2>
        </div>
        <a className="primary-button" href="#voorinschrijven" onClick={trackWaitlistCta}>
          Schrijf je in
        </a>
      </section>

      <SiteFooter onPrivacy={onPrivacy} />

      {authOpen && (
        <AuthDialog
          onClose={() => setAuthOpen(false)}
          onDemo={openDemo}
          onPrivacy={() => {
            setAuthOpen(false);
            onPrivacy();
          }}
          onWaitlist={() => {
            setAuthOpen(false);
            trackWaitlistCta();
            scrollToWaitlist();
          }}
        />
      )}
    </main>
  );
}

function AuthReturnNotice({ notice, onLogin }) {
  return (
    <section className={classNames("auth-return-notice", notice.variant)} role="status" aria-live="polite">
      <div>
        <strong>{notice.title}</strong>
        <span>{notice.text}</span>
      </div>
      <button className="secondary-button" type="button" onClick={onLogin}>
        {notice.action}
      </button>
    </section>
  );
}

function SafetySection() {
  return (
    <section className="section-inner safety-section" id="veiligheid">
      <div className="section-heading">
        <p className="eyebrow">Privacy & veiligheid</p>
        <h2>Vertrouwen moet in het product zitten, niet alleen in de belofte.</h2>
      </div>
      <div className="safety-grid">
        {SAFETY_ITEMS.map(([title, text]) => (
          <article key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="section-band faq-section" id="vragen">
      <div className="section-inner">
        <p className="eyebrow">Veelgestelde vragen</p>
        <h2>Anoniem daten, matchen en veilig verdergaan.</h2>
        <div className="faq-grid">
          {FAQ_ITEMS.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function PreRegisterSection({ onPrivacy, onCreateAccount }) {
  const sectionRef = useRef(null);
  const [email, setEmail] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    if (!("IntersectionObserver" in window)) {
      void trackConversionEvent("waitlist_view", { fallback: true }, { onceKey: "waitlist" });
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        void trackConversionEvent("waitlist_view", {}, { onceKey: "waitlist" });
        observer.disconnect();
      },
      { threshold: 0.32 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setStatus("");
    setError("");

    const normalizedEmail = normalizeEmail(email);
    if (!isValidEmail(normalizedEmail)) {
      setError("Vul een geldig e-mailadres in.");
      return;
    }
    if (!privacyAccepted) {
      setError("Accepteer eerst de privacyverklaring voor de wachtlijst.");
      return;
    }
    if (!hasSupabaseConfig || !supabase) {
      setError("De wachtlijst is nog niet gekoppeld. Probeer het later opnieuw.");
      return;
    }

    setLoading(true);
    try {
      const result = await upsertWaitlist(normalizedEmail, consentTimestamp());
      void trackConversionEvent("waitlist_submit", { duplicate: Boolean(result?.duplicate) });
      setStatus(result?.duplicate ? "duplicate" : "saved");
      setEmail("");
      setPrivacyAccepted(false);
    } catch (err) {
      setError(err.message || "Inschrijven voor de wachtlijst lukte niet. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pre-register-section" id="voorinschrijven" ref={sectionRef}>
      <div className="pre-register-copy">
        <p className="eyebrow">Wachtlijst</p>
        <h2>Meld je aan voor de wachtlijst.</h2>
        <p>
          Laat je e-mailadres achter als je interesse hebt in rustig, privacyvriendelijk daten. Je maakt
          nog geen profiel aan en je zit nergens aan vast.
        </p>
        <ul>
          <li>We mailen alleen over toegang en belangrijke productupdates.</li>
          <li>Je kiest later zelf of je echt een profiel maakt.</li>
          <li>We laten leden gecontroleerd toe, zodat de eerste matches genoeg aandacht krijgen.</li>
        </ul>
      </div>

      <form className="pre-register-form" onSubmit={submit} noValidate>
        <div className="form-intro">
          <strong>Voorinschrijven</strong>
          <span>Alleen je e-mailadres. Geen profiel, geen foto's, geen verplichting.</span>
        </div>

        <label>
          E-mailadres
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="jouw@email.nl"
            autoComplete="email"
          />
        </label>

        <div className="check-row">
          <input
            id="waitlist-privacy-accepted"
            type="checkbox"
            checked={privacyAccepted}
            onChange={(event) => setPrivacyAccepted(event.target.checked)}
          />
          <label htmlFor="waitlist-privacy-accepted">
            Ik ga akkoord dat Lonely Hearts Club mijn e-mailadres bewaart voor de wachtlijst en updates over toegang.{" "}
            <button className="inline-link" type="button" onClick={onPrivacy}>
              Lees privacy
            </button>
            .
          </label>
        </div>

        {error && <p className="form-message error">{error}</p>}
        {status && (
          <div className="waitlist-result" role="status" aria-live="polite">
            <strong>{status === "duplicate" ? "Je stond al op de wachtlijst." : "Je staat op de wachtlijst."}</strong>
            <p>We sturen je een uitnodiging zodra we de volgende groep leden toelaten.</p>
            <ul>
              <li>Je account is nog niet aangemaakt.</li>
              <li>Je kunt later zelf kiezen of je een profiel maakt.</li>
              <li>We gebruiken dit e-mailadres alleen voor toegangsupdates.</li>
            </ul>
          </div>
        )}

        <button className="primary-button wide" disabled={loading} type="submit">
          {loading ? "Aanmelden" : "Meld mij aan"}
        </button>
        <div className="account-note">
          <span>Heb je al een uitnodiging of bestaand account?</span>
          <button className="text-button" type="button" onClick={onCreateAccount}>
            Inloggen of account maken
          </button>
        </div>
      </form>
    </section>
  );
}

function HeaderNav({ onLogin, onPrivacy }) {
  return (
    <header className="top-nav">
      <a href="/" className="brand-lockup" aria-label="Lonely Hearts Club home">
        <img src="/lhc-seal.svg" alt="" />
        <span>Lonely Hearts Club</span>
      </a>
      <nav>
        <a href="#voorinschrijven">Wachtlijst</a>
        <a href="#waarom">Waarom</a>
        <a href="#hoe">Hoe het werkt</a>
        <a href="#vragen">Vragen</a>
        <button className="nav-link" type="button" onClick={onPrivacy}>
          Privacy
        </button>
        <button className="nav-button" onClick={onLogin}>
          Inloggen
        </button>
      </nav>
    </header>
  );
}

function SiteFooter({ onPrivacy }) {
  return (
    <footer className="site-footer">
      <span>Lonely Hearts Club</span>
      <button className="inline-link" type="button" onClick={onPrivacy}>
        Privacy & gegevens
      </button>
      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
    </footer>
  );
}

function PrivacyDialog({ onClose }) {
  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="privacy-dialog" role="dialog" aria-modal="true" aria-labelledby="privacy-title">
        <button className="icon-button close-button" onClick={onClose} aria-label="Sluiten">
          x
        </button>
        <p className="eyebrow">Privacy & gegevens</p>
        <h2 id="privacy-title">Jij houdt grip op je datinggegevens.</h2>
        <p>
          Lonely Hearts Club verwerkt alleen gegevens die nodig zijn om je account, profiel, matches en
          berichten te laten werken.
        </p>

        <div className="privacy-grid">
          <article>
            <h3>Wat we opslaan</h3>
            <p>
              Je e-mailadres, profielgegevens, leeftijd, geslacht, zoekvoorkeur, passies, likes, matches,
              berichten, technische accountgegevens en cookievrije conversie-events.
            </p>
          </article>
          <article>
            <h3>Waarom</h3>
            <p>
              Voor inloggen, matching, misbruikpreventie, beveiliging en het tonen van gesprekken tussen
              mensen die allebei interesse hebben.
            </p>
          </article>
          <article>
            <h3>Gevoelige voorkeuren</h3>
            <p>
              Geslacht, zoekvoorkeur en profieltekst kunnen gevoelige datinginformatie bevatten. We vragen
              daarom apart om expliciete toestemming bij het opslaan van je profiel.
            </p>
          </article>
          <article>
            <h3>Verwerkers</h3>
            <p>
              De app gebruikt Supabase voor accounts en database, Vercel voor hosting en alleen bij
              ingeschakelde belfunctionaliteit Twilio voor gespreksverbindingen.
            </p>
          </article>
          <article>
            <h3>Je rechten</h3>
            <p>
              Je kunt vragen om inzage, correctie, export, beperking of verwijdering van je gegevens. Je kunt
              toestemming later intrekken.
            </p>
          </article>
          <article>
            <h3>Profiel pauzeren</h3>
            <p>
              In je profiel kun je je zichtbaarheid pauzeren. Je profiel wordt dan niet getoond aan andere
              leden, terwijl je account niet direct wordt verwijderd.
            </p>
          </article>
          <article>
            <h3>Cookievrije statistiek</h3>
            <p>
              We meten alleen losse gebeurtenissen, zoals pagina geopend, wachtlijst gezien en inschrijving
              gelukt. We slaan daarbij geen e-mailadres, profieldata, cookie-ID of volledige referrer op.
            </p>
          </article>
          <article>
            <h3>Contact</h3>
            <p>
              Stuur privacyverzoeken naar <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Gebruik
              het e-mailadres waarmee je bent geregistreerd.
            </p>
          </article>
        </div>

        <p className="privacy-note">
          Op dit moment gebruikt de site geen marketingcookies vanuit de app-code. Als analytics of advertentiecookies
          later worden toegevoegd, moet daarvoor apart toestemming worden gevraagd.
        </p>
      </section>
    </div>
  );
}

function AuthDialog({ onClose, onDemo, onPrivacy, onWaitlist }) {
  const [mode, setMode] = useState("link");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const normalizedEmail = normalizeEmail(email);
  const normalizedInviteCode = normalizeInviteCode(inviteCode);
  const validEmail = isValidEmail(normalizedEmail);
  const needsPrivacyConsent = mode === "signup";
  const needsInviteCode = mode === "signup";
  const activeAuthMode = AUTH_MODES.find((item) => item.id === mode) ?? AUTH_MODES[0];
  const canResendConfirmation =
    validEmail &&
    (error.toLowerCase().includes("bevestig") || status.toLowerCase().includes("bevestig"));
  const showEmailHelp =
    validEmail &&
    (isEmailDeliveryMessage(status) || isEmailDeliveryMessage(error));

  const resendConfirmation = async () => {
    setError("");
    setStatus("");

    if (!validEmail) {
      setError("Vul eerst het e-mailadres in waarvoor je de bevestigingsmail wilt ontvangen.");
      return;
    }
    if (!hasSupabaseConfig || !supabase) {
      setError("Supabase is nog niet gekoppeld. Gebruik nu de demo.");
      return;
    }

    setResendLoading(true);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: normalizedEmail,
        options: {
          emailRedirectTo: authRedirectUrl("signup"),
        },
      });
      if (resendError) throw resendError;
      setStatus("Bevestigingsmail opnieuw verstuurd. Check ook je spam of reclamefolder.");
    } catch (err) {
      setError(err.message || "Bevestigingsmail opnieuw sturen lukte niet. Probeer het straks opnieuw.");
    } finally {
      setResendLoading(false);
    }
  };

  const requestPasswordReset = async () => {
    setError("");
    setStatus("");

    if (!validEmail) {
      setError("Vul eerst het e-mailadres van je bestaande account in. Dan kunnen we de herstel-link sturen.");
      return;
    }
    if (!hasSupabaseConfig || !supabase) {
      setError("Supabase is nog niet gekoppeld. Gebruik nu de demo.");
      return;
    }

    setResetLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: authRedirectUrl("recovery"),
      });
      if (resetError) throw resetError;
      setStatus(
        "Als dit e-mailadres een account heeft, sturen we nu een link om je wachtwoord in te stellen. Open die link in deze browser.",
      );
    } catch (err) {
      setError(err.message || "Wachtwoordlink sturen lukte niet. Probeer het straks opnieuw.");
    } finally {
      setResetLoading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");

    if (!validEmail) {
      setError("Vul een geldig e-mailadres in.");
      return;
    }
    if (mode !== "link" && password.length < 6) {
      setError("Gebruik minimaal 6 tekens voor je wachtwoord.");
      return;
    }
    if (needsPrivacyConsent && !privacyAccepted) {
      setError("Accepteer eerst de privacyverklaring om een account te starten.");
      return;
    }
    if (needsInviteCode && normalizedInviteCode.length < 6) {
      setError("Vul je uitnodigingscode in. Zonder uitnodiging kun je je eerst inschrijven voor de wachtlijst.");
      return;
    }
    if (!hasSupabaseConfig || !supabase) {
      setError("Supabase is nog niet gekoppeld. Gebruik nu de demo.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "link") {
        const { error: authError } = await supabase.auth.signInWithOtp({
          email: normalizedEmail,
          options: {
            emailRedirectTo: authRedirectUrl("login"),
            shouldCreateUser: false,
          },
        });
        if (authError) throw authError;
        setStatus("Check je inbox. Als dit e-mailadres een account heeft, staat daar nu een veilige inloglink.");
      }

      if (mode === "signup") {
        const acceptedAt = consentTimestamp();
        const authOptions = {
          emailRedirectTo: authRedirectUrl("signup"),
          data: {
            ...consentMetadata(acceptedAt),
            invite_pending: true,
          },
        };
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: authOptions,
        });
        if (signUpError) throw signUpError;
        rememberPendingInviteCode(normalizedEmail, normalizedInviteCode);
        await upsertWaitlist(normalizedEmail, acceptedAt);
        if (signUpData.session) {
          setStatus("Account aangemaakt. Je bent ingelogd; activeer je uitnodiging bij het maken van je profiel.");
        } else {
          setStatus(
            "Account gestart. Bevestig je e-mailadres via de link in je inbox. Daarna kom je terug om je uitnodiging te activeren en je profiel te maken.",
          );
        }
      }

      if (mode === "login") {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (loginError) throw loginError;
      }
    } catch (err) {
      const message = err.message || "Inloggen lukte niet. Probeer het opnieuw.";
      if (mode === "link" && (message.toLowerCase().includes("signup") || message.toLowerCase().includes("signups"))) {
        setError("Geen bestaand account gevonden. Heb je een uitnodiging? Kies Uitnodiging. Anders kun je je eerst inschrijven voor de wachtlijst.");
      } else if (message.toLowerCase().includes("email not confirmed")) {
        setError("Je e-mailadres is nog niet bevestigd. Open eerst de bevestigingsmail of stuur hem hieronder opnieuw.");
      } else if (message.toLowerCase().includes("invalid login credentials")) {
        setError("E-mailadres of wachtwoord klopt niet. Wachtwoord kwijt? Vraag hieronder een herstel-link aan.");
      } else if (mode === "signup" && message.toLowerCase().includes("already")) {
        setError("Dit e-mailadres heeft waarschijnlijk al een account. Kies Bestaand account om veilig verder te gaan.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="icon-button close-button" onClick={onClose} aria-label="Sluiten">
          x
        </button>
        <img src="/lhc-seal.svg" alt="" className="dialog-logo" />
        <h2 id="auth-title">Inloggen of account maken</h2>
        <p>
          Begin met het e-mailadres waarmee je eerder bent aangemeld. Profielen blijven aan dat adres
          gekoppeld; maak alleen een nieuw account als je bent toegelaten of een uitnodiging hebt.
        </p>

        <div className="auth-guide" aria-label="Welke keuze past bij mij?">
          {AUTH_GUIDE_ITEMS.map(([title, text]) => (
            <article key={title}>
              <strong>{title}</strong>
              <span>{text}</span>
            </article>
          ))}
        </div>

        <div className="segmented-control" role="tablist" aria-label="Inlogmethode">
          {AUTH_MODES.map(({ id, label, hint }) => (
            <button
              key={id}
              type="button"
              className={mode === id ? "active" : ""}
              onClick={() => {
                setMode(id);
                setError("");
                setStatus("");
                if (id !== "signup") setPrivacyAccepted(false);
              }}
            >
              <span>{label}</span>
              <small>{hint}</small>
            </button>
          ))}
        </div>

        <div className="auth-mode-note">
          <h3>{activeAuthMode.title}</h3>
          <p>{activeAuthMode.text}</p>
        </div>

        <form onSubmit={submit} className="auth-form">
          <label>
            E-mailadres
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="jouw@email.nl"
              autoComplete="email"
            />
          </label>
          {mode !== "link" && (
            <label>
              Wachtwoord
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="Minimaal 6 tekens"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </label>
          )}
          {mode === "signup" && (
            <label>
              Uitnodigingscode
              <input
                value={inviteCode}
                onChange={(event) => setInviteCode(event.target.value)}
                type="text"
                placeholder="Bijvoorbeeld LHC-..."
                autoComplete="one-time-code"
                autoCapitalize="characters"
                spellCheck="false"
              />
            </label>
          )}

          {mode === "signup" && (
            <div className="auth-waitlist-panel">
              <strong>Nog geen uitnodigingscode?</strong>
              <span>Schrijf je eerst in voor de wachtlijst. Dat maakt nog geen account aan.</span>
              <button className="secondary-button wide" type="button" onClick={onWaitlist}>
                Naar wachtlijst
              </button>
            </div>
          )}

          {needsPrivacyConsent && (
            <div className="check-row">
              <input
                id="auth-privacy-accepted"
                type="checkbox"
                checked={privacyAccepted}
                onChange={(event) => setPrivacyAccepted(event.target.checked)}
              />
              <label htmlFor="auth-privacy-accepted">
                Ik ga akkoord met de verwerking van mijn accountgegevens en de{" "}
                <button className="inline-link" type="button" onClick={onPrivacy}>
                  privacyverklaring
                </button>
                .
              </label>
            </div>
          )}

          {error && <p className="form-message error">{error}</p>}
          {status && <p className="form-message success">{status}</p>}

          {showEmailHelp && (
            <div className="auth-email-help">
              <strong>Geen mail ontvangen?</strong>
              <span>
                Wacht een paar minuten en check ook spam of reclame. Komt er niets binnen, stuur ons
                dan vanaf hetzelfde e-mailadres een bericht zodat we je account kunnen controleren.
              </span>
              <a className="secondary-button wide" href={authHelpMailto(normalizedEmail, activeAuthMode.label)}>
                Vraag hulp met toegang
              </a>
            </div>
          )}

          {mode === "login" && (
            <div className="auth-recovery-panel">
              <strong>Wachtwoord kwijt?</strong>
              <span>Alleen voor bestaande accounts: stuur jezelf een veilige herstel-link.</span>
              <button
                className="secondary-button wide"
                disabled={resetLoading || loading}
                type="button"
                onClick={requestPasswordReset}
              >
                {resetLoading ? "Link wordt gestuurd" : "Stuur herstel-link"}
              </button>
            </div>
          )}

          <button className="primary-button wide" disabled={loading} type="submit">
            {loading ? "Even wachten" : activeAuthMode.submit}
          </button>
          {canResendConfirmation && (
            <button
              className="secondary-button wide"
              disabled={resendLoading || loading}
              type="button"
              onClick={resendConfirmation}
            >
              {resendLoading ? "Opnieuw sturen" : "Bevestigingsmail opnieuw sturen"}
            </button>
          )}
          <button className="text-button" type="button" onClick={onDemo}>
            Bekijk eerst de demo
          </button>
        </form>
      </section>
    </div>
  );
}

function PasswordResetDialog({ onClose }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");

    if (password.length < 6) {
      setError("Gebruik minimaal 6 tekens voor je nieuwe wachtwoord.");
      return;
    }
    if (password !== confirmPassword) {
      setError("De twee wachtwoorden zijn niet gelijk.");
      return;
    }
    if (!hasSupabaseConfig || !supabase) {
      setError("Supabase is nog niet gekoppeld.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setPassword("");
      setConfirmPassword("");
      setStatus("Wachtwoord opgeslagen. Je bent ingelogd en kunt verder met je profiel.");
    } catch (err) {
      const message = err.message || "Wachtwoord opslaan lukte niet.";
      if (message.toLowerCase().includes("session")) {
        setError("Deze herstel-link is verlopen. Vraag via Inloggen > Wachtwoord een nieuwe link aan.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="password-reset-title">
        <button className="icon-button close-button" onClick={onClose} aria-label="Sluiten">
          x
        </button>
        <img src="/lhc-seal.svg" alt="" className="dialog-logo" />
        <h2 id="password-reset-title">Nieuw wachtwoord instellen</h2>
        <p>
          Kies een nieuw wachtwoord voor je Lonely Hearts Club account. Daarna blijf je ingelogd en kun
          je direct verder.
        </p>

        <form onSubmit={submit} className="auth-form">
          <label>
            Nieuw wachtwoord
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="Minimaal 6 tekens"
              autoComplete="new-password"
            />
          </label>
          <label>
            Herhaal wachtwoord
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              placeholder="Nog een keer"
              autoComplete="new-password"
            />
          </label>

          {error && <p className="form-message error">{error}</p>}
          {status && <p className="form-message success">{status}</p>}

          <button className="primary-button wide" disabled={loading} type="submit">
            {loading ? "Opslaan" : "Sla wachtwoord op"}
          </button>
          {status && (
            <button className="text-button" type="button" onClick={onClose}>
              Verder naar mijn profiel
            </button>
          )}
        </form>
      </section>
    </div>
  );
}

function ProductApp({ user, initialProfile = null, demoMode = false, onLogout, onPrivacy }) {
  const [activeTab, setActiveTab] = useState(() => (!demoMode && getAdminModeRequested() ? "admin" : "discover"));
  const [profile, setProfile] = useState(initialProfile ? normalizeProfile(initialProfile) : null);
  const [needsProfile, setNeedsProfile] = useState(!initialProfile);
  const [profiles, setProfiles] = useState(demoMode ? DEMO_PROFILES.map(normalizeProfile) : []);
  const [matches, setMatches] = useState(demoMode ? DEMO_MATCHES : []);
  const [matchProfiles, setMatchProfiles] = useState(
    demoMode ? Object.fromEntries(DEMO_PROFILES.map((item) => [item.id, normalizeProfile(item)])) : {},
  );
  const [interestedIds, setInterestedIds] = useState(new Set());
  const [blockedIds, setBlockedIds] = useState(new Set());
  const [reportedIds, setReportedIds] = useState(new Set());
  const [selectedMatchId, setSelectedMatchId] = useState(demoMode ? DEMO_MATCHES[0]?.id ?? null : null);
  const [messages, setMessages] = useState(demoMode ? DEMO_MESSAGES : {});
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(!demoMode);
  const [journeyStep, setJourneyStep] = useState("discover");
  const showAdminTab = !demoMode && (isConfiguredAdminEmail(user.email) || getAdminModeRequested());
  const appTabs = useMemo(() => (showAdminTab ? [...tabs, ADMIN_TAB] : tabs), [showAdminTab]);

  const visibleMatches = useMemo(
    () => matches.filter((match) => !blockedIds.has(getOtherUserId(match, user.id))),
    [blockedIds, matches, user.id],
  );
  const selectedMatch = visibleMatches.find((match) => match.id === selectedMatchId) ?? visibleMatches[0] ?? null;
  const selectedOther = selectedMatch ? matchProfiles[getOtherUserId(selectedMatch, user.id)] : null;

  const unmatchedProfiles = useMemo(() => {
    const matchedIds = new Set(matches.map((match) => getOtherUserId(match, user.id)));
    return profiles.filter((item) => item.id !== user.id && !matchedIds.has(item.id) && !blockedIds.has(item.id));
  }, [blockedIds, matches, profiles, user.id]);

  const suggestedProfiles = useMemo(() => {
    if (profile?.actief === false) return [];
    return unmatchedProfiles
      .map((item) => ({ ...item, matchScore: scoreMatch(profile, item) }))
      .filter((item) => item.matchScore.score > 0)
      .sort(
        (a, b) =>
          b.matchScore.score - a.matchScore.score ||
          profileCompletenessScore(b) - profileCompletenessScore(a) ||
          String(a.naam || "").localeCompare(String(b.naam || "")),
      );
  }, [profile, unmatchedProfiles]);

  const hiddenByPreferenceCount = Math.max(unmatchedProfiles.length - suggestedProfiles.length, 0);
  const suggestedProfileName = suggestedProfiles[0]?.naam ?? "het eerste profiel";
  const selectedMatchMessages = selectedMatch ? messages[selectedMatch.id] ?? [] : [];
  const selectedMatchHasMyReply = selectedMatchMessages.some((message) => message.sender_id === user.id);

  const loadData = async () => {
    if (demoMode || !hasSupabaseConfig || !supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setNotice("");
    try {
      const { data: myProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      const normalizedMine = normalizeProfile(myProfile);
      setProfile(normalizedMine);
      setNeedsProfile(!normalizedMine);

      const { data: profileRows, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id)
        .eq("actief", true)
        .limit(80);

      if (profilesError) throw profilesError;
      setProfiles((profileRows ?? []).map(normalizeProfile));

      const { data: interests, error: interestsError } = await supabase
        .from("interests")
        .select("to_user")
        .eq("from_user", user.id);

      if (interestsError) throw interestsError;
      setInterestedIds(new Set((interests ?? []).map((item) => item.to_user)));

      const { data: blockRows, error: blocksError } = await supabase
        .from("blocks")
        .select("blocked_id")
        .eq("blocker_id", user.id);
      if (blocksError && !isMissingSafetyTableError(blocksError)) throw blocksError;
      setBlockedIds(new Set((blockRows ?? []).map((item) => item.blocked_id).filter(Boolean)));

      const { data: reportRows, error: reportsError } = await supabase
        .from("reports")
        .select("reported_id")
        .eq("reporter_id", user.id);
      if (reportsError && !isMissingSafetyTableError(reportsError)) throw reportsError;
      setReportedIds(new Set((reportRows ?? []).map((item) => item.reported_id).filter(Boolean)));

      const { data: matchRows, error: matchesError } = await supabase
        .from("matches")
        .select("*")
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (matchesError) throw matchesError;
      const nextMatches = matchRows ?? [];
      setMatches(nextMatches);
      setSelectedMatchId((current) => current ?? nextMatches[0]?.id ?? null);

      const otherIds = [...new Set(nextMatches.map((match) => getOtherUserId(match, user.id)))];
      if (otherIds.length > 0) {
        const { data: others, error: othersError } = await supabase
          .from("profiles")
          .select("*")
          .in("id", otherIds);
        if (othersError) throw othersError;
        setMatchProfiles(Object.fromEntries((others ?? []).map((item) => [item.id, normalizeProfile(item)])));
      } else {
        setMatchProfiles({});
      }
    } catch (err) {
      setNotice(err.message || "Data laden lukte niet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [demoMode, user.id]);

  useEffect(() => {
    if (!selectedMatch || demoMode || !hasSupabaseConfig || !supabase) return;

    let active = true;
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", selectedMatch.id)
        .order("created_at", { ascending: true });
      if (!active) return;
      if (error) {
        setNotice(error.message);
      } else {
        setMessages((current) => ({ ...current, [selectedMatch.id]: data ?? [] }));
      }
    };

    loadMessages();

    const channel = supabase
      .channel(`messages:${selectedMatch.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${selectedMatch.id}`,
        },
        (payload) => {
          setMessages((current) => ({
            ...current,
            [selectedMatch.id]: [...(current[selectedMatch.id] ?? []), payload.new],
          }));
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [demoMode, selectedMatch?.id]);

  const handleProfileSaved = (savedProfile) => {
    setProfile(normalizeProfile(savedProfile));
    setNeedsProfile(false);
    setActiveTab("discover");
    loadData().then(() => {
      setNotice("Profiel opgeslagen. Je ziet nu alleen leden die wederzijds bij je voorkeur passen.");
    });
  };

  const toggleProfileActive = async (nextActive) => {
    if (!profile) return;

    const nextProfile = normalizeProfile({ ...profile, actief: nextActive });

    if (demoMode) {
      setProfile(nextProfile);
      setNotice(nextActive ? "Demo-profiel is weer actief." : "Demo-profiel is gepauzeerd en wordt niet getoond.");
      return;
    }

    if (!hasSupabaseConfig || !supabase) {
      setNotice("Supabase is nog niet gekoppeld.");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ actief: nextActive })
      .eq("id", user.id)
      .select("*")
      .maybeSingle();

    if (error) {
      setNotice(error.message || "Profielstatus aanpassen lukte niet.");
      return;
    }

    setProfile(normalizeProfile(data ?? nextProfile));
    setNotice(nextActive ? "Je profiel is weer actief." : "Je profiel is gepauzeerd en wordt niet getoond aan anderen.");
  };

  const likeProfile = async (targetProfile) => {
    if (demoMode) {
      const matchId = `demo-match-${targetProfile.id}`;
      const createdAt = new Date().toISOString();
      const otherProfile = normalizeProfile(targetProfile);
      const firstMessage = {
        id: `${matchId}-intro`,
        match_id: matchId,
        sender_id: targetProfile.id,
        content: `Hoi ${profile?.voornaam || "Marcel"}, jouw verhaal voelt rustig en oprecht. Zullen we eerst even chatten?`,
        created_at: createdAt,
      };

      setInterestedIds((current) => new Set([...current, targetProfile.id]));
      setMatches((current) => {
        if (current.some((match) => match.id === matchId)) return current;
        return [{ id: matchId, user_a: user.id, user_b: targetProfile.id, created_at: createdAt }, ...current];
      });
      setMatchProfiles((current) => ({ ...current, [targetProfile.id]: otherProfile }));
      setMessages((current) => (current[matchId] ? current : { ...current, [matchId]: [firstMessage] }));
      setSelectedMatchId(matchId);
      setActiveTab("messages");
      setJourneyStep("messages");
      setNotice(`Match met ${targetProfile.naam} gestart. Reageer op het bericht en ga daarna door naar anoniem bellen.`);
      return;
    }

    if (!profile) {
      setNeedsProfile(true);
      return;
    }

    const { error } = await supabase.from("interests").insert({
      from_user: user.id,
      to_user: targetProfile.id,
    });

    if (error && error.code !== "23505") {
      setNotice(error.message);
      return;
    }

    setInterestedIds((current) => new Set([...current, targetProfile.id]));
    setNotice(`Interesse verstuurd naar ${targetProfile.naam}. Bij wederzijdse interesse verschijnt de match hier.`);
    await loadData();
  };

  const blockProfile = async (targetProfile) => {
    if (!targetProfile?.id || targetProfile.id === user.id) return;

    if (demoMode) {
      setBlockedIds((current) => new Set([...current, targetProfile.id]));
      setNotice(`${targetProfile.naam} is verborgen in de demo.`);
      return;
    }

    if (!hasSupabaseConfig || !supabase) {
      setNotice("Supabase is nog niet gekoppeld.");
      return;
    }

    const { error } = await supabase.from("blocks").insert({
      blocker_id: user.id,
      blocked_id: targetProfile.id,
    });

    if (error && error.code !== "23505") {
      setNotice(
        isMissingSafetyTableError(error)
          ? "Run eerst de nieuwste schema.sql in Supabase om blokkeren en rapporteren te activeren."
          : error.message,
      );
      return;
    }

    setBlockedIds((current) => new Set([...current, targetProfile.id]));
    setNotice(`${targetProfile.naam} is verborgen. Je ziet dit profiel niet meer in Ontdek of Matches.`);
  };

  const reportProfile = async (targetProfile, reason, details = "") => {
    if (!targetProfile?.id || targetProfile.id === user.id) return false;

    if (demoMode) {
      setReportedIds((current) => new Set([...current, targetProfile.id]));
      setNotice(`Demo-rapportage voor ${targetProfile.naam} opgeslagen.`);
      return true;
    }

    if (!hasSupabaseConfig || !supabase) {
      setNotice("Supabase is nog niet gekoppeld.");
      return false;
    }

    const { error } = await supabase.from("reports").insert({
      reporter_id: user.id,
      reported_id: targetProfile.id,
      reason,
      details: details.trim() || null,
      status: "open",
    });

    if (error && error.code === "23505") {
      setReportedIds((current) => new Set([...current, targetProfile.id]));
      setNotice(`Je rapportage over ${targetProfile.naam} stond al opgeslagen.`);
      return true;
    }

    if (error) {
      setNotice(
        isMissingSafetyTableError(error)
          ? "Run eerst de nieuwste schema.sql in Supabase om blokkeren en rapporteren te activeren."
          : error.message,
      );
      return false;
    }

    setReportedIds((current) => new Set([...current, targetProfile.id]));
    setNotice(`Rapportage over ${targetProfile.naam} is opgeslagen.`);
    return true;
  };

  const sendMessage = async (content) => {
    if (!selectedMatch || !content.trim()) return;

    if (demoMode) {
      const now = Date.now();
      const message = {
        id: `demo-message-${Date.now()}`,
        match_id: selectedMatch.id,
        sender_id: user.id,
        content: content.trim(),
        created_at: new Date(now).toISOString(),
      };
      const reply = {
        id: `demo-reply-${now}`,
        match_id: selectedMatch.id,
        sender_id: getOtherUserId(selectedMatch, user.id),
        content: "Fijn bericht. Als dit zo blijft voelen, wil ik eerst anoniem bellen voordat we iets afspreken.",
        created_at: new Date(now + 45_000).toISOString(),
      };
      setMessages((current) => ({
        ...current,
        [selectedMatch.id]: [...(current[selectedMatch.id] ?? []), message, reply],
      }));
      setJourneyStep("call");
      setNotice("Chat werkt. Volgende stap: start het anonieme belmoment vanuit dit gesprek.");
      return;
    }

    const { error } = await supabase.from("messages").insert({
      match_id: selectedMatch.id,
      sender_id: user.id,
      content: content.trim(),
    });
    if (error) setNotice(error.message);
  };

  if (needsProfile) {
    return (
      <Onboarding
        user={user}
        onSaved={handleProfileSaved}
        demoMode={demoMode}
        onLogout={onLogout}
        onPrivacy={onPrivacy}
      />
    );
  }

  return (
    <main className="app-shell">
      <aside className="app-sidebar">
        <div className="app-brand">
          <img src="/lhc-seal.svg" alt="" />
          <div>
            <strong>Lonely Hearts Club</strong>
            <span>{demoMode ? "Demo omgeving" : "Live omgeving"}</span>
          </div>
        </div>

        <nav className="app-tabs" aria-label="App navigatie">
          {appTabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => {
                setActiveTab(tab.id);
                if (demoMode && ["discover", "matches", "messages"].includes(tab.id)) {
                  setJourneyStep(tab.id);
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <button className="text-button align-left sidebar-link" type="button" onClick={onPrivacy}>
          Privacy & gegevens
        </button>

        <button className="secondary-button wide" onClick={onLogout}>
          {demoMode ? "Demo sluiten" : "Uitloggen"}
        </button>
      </aside>

      <section className="app-main">
        <AppHeader profile={profile} notice={notice} onRefresh={loadData} loading={loading} />

        {demoMode && (
          <DemoJourney
            activeStep={journeyStep}
            suggestedCount={suggestedProfiles.length}
            suggestedProfileName={suggestedProfileName}
            matchCount={visibleMatches.length}
            onCreateDemoMatch={() => suggestedProfiles[0] && likeProfile(suggestedProfiles[0])}
            onOpenChat={() => {
              if (selectedMatch) {
                setActiveTab("messages");
                setJourneyStep("messages");
              }
            }}
          />
        )}

        {activeTab !== "admin" && (
          <NextStepPanel
            activeTab={activeTab}
            demoMode={demoMode}
            profile={profile}
            suggestedCount={suggestedProfiles.length}
            suggestedProfileName={suggestedProfileName}
            hiddenByPreferenceCount={hiddenByPreferenceCount}
            matchCount={visibleMatches.length}
            hasSelectedMatch={Boolean(selectedMatch)}
            selectedMatchHasMessages={selectedMatchMessages.length > 0}
            selectedMatchHasMyReply={selectedMatchHasMyReply}
            onNavigate={(tabId) => {
              setActiveTab(tabId);
              if (demoMode && ["discover", "matches", "messages"].includes(tabId)) setJourneyStep(tabId);
            }}
            onCreateDemoMatch={() => suggestedProfiles[0] && likeProfile(suggestedProfiles[0])}
          />
        )}

        {activeTab === "discover" && (
          <DiscoverView
            profiles={suggestedProfiles}
            interestedIds={interestedIds}
            reportedIds={reportedIds}
            onLike={likeProfile}
            onBlock={blockProfile}
            onReport={reportProfile}
            loading={loading}
            viewerProfile={profile}
            hiddenByPreferenceCount={hiddenByPreferenceCount}
            profilePaused={profile?.actief === false}
            demoMode={demoMode}
            onOpenProfile={() => setActiveTab("profile")}
            onCreateDemoMatch={() => suggestedProfiles[0] && likeProfile(suggestedProfiles[0])}
          />
        )}

        {activeTab === "matches" && (
          <MatchesView
            matches={visibleMatches}
            matchProfiles={matchProfiles}
            userId={user.id}
            selectedMatchId={selectedMatchId}
            demoMode={demoMode}
            onSelect={(matchId) => {
              setSelectedMatchId(matchId);
              setActiveTab("messages");
              if (demoMode) setJourneyStep("messages");
            }}
            onOpenDiscover={() => {
              setActiveTab("discover");
              if (demoMode) setJourneyStep("discover");
            }}
          />
        )}

        {activeTab === "messages" && (
          <MessagesView
            match={selectedMatch}
            otherProfile={selectedOther}
            messages={selectedMatch ? messages[selectedMatch.id] ?? [] : []}
            userId={user.id}
            onSend={sendMessage}
            onBlock={blockProfile}
            onReport={reportProfile}
            reportedIds={reportedIds}
            demoMode={demoMode}
            onJourneyStep={setJourneyStep}
            onOpenDiscover={() => {
              setActiveTab("discover");
              if (demoMode) setJourneyStep("discover");
            }}
          />
        )}

        {activeTab === "profile" && (
          <ProfileView
            profile={profile}
            user={user}
            onSaved={handleProfileSaved}
            demoMode={demoMode}
            onPrivacy={onPrivacy}
            onToggleActive={toggleProfileActive}
          />
        )}

        {activeTab === "admin" && showAdminTab && <AdminLaunchStatus />}
      </section>
    </main>
  );
}

function AppHeader({ profile, notice, onRefresh, loading }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Dashboard</p>
        <h1>Welkom{profile?.voornaam ? `, ${profile.voornaam}` : ""}</h1>
      </div>
      <div className="header-actions">
        {notice && <span className="notice-pill">{notice}</span>}
        <button className="secondary-button" onClick={onRefresh} disabled={loading}>
          {loading ? "Laden" : "Verversen"}
        </button>
      </div>
    </header>
  );
}

const ADMIN_COUNT_CARDS = [
  ["waitlist", "Wachtlijst"],
  ["auth_users", "Accounts"],
  ["confirmed_users", "Bevestigd"],
  ["profiles", "Profielen"],
  ["active_profiles", "Actief"],
  ["complete_profiles", "Compleet"],
  ["invite_codes_active", "Codes actief"],
  ["invite_redemptions", "Codes gebruikt"],
  ["matches", "Matches"],
  ["messages", "Berichten"],
  ["open_reports", "Open rapporten"],
  ["analytics_7d", "Events 7 dagen"],
];

const LAUNCH_TARGETS = [
  {
    key: "waitlist",
    label: "Wachtlijst",
    target: 20,
    detail: "Genoeg mensen om de eerste uitnodigingen gecontroleerd te versturen.",
  },
  {
    key: "confirmed_users",
    label: "Bevestigde accounts",
    target: 4,
    detail: "Minimaal twee testkoppels om registratie, login en e-mail te bewijzen.",
  },
  {
    key: "complete_profiles",
    label: "Complete profielen",
    target: 4,
    detail: "Voldoende echte profielen om matching en voorkeuren te beoordelen.",
  },
  {
    key: "matches",
    label: "Matches",
    target: 2,
    detail: "Bewijs dat wederzijdse interesse en matchvorming werkt.",
  },
  {
    key: "messages",
    label: "Berichten",
    target: 6,
    detail: "Bewijs dat de route na een match natuurlijk naar chat gaat.",
  },
];

function getCount(counts, key) {
  const value = Number(counts?.[key] ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function getTargetProgress(counts, key, target) {
  const value = getCount(counts, key);
  const percentage = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 100;
  return { value, percentage, complete: value >= target };
}

function getLaunchPhase(counts, warnings = []) {
  const waitlist = getCount(counts, "waitlist");
  const confirmedUsers = getCount(counts, "confirmed_users");
  const completeProfiles = getCount(counts, "complete_profiles");
  const matches = getCount(counts, "matches");
  const messages = getCount(counts, "messages");
  const openReports = getCount(counts, "open_reports");

  if (openReports > 0 || warnings.length > 0) {
    return {
      label: "Aandacht nodig",
      state: "attention",
      detail: "Los rapportages of schemawaarschuwingen op voordat je nieuwe leden actief uitnodigt.",
      next: "Veiligheid en database-status eerst glad trekken.",
    };
  }
  if (confirmedUsers < 2 || completeProfiles < 2) {
    return {
      label: "Technische testfase",
      state: "manual",
      detail: "Maak minimaal twee accounts met volledige profielen om registratie, matching en login hard te testen.",
      next: "Twee testaccounts maken en de hele route doorlopen.",
    };
  }
  if (matches < 1 || messages < 2) {
    return {
      label: "Route-test",
      state: "manual",
      detail: "De basis staat, maar match en chat moeten nog zichtbaar bewezen worden met echte accounts.",
      next: "Wederzijdse interesse maken, chatten en daarna bellen testen.",
    };
  }
  if (waitlist < 20) {
    return {
      label: "Pre-launch",
      state: "ok",
      detail: "De productroute is klaar om gecontroleerd verkeer te ontvangen.",
      next: "Wachtlijst naar 20 serieuze inschrijvingen brengen.",
    };
  }
  return {
    label: "Eerste ledenronde klaar",
    state: "ok",
    detail: "Er is genoeg tractie om de eerste uitnodigingen gefaseerd te versturen.",
    next: "Nodig 5 tot 10 mensen uit en meet waar ze vastlopen.",
  };
}

function getAdminActionPlan(counts, warnings = []) {
  const openReports = getCount(counts, "open_reports");
  const confirmedUsers = getCount(counts, "confirmed_users");
  const completeProfiles = getCount(counts, "complete_profiles");
  const matches = getCount(counts, "matches");
  const messages = getCount(counts, "messages");
  const waitlist = getCount(counts, "waitlist");
  const actions = [];

  if (openReports > 0 || warnings.length > 0) {
    actions.push({
      label: "Los blokkades op",
      detail: "Bekijk open rapportages en waarschuwingen voordat je nieuwe leden uitnodigt.",
      state: "attention",
    });
  }
  if (confirmedUsers < 2) {
    actions.push({
      label: "Maak twee testaccounts",
      detail: "Gebruik twee verschillende e-mailadressen en bevestig beide accounts via de live site.",
      state: "manual",
    });
  }
  if (completeProfiles < 2) {
    actions.push({
      label: "Vul twee echte profielen",
      detail: "Zorg dat geslacht, zoekvoorkeur, verhaal en passies compleet zijn, anders kan matching niet overtuigen.",
      state: "manual",
    });
  }
  if (matches < 1) {
    actions.push({
      label: "Maak een wederzijdse match",
      detail: "Laat beide accounts interesse tonen, controleer of de match verschijnt en of de chat opent.",
      state: "manual",
    });
  }
  if (messages < 2) {
    actions.push({
      label: "Test de chat",
      detail: "Stuur berichten vanaf beide kanten. Daarna hoort anoniem bellen pas logisch te voelen.",
      state: "manual",
    });
  }
  if (waitlist < 20) {
    actions.push({
      label: "Breng wachtlijst naar 20",
      detail: "Deel de live wachtlijstlink met een kleine, relevante groep. Liever 20 goede testers dan 200 vage kliks.",
      state: "ok",
    });
  }

  return actions.slice(0, 4);
}

function AdminLaunchStatus() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStatus = async () => {
    setLoading(true);
    setError("");

    if (!hasSupabaseConfig || !supabase) {
      setError("Supabase is nog niet gekoppeld.");
      setLoading(false);
      return;
    }

    const { data, error: rpcError } = await supabase.rpc("admin_launch_status");
    if (rpcError) {
      setError(
        rpcError.message?.includes("admin_launch_status")
          ? "Run eerst schema.sql en daarna LIVE_SETUP.sql in Supabase."
          : rpcError.message || "Live status ophalen lukte niet.",
      );
      setReport(null);
    } else {
      setReport(data ?? null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const counts = report?.counts ?? {};
  const warnings = Array.isArray(report?.warnings) ? report.warnings : [];
  const launchPhase = getLaunchPhase(counts, warnings);
  const actionPlan = getAdminActionPlan(counts, warnings);
  const liveReadyChecks = [
    {
      label: "Registratiebasis",
      state: getCount(counts, "confirmed_users") > 0 ? "ok" : "attention",
      detail:
        getCount(counts, "confirmed_users") > 0
          ? "Er zijn bevestigde accounts."
          : "Nog geen bevestigde accounts gemeten.",
    },
    {
      label: "Wachtlijst",
      state: getCount(counts, "waitlist") > 0 ? "ok" : "attention",
      detail:
        getCount(counts, "waitlist") > 0
          ? "Nieuwe interesse wordt opgeslagen."
          : "Nog geen wachtlijst-inschrijvingen zichtbaar.",
    },
    {
      label: "Profielen",
      state: getCount(counts, "complete_profiles") >= 2 ? "ok" : "attention",
      detail:
        getCount(counts, "complete_profiles") >= 2
          ? "Er zijn genoeg complete profielen voor matchingtests."
          : "Maak of behoud minimaal twee complete testprofielen.",
    },
    {
      label: "Veiligheid",
      state: getCount(counts, "open_reports") === 0 ? "ok" : "attention",
      detail:
        getCount(counts, "open_reports") === 0
          ? "Geen open rapportages."
          : "Er staan rapportages open voor opvolging.",
    },
    {
      label: "SMTP",
      state: "manual",
      detail: "Controleer in Supabase of custom SMTP met SPF/DKIM/DMARC actief is.",
    },
  ];

  return (
    <section className="content-section admin-status">
      <div className="section-heading admin-heading">
        <div>
          <p className="eyebrow">Live status</p>
          <h2>Launch cockpit.</h2>
          <p>
            Operationeel overzicht voor registratie, profielen, matching, veiligheid en zichtbaarheid.
            Aantallen komen uit Supabase en e-mailadressen worden gemaskeerd.
          </p>
        </div>
        <button className="secondary-button" type="button" onClick={loadStatus} disabled={loading}>
          {loading ? "Laden" : "Verversen"}
        </button>
      </div>

      {error && (
        <div className="admin-warning">
          <strong>Status nog niet actief</strong>
          <span>{error}</span>
          <span>
            Niet-destructief: `schema.sql` maakt de tabellen/functies; `LIVE_SETUP.sql` zet adminrechten en de eerste invitecode klaar.
          </span>
        </div>
      )}

      {!error && report && (
        <>
          <div className={classNames("admin-launch-summary", launchPhase.state)}>
            <div>
              <span>Eerste ledenronde</span>
              <strong>{launchPhase.label}</strong>
              <p>{launchPhase.detail}</p>
            </div>
            <div>
              <span>Volgende stap</span>
              <p>{launchPhase.next}</p>
            </div>
          </div>

          <div className="admin-count-grid">
            {ADMIN_COUNT_CARDS.map(([key, label]) => (
              <article key={key} className="admin-count-card">
                <span>{label}</span>
                <strong>{getCount(counts, key)}</strong>
              </article>
            ))}
          </div>

          <div className="admin-target-grid">
            {LAUNCH_TARGETS.map((target) => {
              const progress = getTargetProgress(counts, target.key, target.target);
              return (
                <article key={target.key} className={classNames("admin-target-card", progress.complete && "complete")}>
                  <div>
                    <span>{target.label}</span>
                    <strong>
                      {progress.value}/{target.target}
                    </strong>
                  </div>
                  <div className="admin-progress-bar" aria-label={`${target.label} ${progress.percentage} procent`}>
                    <span style={{ width: `${progress.percentage}%` }} />
                  </div>
                  <p>{target.detail}</p>
                </article>
              );
            })}
          </div>

          <div className="admin-readiness-grid">
            {liveReadyChecks.map((item) => (
              <article key={item.label} className={classNames("admin-readiness-card", item.state)}>
                <span>{item.label}</span>
                <strong>{item.state === "ok" ? "OK" : item.state === "manual" ? "Check" : "Aandacht"}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>

          {warnings.length > 0 && (
            <div className="admin-warning">
              <strong>Waarschuwingen</strong>
              <ul>
                {warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {actionPlan.length > 0 && (
            <div className="admin-action-plan">
              <div>
                <p className="eyebrow">Actieplan</p>
                <h3>Wat nu eerst?</h3>
              </div>
              <ol>
                {actionPlan.map((action) => (
                  <li key={action.label} className={action.state}>
                    <strong>{action.label}</strong>
                    <span>{action.detail}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="admin-recent-grid">
            <AdminRecentList title="Recente wachtlijst" rows={report.recent?.waitlist} empty="Nog geen wachtlijst." />
            <AdminRecentList title="Recente accounts" rows={report.recent?.users} empty="Nog geen accounts." />
            <AdminRecentList title="Recente profielen" rows={report.recent?.profiles} empty="Nog geen profielen." />
            <AdminRecentList title="Rapportages" rows={report.recent?.reports} empty="Geen rapportages." />
          </div>

          <p className="admin-updated">Bijgewerkt: {formatDateTime(report.generated_at)}</p>
        </>
      )}
    </section>
  );
}

function AdminRecentList({ title, rows = [], empty }) {
  const safeRows = Array.isArray(rows) ? rows : [];

  return (
    <article className="admin-recent-card">
      <h3>{title}</h3>
      {safeRows.length === 0 ? (
        <p>{empty}</p>
      ) : (
        <ul>
          {safeRows.map((row, index) => {
            const main = row.email || row.naam || row.reason || "Onbekend";
            const meta = [
              row.confirmed === true ? "bevestigd" : row.confirmed === false ? "niet bevestigd" : "",
              row.has_profile === true ? "profiel" : row.has_profile === false ? "geen profiel" : "",
              row.actief === true ? "actief" : row.actief === false ? "gepauzeerd" : "",
              row.status || "",
            ]
              .filter(Boolean)
              .join(" · ");

            return (
              <li key={`${main}-${row.created_at || index}`}>
                <strong>{main}</strong>
                <span>{meta || formatDateTime(row.created_at || row.last_sign_in_at)}</span>
                {(row.created_at || row.last_sign_in_at) && <small>{formatDateTime(row.created_at || row.last_sign_in_at)}</small>}
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}

function DemoJourney({
  activeStep,
  suggestedCount = 0,
  suggestedProfileName = "het eerste profiel",
  matchCount = 0,
  onCreateDemoMatch,
  onOpenChat,
}) {
  const flow = [
    ["discover", "Match zoeken"],
    ["matches", "Match kiezen"],
    ["messages", "Chatten"],
    ["call", "Anoniem bellen"],
    ["meet", "Afspreken"],
  ];
  const activeIndex = Math.max(
    flow.findIndex(([id]) => id === activeStep),
    0,
  );

  return (
    <section className="demo-journey" aria-label="Demo route">
      <div>
        <p className="eyebrow">Demo-route</p>
        <h2>Test de echte route in een paar minuten.</h2>
        <p>Begin met een passend profiel, reageer in de chat, open daarna het anonieme belmoment en rond af met een afspraakvoorstel.</p>
      </div>
      <div className="journey-side">
        <div className="journey-steps">
          {flow.map(([id, label], index) => (
            <span
              key={id}
              className={classNames(index === activeIndex && "active", index < activeIndex && "complete")}
            >
              {index + 1}. {label}
            </span>
          ))}
        </div>
        <div className="journey-actions">
          {suggestedCount > 0 && matchCount === 0 && (
            <button className="secondary-button" type="button" onClick={onCreateDemoMatch}>
              Start match met {suggestedProfileName}
            </button>
          )}
          {matchCount > 0 && (
            <button className="secondary-button" type="button" onClick={onOpenChat}>
              Open gesprek
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function NextStepPanel({
  activeTab,
  demoMode,
  profile,
  suggestedCount,
  suggestedProfileName = "het eerste profiel",
  hiddenByPreferenceCount,
  matchCount,
  hasSelectedMatch,
  selectedMatchHasMessages,
  selectedMatchHasMyReply,
  onNavigate,
  onCreateDemoMatch,
}) {
  if (profile?.actief === false) {
    return (
      <section className="next-step-panel">
        <div>
          <p className="eyebrow">Volgende stap</p>
          <h2>Je profiel staat gepauzeerd.</h2>
          <p>Maak je profiel weer actief als je gevonden wilt worden en passende leden wilt zien.</p>
        </div>
        <button className="secondary-button" type="button" onClick={() => onNavigate("profile")}>
          Naar profiel
        </button>
      </section>
    );
  }

  if (demoMode && suggestedCount > 0 && activeTab === "discover") {
    return (
      <section className="next-step-panel">
        <div>
          <p className="eyebrow">Volgende stap</p>
          <h2>Kies bewust interesse.</h2>
          <p>
            Dit is geen swipe-stapel. Kies een passend profiel; daarna zie je match, chat en
            anoniem bellen.
          </p>
        </div>
        <button className="primary-button" type="button" onClick={onCreateDemoMatch}>
          Start met {suggestedProfileName}
        </button>
      </section>
    );
  }

  if (matchCount > 0 && !hasSelectedMatch) {
    return (
      <section className="next-step-panel">
        <div>
          <p className="eyebrow">Volgende stap</p>
          <h2>Kies een match om te chatten.</h2>
          <p>Een match is pas nuttig als er daarna een echt gesprek begint.</p>
        </div>
        <button className="secondary-button" type="button" onClick={() => onNavigate("matches")}>
          Naar matches
        </button>
      </section>
    );
  }

  if (hasSelectedMatch && !selectedMatchHasMessages) {
    return (
      <section className="next-step-panel">
        <div>
          <p className="eyebrow">Volgende stap</p>
          <h2>Stuur het eerste bericht.</h2>
          <p>Begin met iets uit iemands verhaal. Bellen blijft dicht totdat er eerst is gechat.</p>
        </div>
        <button className="secondary-button" type="button" onClick={() => onNavigate("messages")}>
          Naar chat
        </button>
      </section>
    );
  }

  if (hasSelectedMatch && selectedMatchHasMessages) {
    if (!selectedMatchHasMyReply) {
      return (
        <section className="next-step-panel">
          <div>
            <p className="eyebrow">Volgende stap</p>
            <h2>Reageer eerst in de chat.</h2>
            <p>De match heeft de opening gemaakt. Na jouw reactie gaat het anonieme belmoment open.</p>
          </div>
          <button className="secondary-button" type="button" onClick={() => onNavigate("messages")}>
            Open gesprek en reageer
          </button>
        </section>
      );
    }

    return (
      <section className="next-step-panel">
        <div>
          <p className="eyebrow">Volgende stap</p>
          <h2>Chat loopt. Daarna pas bellen.</h2>
          <p>Als het gesprek goed voelt, open je vanuit Berichten het anonieme belmoment.</p>
        </div>
        <button className="secondary-button" type="button" onClick={() => onNavigate("messages")}>
          Open gesprek
        </button>
      </section>
    );
  }

  if (suggestedCount > 0) {
    return (
      <section className="next-step-panel">
        <div>
          <p className="eyebrow">Volgende stap</p>
          <h2>Bekijk passende profielen.</h2>
          <p>Toon interesse bij iemand waar je op verhaal, intentie en voorkeur op aanslaat.</p>
        </div>
        <button className="secondary-button" type="button" onClick={() => onNavigate("discover")}>
          Naar Ontdek
        </button>
      </section>
    );
  }

  return (
    <section className="next-step-panel">
      <div>
        <p className="eyebrow">Volgende stap</p>
        <h2>Je profiel staat klaar.</h2>
        <p>
          Er zijn nu {hiddenByPreferenceCount > 0 ? "nog geen wederzijdse" : "nog geen"} passende profielen.
          Controleer eventueel je voorkeuren of wacht tot er meer echte leden actief zijn.
        </p>
      </div>
      <button className="secondary-button" type="button" onClick={() => onNavigate("profile")}>
        Profiel controleren
      </button>
    </section>
  );
}

function Onboarding({ user, onSaved, demoMode, onLogout, onPrivacy }) {
  return (
    <main className="onboarding-shell">
      <section className="onboarding-panel">
        <button className="text-button align-left" onClick={onLogout}>
          Terug
        </button>
        <p className="eyebrow">Eerste stap</p>
        <h1>Maak je profiel zonder foto.</h1>
        <p>
          Andere leden zien je naam, leeftijd, verhaal en passies. Nieuwe leden activeren eerst hun uitnodiging.
        </p>
        <ProfileForm user={user} onSaved={onSaved} demoMode={demoMode} onPrivacy={onPrivacy} />
      </section>
    </main>
  );
}

function ProfileView({ profile, user, onSaved, demoMode, onPrivacy, onToggleActive }) {
  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">Profiel</p>
        <h2>Houd je verhaal actueel.</h2>
      </div>
      <ProfileForm user={user} profile={profile} onSaved={onSaved} demoMode={demoMode} onPrivacy={onPrivacy} />
      <ProfilePrivacyControls
        profile={profile}
        user={user}
        onPrivacy={onPrivacy}
        onToggleActive={onToggleActive}
      />
    </section>
  );
}

function ProfilePrivacyControls({ profile, user, onPrivacy, onToggleActive }) {
  const [updating, setUpdating] = useState(false);
  const active = profile?.actief !== false;

  const toggle = async () => {
    setUpdating(true);
    try {
      await onToggleActive(!active);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <section className="profile-privacy-controls" aria-label="Profielprivacy en gegevens">
      <div>
        <p className="eyebrow">Privacycontrole</p>
        <h3>Jij bepaalt of je profiel zichtbaar is.</h3>
        <p>
          Pauzeren verbergt je profiel voor andere leden zonder je account direct te verwijderen. Voor inzage,
          export of definitieve verwijdering stuur je een privacyverzoek.
        </p>
      </div>
      <div className="profile-status-card">
        <span className={classNames("profile-status", active ? "active" : "paused")}>
          {active ? "Profiel actief" : "Profiel gepauzeerd"}
        </span>
        <button className="secondary-button wide" type="button" disabled={updating} onClick={toggle}>
          {updating ? "Aanpassen" : active ? "Pauzeer profiel" : "Maak profiel weer actief"}
        </button>
        <a className="secondary-button wide danger" href={privacyRequestMailto(user, "Verwijderverzoek")}>
          Verwijdering aanvragen
        </a>
        <button className="text-button" type="button" onClick={onPrivacy}>
          Bekijk je privacyrechten
        </button>
      </div>
    </section>
  );
}

function ProfileForm({ user, profile = null, onSaved, demoMode = false, onPrivacy }) {
  const needsInviteCode = !demoMode && !profile;
  const [form, setForm] = useState(() => ({
    naam: profile?.naam ?? "",
    leeftijd: profile?.leeftijd ? String(profile.leeftijd) : "",
    geslacht: profile?.geslacht ?? "",
    zoekt: profile?.zoekt ?? "",
    verhaal: profile?.verhaal ?? "",
    passies: normalizeList(profile?.passies).join(", "),
  }));
  const [sensitiveConsent, setSensitiveConsent] = useState(
    () => Boolean(profile?.sensitive_data_consent_at) || hasStoredSensitiveConsent(user.id),
  );
  const [inviteCode, setInviteCode] = useState(() => readPendingInviteCode(user.email));
  const [inviteStatus, setInviteStatus] = useState(needsInviteCode ? "checking" : "verified");
  const [inviteCheckError, setInviteCheckError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const passionList = normalizeList(form.passies);
  const age = Number(form.leeftijd);
  const matchFilter = describeMatchFilter(form);
  const normalizedInviteCode = normalizeInviteCode(inviteCode);

  useEffect(() => {
    if (!needsInviteCode) return undefined;

    if (!hasSupabaseConfig || !supabase) {
      setInviteStatus("required");
      return undefined;
    }

    let active = true;
    setInviteStatus("checking");
    setInviteCheckError("");

    checkCurrentUserInvite()
      .then(({ invited, error: inviteError }) => {
        if (!active) return;
        if (inviteError && isMissingInviteSchemaError(inviteError)) {
          setInviteCheckError(friendlyInviteError(inviteError));
        }
        setInviteStatus(invited ? "verified" : "required");
      })
      .catch((inviteError) => {
        if (!active) return;
        setInviteCheckError(friendlyInviteError(inviteError));
        setInviteStatus("required");
      });

    return () => {
      active = false;
    };
  }, [needsInviteCode, user.id]);

  const save = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.naam.trim()) {
      setError("Vul je voornaam in.");
      return;
    }
    if (!Number.isInteger(age) || age < 18 || age > 99) {
      setError("Vul een leeftijd tussen 18 en 99 in.");
      return;
    }
    if (!form.geslacht || !form.zoekt) {
      setError("Kies je geslacht en wie je zoekt.");
      return;
    }
    if (form.verhaal.trim().length < 20) {
      setError("Schrijf minimaal een korte zin over jezelf.");
      return;
    }
    if (passionList.length < 2) {
      setError("Kies of schrijf minimaal twee passies.");
      return;
    }
    if (!sensitiveConsent) {
      setError("Geef expliciet toestemming voor het verwerken van je datingvoorkeuren.");
      return;
    }
    if (needsInviteCode && inviteStatus !== "verified" && normalizedInviteCode.length < 6) {
      setError("Vul je uitnodigingscode in voordat je je profiel opslaat.");
      return;
    }

    const acceptedAt = profile?.sensitive_data_consent_at || consentTimestamp();

    const payload = {
      id: user.id,
      naam: form.naam.trim(),
      voornaam: form.naam.trim(),
      leeftijd: age,
      geslacht: form.geslacht,
      zoekt: form.zoekt,
      verhaal: form.verhaal.trim(),
      passies: passionList,
      tags: passionList,
      actief: profile?.actief ?? true,
      privacy_consent_at: profile?.privacy_consent_at || acceptedAt,
      privacy_consent_version: CONSENT_VERSION,
      sensitive_data_consent_at: acceptedAt,
      consent_version: CONSENT_VERSION,
    };

    if (demoMode) {
      rememberSensitiveConsent(user.id);
      onSaved(payload);
      return;
    }

    if (!hasSupabaseConfig || !supabase) {
      setError("Supabase is nog niet gekoppeld.");
      return;
    }

    setSaving(true);

    if (needsInviteCode && inviteStatus !== "verified") {
      const { error: inviteError } = await redeemInviteCode(normalizedInviteCode);
      if (inviteError) {
        setSaving(false);
        setError(friendlyInviteError(inviteError));
        return;
      }
      clearPendingInviteCode(user.email);
      setInviteStatus("verified");
      setInviteCheckError("");
    }

    const { error: saveError } = await upsertProfile(payload);
    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }
    rememberSensitiveConsent(user.id);
    onSaved(payload);
  };

  return (
    <form className="profile-form" onSubmit={save}>
      <div className="profile-match-preview">
        <strong>Jouw matchfilter</strong>
        <span>{matchFilter.summary}</span>
        <dl>
          <div>
            <dt>Ik ben</dt>
            <dd>{matchFilter.gender}</dd>
          </div>
          <div>
            <dt>Ik zoek</dt>
            <dd>{matchFilter.seeking}</dd>
          </div>
        </dl>
      </div>

      {needsInviteCode && (
        <section className="invite-gate" aria-label="Uitnodiging activeren">
          <div>
            <strong>Uitnodiging vereist</strong>
            <span>
              We starten gecontroleerd. Activeer je code eenmalig voordat je profiel zichtbaar kan worden.
            </span>
          </div>
          {inviteStatus === "checking" && <p className="form-message success">Toegang controleren...</p>}
          {inviteStatus === "verified" && (
            <p className="form-message success">Uitnodiging actief. Je kunt je profiel opslaan.</p>
          )}
          {inviteStatus !== "checking" && inviteStatus !== "verified" && (
            <>
              {inviteCheckError && <p className="form-message error">{inviteCheckError}</p>}
              <label>
                Uitnodigingscode
                <input
                  value={inviteCode}
                  onChange={(event) => setInviteCode(event.target.value)}
                  placeholder="Bijvoorbeeld LHC-..."
                  autoComplete="one-time-code"
                  autoCapitalize="characters"
                  spellCheck="false"
                />
              </label>
            </>
          )}
        </section>
      )}

      <div className="form-grid">
        <label>
          Voornaam
          <input value={form.naam} onChange={(event) => update("naam", event.target.value)} placeholder="Marcel" />
        </label>
        <label>
          Leeftijd
          <input
            value={form.leeftijd}
            onChange={(event) => update("leeftijd", event.target.value.replace(/\D/g, "").slice(0, 2))}
            inputMode="numeric"
            placeholder="48"
          />
        </label>
        <label>
          Ik ben
          <select value={form.geslacht} onChange={(event) => update("geslacht", event.target.value)}>
            <option value="">Kies...</option>
            <option>Man</option>
            <option>Vrouw</option>
            <option>Non-binair</option>
          </select>
        </label>
        <label>
          Ik zoek
          <select value={form.zoekt} onChange={(event) => update("zoekt", event.target.value)}>
            <option value="">Kies...</option>
            <option>Ik zoek vrouwen</option>
            <option>Ik zoek mannen</option>
            <option>Ik zoek iedereen</option>
          </select>
        </label>
      </div>

      <label>
        Jouw verhaal
        <textarea
          value={form.verhaal}
          onChange={(event) => update("verhaal", event.target.value)}
          rows={4}
          placeholder="Vertel waar je warm van wordt, wat je zoekt en hoe iemand met jou contact maakt."
        />
      </label>

      <label>
        Passies
        <input
          value={form.passies}
          onChange={(event) => update("passies", event.target.value)}
          placeholder="Hardlopen, kunst, reizen"
        />
      </label>

      <div className="passion-cloud" aria-label="Passie suggesties">
        {PASSIONS.map((passion) => (
          <button
            key={passion}
            type="button"
            onClick={() => {
              const current = new Set(passionList);
              if (current.has(passion)) current.delete(passion);
              else current.add(passion);
              update("passies", [...current].join(", "));
            }}
            className={passionList.includes(passion) ? "selected" : ""}
          >
            {passion}
          </button>
        ))}
      </div>

      <div className="check-row">
        <input
          id="profile-sensitive-consent"
          type="checkbox"
          checked={sensitiveConsent}
          onChange={(event) => setSensitiveConsent(event.target.checked)}
        />
        <label htmlFor="profile-sensitive-consent">
          Ik geef expliciet toestemming voor het verwerken van mijn geslacht, zoekvoorkeur en profieltekst voor matching.{" "}
          <button className="inline-link" type="button" onClick={onPrivacy}>
            Lees privacy
          </button>
          .
        </label>
      </div>

      {error && <p className="form-message error">{error}</p>}

      <button className="primary-button wide" disabled={saving} type="submit">
        {saving ? "Opslaan" : "Profiel opslaan"}
      </button>
    </form>
  );
}

function DiscoverView({
  profiles,
  interestedIds,
  reportedIds,
  onLike,
  onBlock,
  onReport,
  loading,
  viewerProfile,
  hiddenByPreferenceCount = 0,
  profilePaused = false,
  demoMode = false,
  onOpenProfile,
  onCreateDemoMatch,
}) {
  if (loading) return <EmptyState title="Profielen laden" text="We halen de nieuwste leden op." />;
  if (profilePaused) {
    return (
      <EmptyState
        title="Je profiel is gepauzeerd"
        text="Je wordt nu niet getoond aan andere leden. Maak je profiel weer actief via Profiel zodra je weer wilt daten."
      >
        <MatchFilterNote profile={viewerProfile} hiddenByPreferenceCount={hiddenByPreferenceCount} />
        <button className="secondary-button" type="button" onClick={onOpenProfile}>
          Naar profiel
        </button>
      </EmptyState>
    );
  }
  if (!profiles.length) {
    return (
      <EmptyState
        title="Geen passende profielen op dit moment"
        text={
          hiddenByPreferenceCount > 0
            ? "Er zijn wel leden, maar ze passen niet wederzijds bij jouw zoekvoorkeur. We tonen liever minder dan verkeerde matches."
            : "Je profiel staat klaar. Zodra er leden actief zijn die bij je voorkeur passen, verschijnen ze hier."
        }
      >
        <MatchFilterNote profile={viewerProfile} hiddenByPreferenceCount={hiddenByPreferenceCount} />
        <div className="empty-actions">
          {demoMode && (
            <button className="primary-button" type="button" onClick={onCreateDemoMatch}>
              Start demo-route
            </button>
          )}
          <button className="secondary-button" type="button" onClick={onOpenProfile}>
            Voorkeuren aanpassen
          </button>
        </div>
      </EmptyState>
    );
  }

  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">Ontdek</p>
        <h2>Slim geselecteerd op verhaal en intentie.</h2>
      </div>
      <MatchFilterNote profile={viewerProfile} hiddenByPreferenceCount={hiddenByPreferenceCount} />
      <div className="profile-grid">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            liked={interestedIds.has(profile.id)}
            reported={reportedIds.has(profile.id)}
            onLike={() => onLike(profile)}
            onBlock={() => onBlock(profile)}
            onReport={(reason, details) => onReport(profile, reason, details)}
          />
        ))}
      </div>
    </section>
  );
}

function MatchFilterNote({ profile, hiddenByPreferenceCount = 0 }) {
  const filter = describeMatchFilter(profile);
  return (
    <div className="match-filter-note">
      <div>
        <strong>Wederzijdse selectie actief</strong>
        <span>{filter.summary}</span>
      </div>
      <dl>
        <div>
          <dt>Ik ben</dt>
          <dd>{filter.gender}</dd>
        </div>
        <div>
          <dt>Ik zoek</dt>
          <dd>{filter.seeking}</dd>
        </div>
        <div>
          <dt>Verborgen</dt>
          <dd>{hiddenByPreferenceCount}</dd>
        </div>
      </dl>
    </div>
  );
}

function ProfileCard({ profile, liked, reported, onLike, onBlock, onReport }) {
  const displayName = profile.naam || profile.voornaam || "Lid";
  const matchScore = profile.matchScore;

  return (
    <article className="member-card">
      <div className="member-avatar" aria-hidden="true">
        {displayName.slice(0, 1).toUpperCase()}
      </div>
      <div className="member-main">
        <div className="member-title">
          <h3>{displayName}</h3>
          {profile.leeftijd && <span>{profile.leeftijd}</span>}
        </div>
        {matchScore?.score > 0 && (
          <div className="match-score-strip" aria-label={`Matchscore ${matchScore.score} procent`}>
            <span>{matchScore.level}</span>
            <strong>{matchScore.score}%</strong>
          </div>
        )}
        {matchScore?.reasons?.length > 0 && (
          <div className="match-reasons" aria-label="Waarom deze match wordt voorgesteld">
            {matchScore.reasons.slice(0, 3).map((reason) => (
              <span key={reason}>{reason}</span>
            ))}
          </div>
        )}
        {matchScore?.compass?.length > 0 && (
          <div className="match-compass" aria-label="Matchkompas">
            <strong>Matchkompas</strong>
            {matchScore.compass.map((item) => (
              <div className="match-compass-row" key={item.label}>
                <span>{item.label}</span>
                <div className="match-compass-bar" aria-label={`${item.label} ${item.value} procent`}>
                  <span style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
        <p>{profile.verhaal || "Dit lid vult binnenkort een verhaal in."}</p>
        <TagList tags={profile.tags} />
      </div>
      <button className={classNames("like-button", liked && "liked")} onClick={onLike} disabled={liked}>
        {liked ? "Interesse verstuurd" : "Toon interesse"}
      </button>
      <SafetyActions
        context="card"
        reported={reported}
        onBlock={onBlock}
        onReport={onReport}
      />
    </article>
  );
}

function SafetyActions({ context = "panel", reported = false, onBlock, onReport }) {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState("");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const ok = await onReport(reason, details);
      if (ok) {
        setDetails("");
        setOpen(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={classNames("safety-actions", context === "card" && "compact")}>
      <button className="text-button" type="button" onClick={onBlock}>
        Verberg profiel
      </button>
      <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
        <summary>{reported ? "Rapportage verzonden" : "Rapporteer"}</summary>
        <form className="report-form" onSubmit={submit}>
          <label>
            Reden
            <select value={reason} onChange={(event) => setReason(event.target.value)}>
              {REPORT_REASONS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Toelichting
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value.slice(0, 1000))}
              rows={3}
              placeholder="Optioneel: wat gebeurde er?"
            />
          </label>
          <button className="secondary-button wide" type="submit" disabled={submitting || reported}>
            {reported ? "Al verzonden" : submitting ? "Versturen" : "Rapportage versturen"}
          </button>
        </form>
      </details>
    </div>
  );
}

function MatchesView({ matches, matchProfiles, userId, selectedMatchId, onSelect, onOpenDiscover, demoMode = false }) {
  if (!matches.length) {
    return (
      <EmptyState
        title="Nog geen matches"
        text={
          demoMode
            ? "Ga naar Ontdek en toon bewust interesse. De demo maakt daarna wederzijdse interesse aan, zodat je chat en bellen kunt testen."
            : "Een match ontstaat zodra twee leden allebei interesse tonen. Daarna kun je chatten en later anoniem bellen."
        }
      >
        <button className="primary-button" type="button" onClick={onOpenDiscover}>
          Naar Ontdek
        </button>
      </EmptyState>
    );
  }

  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">Matches</p>
        <h2>Gesprekken die wederzijds zijn.</h2>
      </div>
      <div className="match-list">
        {matches.map((match) => {
          const other = matchProfiles[getOtherUserId(match, userId)];
          return (
            <button
              key={match.id}
              className={classNames("match-row", selectedMatchId === match.id && "active")}
              onClick={() => onSelect(match.id)}
            >
              <span>{other?.naam?.slice(0, 1).toUpperCase() ?? "?"}</span>
              <div>
                <strong>{other?.naam ?? "Match"}</strong>
                <small>Gematcht op {new Intl.DateTimeFormat("nl-NL").format(new Date(match.created_at))}</small>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MessagesView({
  match,
  otherProfile,
  messages,
  userId,
  onSend,
  onBlock,
  onReport,
  reportedIds = new Set(),
  demoMode = false,
  onJourneyStep = () => {},
  onOpenDiscover,
}) {
  const [draft, setDraft] = useState("");
  const [callStep, setCallStep] = useState("ready");
  const [callError, setCallError] = useState("");
  const [incomingCall, setIncomingCall] = useState(null);
  const recipientId = match ? getOtherUserId(match, userId) : "";
  const voiceReady = demoMode || isVoiceCallingEnabled();
  const hasConversation = messages.length > 0;
  const hasUserReply = messages.some((message) => message.sender_id === userId);

  useEffect(() => {
    setCallStep("ready");
    setCallError("");
    setIncomingCall(null);
    return () => {
      hangUp();
    };
  }, [match?.id]);

  useEffect(() => {
    if (!match || demoMode || !voiceReady || !hasSupabaseConfig || !supabase) return undefined;

    let cleanupIncoming = null;
    let active = true;

    initTwilioDevice()
      .then(() => {
        if (!active) return;
        cleanupIncoming = onIncomingCall((call) => {
          setIncomingCall(call);
          setCallStep("incoming");
          setCallError("");
          onJourneyStep("call");

          call.on?.("cancel", () => {
            setIncomingCall(null);
            setCallStep((current) => (current === "incoming" ? "ready" : current));
          });
          call.on?.("disconnect", () => {
            setIncomingCall(null);
            setCallStep((current) => (current === "meet" ? current : "ended"));
          });
        });
      })
      .catch((err) => {
        if (!active) return;
        setCallError(err.message || "Belverbinding voorbereiden lukte niet.");
      });

    return () => {
      active = false;
      cleanupIncoming?.();
    };
  }, [demoMode, match?.id, onJourneyStep, voiceReady]);

  const submit = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onSend(draft);
    setDraft("");
  };

  if (!match) {
    return (
      <EmptyState
        title="Zoek eerst een match"
        text="De volgorde is bewust: eerst matchen, daarna chatten, daarna pas anoniem bellen."
      >
        <button className="primary-button" type="button" onClick={onOpenDiscover}>
          Naar Ontdek
        </button>
      </EmptyState>
    );
  }

  const conversationStep =
    callStep === "meet"
      ? "meet"
      : ["incoming", "connecting", "active", "ended"].includes(callStep)
        ? "call"
        : hasConversation
          ? "messages"
          : "match";
  const callBadge =
    conversationStep === "meet"
      ? "Stap 5: afspraak"
      : conversationStep === "call"
        ? "Stap 4: anoniem bellen"
        : conversationStep === "messages"
          ? "Stap 3: chatten"
          : "Stap 2: eerste bericht";
  const callButtonLabel =
    !voiceReady
      ? "Belprovider nog niet actief"
      : callStep === "connecting"
      ? "Verbinden"
      : callStep === "incoming"
        ? "Inkomende oproep"
      : callStep === "active"
        ? "Ophangen"
        : callStep === "meet"
          ? "Bel opnieuw"
          : callStep === "ended"
            ? "Bel opnieuw"
            : "Start anoniem bellen";
  const canStartCall =
    voiceReady &&
    hasUserReply &&
    Boolean(recipientId) &&
    !["incoming", "connecting"].includes(callStep);
  const canProposeMeet = ["active", "ended", "meet"].includes(callStep);
  const starterMessages = [
    `Hoi ${otherProfile?.naam ?? "daar"}, wat in je verhaal zou ik als eerste moeten vragen?`,
    "Ik vind je profiel rustig en oprecht overkomen. Waar krijg jij de laatste tijd energie van?",
    "Zullen we eerst even chatten en daarna pas kijken of bellen goed voelt?",
  ];
  const replySuggestions = [
    `Hoi ${otherProfile?.naam ?? "daar"}, leuk dat je dit zegt. Waar zou jij graag over doorpraten?`,
    "Ik herken dat rustige tempo wel. Wat maakt voor jou een eerste gesprek prettig?",
    "Dit voelt als een fijne start. Laten we nog even chatten en daarna kort anoniem bellen.",
  ];

  const handleCall = async () => {
    setCallError("");

    if (callStep === "active") {
      hangUp();
      setCallStep("ended");
      onJourneyStep("call");
      return;
    }

    if (!hasUserReply) {
      setCallError("Reageer eerst in de chat voordat je anoniem gaat bellen.");
      return;
    }

    setCallStep("connecting");
    onJourneyStep("call");

    try {
      await startCall(recipientId, {
        allowDemoFallback: demoMode,
        onAccepted: () => {
          setCallStep("active");
          onJourneyStep("call");
        },
        onDisconnected: () => {
          setCallStep((current) => (current === "meet" ? current : "ended"));
        },
      });
    } catch (err) {
      setCallStep("ready");
      setCallError(
        err.message ||
          "Anoniem bellen is nog niet beschikbaar. Controleer de belprovider en Supabase Functions.",
      );
    }
  };

  const acceptIncoming = () => {
    setCallError("");
    try {
      answerIncomingCall(incomingCall, {
        onAccepted: () => {
          setIncomingCall(null);
          setCallStep("active");
          onJourneyStep("call");
        },
        onDisconnected: () => {
          setIncomingCall(null);
          setCallStep((current) => (current === "meet" ? current : "ended"));
        },
        onError: (err) => {
          setIncomingCall(null);
          setCallStep("ready");
          setCallError(err?.message || "Inkomende oproep aannemen lukte niet.");
        },
      });
    } catch (err) {
      setCallError(err.message || "Inkomende oproep aannemen lukte niet.");
    }
  };

  const declineIncoming = () => {
    rejectIncomingCall(incomingCall);
    setIncomingCall(null);
    setCallStep("ready");
    setCallError("Inkomende oproep geweigerd.");
  };

  const proposeMeet = () => {
    if (callStep === "active") hangUp();
    setCallStep("meet");
    setCallError("");
    onJourneyStep("meet");
  };

  return (
    <section className="message-layout">
      <div className="message-header">
        <div>
          <p className="eyebrow">Berichten</p>
          <h2>{otherProfile?.naam ?? "Je match"}</h2>
        </div>
        <div className="message-header-actions">
          <span className="call-badge">{callBadge}</span>
          {otherProfile && (
            <SafetyActions
              reported={reportedIds.has(otherProfile.id)}
              onBlock={() => onBlock(otherProfile)}
              onReport={(reason, details) => onReport(otherProfile, reason, details)}
            />
          )}
        </div>
      </div>

      <ol className="conversation-steps" aria-label="Gespreksroute">
        {[
          ["match", "Match"],
          ["messages", "Chat"],
          ["call", "Bellen"],
          ["meet", "Afspraak"],
        ].map(([id, label]) => {
          const order = ["match", "messages", "call", "meet"];
          const activeIndex = order.indexOf(conversationStep);
          const index = order.indexOf(id);
          return (
            <li
              key={id}
              className={classNames(index === activeIndex && "active", index < activeIndex && "complete")}
            >
              {label}
            </li>
          );
        })}
      </ol>

      <div className="messages-panel">
        {messages.length ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={classNames("message-bubble", message.sender_id === userId && "mine")}
            >
              <p>{message.content}</p>
              <small>{formatTime(message.created_at)}</small>
            </div>
          ))
        ) : (
          <EmptyState
            compact
            title="Nog geen berichten"
            text="Stuur een korte opening die over iemands verhaal gaat."
          >
            <div className="starter-actions" aria-label="Berichtvoorstellen">
              {starterMessages.map((message) => (
                <button className="secondary-button" key={message} type="button" onClick={() => setDraft(message)}>
                  {message}
                </button>
              ))}
            </div>
          </EmptyState>
        )}
      </div>

      {hasConversation && !hasUserReply && (
        <section className="reply-prompt" aria-label="Reactievoorstellen">
          <div>
            <strong>Reageer om de volgende stap te openen</strong>
            <span>Na jouw eerste bericht kan het anonieme belmoment gestart worden.</span>
          </div>
          <div className="starter-actions">
            {replySuggestions.map((message) => (
              <button className="secondary-button" key={message} type="button" onClick={() => setDraft(message)}>
                {message}
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="call-panel">
        <div>
          <p className="eyebrow">Volgende stap</p>
          <h3>Anoniem bellen voordat je afspreekt.</h3>
          <p>
            Telefoonnummers blijven afgeschermd. Eerst chatten, dan kort anoniem bellen, en pas daarna
            eventueel een afspraak voorstellen.
          </p>
        </div>
        <div className="call-actions">
          {incomingCall ? (
            <>
              <button className="primary-button" type="button" onClick={acceptIncoming}>
                Neem op
              </button>
              <button className="secondary-button" type="button" onClick={declineIncoming}>
                Weiger
              </button>
            </>
          ) : (
            <>
              <button className="primary-button" type="button" disabled={!canStartCall} onClick={handleCall}>
                {callButtonLabel}
              </button>
              <button
                className="secondary-button"
                type="button"
                disabled={!canProposeMeet}
                onClick={proposeMeet}
              >
                Afspraak voorstellen
              </button>
            </>
          )}
        </div>
        {!hasUserReply && (
          <p className="call-note">
            Reageer eerst in de chat. Anoniem bellen hoort pas na een eerste uitwisseling open te gaan.
          </p>
        )}
        {!voiceReady && hasUserReply && (
          <p className="call-note">
            Anoniem bellen is technisch voorbereid, maar nog niet live geactiveerd. Eerst moeten de
            belprovider, Supabase Functions en microfoon-test gecontroleerd zijn.
          </p>
        )}
        {callStep === "connecting" && (
          <p className="call-note">Belverbinding wordt voorbereid zonder telefoonnummers te delen.</p>
        )}
        {callStep === "incoming" && (
          <p className="call-note success">Inkomende oproep. Neem alleen op als je klaar bent voor het gesprek.</p>
        )}
        {callStep === "active" && (
          <p className="call-note success">Gesprek actief. Houd het kort, veilig en gericht op vertrouwen.</p>
        )}
        {callStep === "ended" && (
          <p className="call-note success">Gesprek afgerond. Stel alleen een afspraak voor als het goed voelde.</p>
        )}
        {callStep === "meet" && (
          <p className="call-note success">
            Afspraakvoorstel klaar: kies pas een plek en moment als het gesprek goed voelde.
          </p>
        )}
        {callError && <p className="call-note error">{callError}</p>}
      </div>

      <form className="message-form" onSubmit={submit}>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Schrijf een bericht..."
        />
        <button className="primary-button" type="submit">
          Stuur
        </button>
      </form>
    </section>
  );
}

function TagList({ tags }) {
  const list = normalizeList(tags);
  if (!list.length) return null;
  return (
    <div className="tag-list">
      {list.slice(0, 5).map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </div>
  );
}

function EmptyState({ title, text, compact = false, children = null }) {
  return (
    <section className={classNames("empty-state", compact && "compact")}>
      <img src="/lhc-seal.svg" alt="" />
      <h2>{title}</h2>
      <p>{text}</p>
      {children}
    </section>
  );
}
