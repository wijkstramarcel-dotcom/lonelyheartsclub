import { useEffect, useMemo, useState } from "react";
import { hasSupabaseConfig, supabase } from "./lib/supabase.js";

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

const DEMO_MATCHES = [
  {
    id: "demo-match-sarah",
    user_a: DEMO_USER.id,
    user_b: "demo-sarah",
    created_at: new Date().toISOString(),
  },
];

const DEMO_MESSAGES = {
  "demo-match-sarah": [
    {
      id: "demo-message-1",
      match_id: "demo-match-sarah",
      sender_id: "demo-sarah",
      content: "Leuk dat we matchen. Hardlopen of koffie als eerste onderwerp?",
      created_at: new Date(Date.now() - 3600_000).toISOString(),
    },
    {
      id: "demo-message-2",
      match_id: "demo-match-sarah",
      sender_id: DEMO_USER.id,
      content: "Koffie na hardlopen klinkt als de juiste volgorde.",
      created_at: new Date(Date.now() - 2800_000).toISOString(),
    },
  ],
};

const tabs = [
  { id: "discover", label: "Ontdek" },
  { id: "matches", label: "Matches" },
  { id: "messages", label: "Berichten" },
  { id: "profile", label: "Profiel" },
];

const AUTH_MODES = [
  {
    id: "link",
    label: "Bestaand account",
    hint: "mail-link",
    title: "Inloggen zonder wachtwoord",
    text: "Gebruik dit als je al eens bent aangemeld. Je krijgt een veilige link per e-mail. Er wordt geen nieuw account aangemaakt.",
    submit: "Stuur inloglink",
  },
  {
    id: "signup",
    label: "Nieuw account",
    hint: "registreren",
    title: "Nieuw account maken",
    text: "Gebruik dit alleen als je nog geen account hebt. Je kiest een wachtwoord en bevestigt daarna mogelijk eerst je e-mail.",
    submit: "Maak account",
  },
  {
    id: "login",
    label: "Wachtwoord",
    hint: "bestaand account",
    title: "Inloggen met wachtwoord",
    text: "Gebruik dit als je account al bestaat, je e-mail bevestigd is en je het wachtwoord weet.",
    submit: "Log in",
  },
];

const CONTACT_EMAIL = "privacy@lonelyheartsclub.nl";
const CONSENT_VERSION = "2026-06-10";
const SENSITIVE_CONSENT_KEY = "lhc-sensitive-consent";

function normalizeList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
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

function classNames(...parts) {
  return parts.filter(Boolean).join(" ");
}

function consentTimestamp() {
  return new Date().toISOString();
}

function consentMetadata(timestamp = consentTimestamp()) {
  return {
    privacy_consent_at: timestamp,
    privacy_consent_version: CONSENT_VERSION,
  };
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

async function upsertWaitlist(email, timestamp) {
  const fullPayload = {
    email,
    privacy_consent_at: timestamp,
    consent_version: CONSENT_VERSION,
  };

  const { error } = await supabase.from("waitlist").upsert(fullPayload);
  if (!error) return;
  if (!isMissingConsentColumnError(error)) throw error;

  const { error: fallbackError } = await supabase.from("waitlist").upsert({ email });
  if (fallbackError) throw fallbackError;
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

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user ?? null);
      setAuthOpen(false);
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
      </>
    );
  }

  if (sessionUser) {
    return (
      <>
        <ProductApp user={sessionUser} onLogout={handleLogout} onPrivacy={() => setPrivacyOpen(true)} />
        {privacyOpen && <PrivacyDialog onClose={() => setPrivacyOpen(false)} />}
      </>
    );
  }

  return (
    <>
      <LandingPage
        authOpen={authOpen}
        setAuthOpen={setAuthOpen}
        onDemo={() => setDemoMode(true)}
        onPrivacy={() => setPrivacyOpen(true)}
      />
      {privacyOpen && <PrivacyDialog onClose={() => setPrivacyOpen(false)} />}
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

function LandingPage({ authOpen, setAuthOpen, onDemo, onPrivacy }) {
  return (
    <main className="site-shell">
      <HeaderNav onLogin={() => setAuthOpen(true)} onPrivacy={onPrivacy} />

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Nederland · privacy-first dating · 2026</p>
          <h1>Lonely Hearts Club</h1>
          <p className="hero-subtitle">
            Dating begint met een stem. Maak eerst contact zonder foto, ontdek of er een klik is,
            en ga pas daarna verder naar video of een echte afspraak.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setAuthOpen(true)}>
              Start gratis
            </button>
            <button className="secondary-button" onClick={onDemo}>
              Bekijk demo
            </button>
          </div>
          <div className="trust-row" aria-label="Belangrijkste voordelen">
            <span>Geen foto's nodig</span>
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
              <p className="phone-kicker">Eerst luisteren</p>
              <h2>Ontdek wie iemand is voordat je een foto ziet.</h2>
              <div className="flow-list">
                <span>Profiel zonder foto</span>
                <span>Anoniem gesprek</span>
                <span>Match bij wederzijdse interesse</span>
                <span>Berichten en vervolgafspraak</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band" id="hoe">
        <div className="section-inner">
          <p className="eyebrow">Hoe het werkt</p>
          <h2>Een rustiger alternatief voor swipen.</h2>
          <div className="steps-grid">
            {[
              ["01", "Profiel zonder foto", "Vertel wie je bent met woorden, voorkeuren en passies."],
              ["02", "Ontdek leden", "Bekijk verhalen en interesses in plaats van perfecte plaatjes."],
              ["03", "Toon interesse", "Bij wederzijdse interesse ontstaat automatisch een match."],
              ["04", "Praat verder", "Stuur berichten en plan daarna een anoniem gesprek."],
            ].map(([number, title, text]) => (
              <article className="step-card" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="closing-section">
        <div>
          <p className="eyebrow">Voor singles die meer willen dan een swipe</p>
          <h2>Klaar om de eerste echte leden binnen te laten?</h2>
        </div>
        <button className="primary-button" onClick={() => setAuthOpen(true)}>
          Account maken
        </button>
      </section>

      <SiteFooter onPrivacy={onPrivacy} />

      {authOpen && (
        <AuthDialog
          onClose={() => setAuthOpen(false)}
          onDemo={onDemo}
          onPrivacy={() => {
            setAuthOpen(false);
            onPrivacy();
          }}
        />
      )}
    </main>
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
        <a href="#hoe">Hoe het werkt</a>
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
        <h2 id="privacy-title">Jij houdt grip op je datingdata.</h2>
        <p>
          Lonely Hearts Club verwerkt alleen gegevens die nodig zijn om je account, profiel, matches en
          berichten te laten werken.
        </p>

        <div className="privacy-grid">
          <article>
            <h3>Wat we opslaan</h3>
            <p>
              Je e-mailadres, profielgegevens, leeftijd, geslacht, zoekvoorkeur, passies, likes, matches,
              berichten en technische accountgegevens.
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
              De app gebruikt Supabase voor account en database, Vercel voor hosting en alleen bij
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

function AuthDialog({ onClose, onDemo, onPrivacy }) {
  const [mode, setMode] = useState("link");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validEmail = email.includes("@") && email.includes(".");
  const needsPrivacyConsent = mode === "signup";
  const activeAuthMode = AUTH_MODES.find((item) => item.id === mode) ?? AUTH_MODES[0];

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
    if (!hasSupabaseConfig || !supabase) {
      setError("Supabase is nog niet gekoppeld. Gebruik nu de demo.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "link") {
        const { error: authError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.origin,
            shouldCreateUser: false,
          },
        });
        if (authError) throw authError;
        setStatus("Check je inbox. We hebben een veilige inloglink gestuurd als dit account bestaat.");
      }

      if (mode === "signup") {
        const acceptedAt = consentTimestamp();
        const authOptions = {
          emailRedirectTo: window.location.origin,
          data: consentMetadata(acceptedAt),
        };
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: authOptions,
        });
        if (signUpError) throw signUpError;
        await upsertWaitlist(email, acceptedAt);
        if (signUpData.session) {
          setStatus("Account aangemaakt. Je bent ingelogd; je kunt nu je profiel maken.");
        } else {
          setStatus("Account aangemaakt. Bevestig eerst je e-mail via de link in je inbox. Daarna kun je inloggen met Inloglink of Wachtwoord.");
        }
      }

      if (mode === "login") {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;
      }
    } catch (err) {
      const message = err.message || "Inloggen lukte niet. Probeer het opnieuw.";
      if (mode === "link" && (message.toLowerCase().includes("signup") || message.toLowerCase().includes("signups"))) {
        setError("Geen bestaand account gevonden. Kies Nieuw account om je eerst te registreren.");
      } else if (message.toLowerCase().includes("email not confirmed")) {
        setError("Je e-mailadres is nog niet bevestigd. Open eerst de bevestigingsmail, of gebruik Inloglink om opnieuw een mail te sturen.");
      } else if (message.toLowerCase().includes("invalid login credentials")) {
        setError("E-mailadres of wachtwoord klopt niet. Had je eerder alleen een inloglink gebruikt? Kies dan Inloglink.");
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
        <h2 id="auth-title">Begin veilig</h2>
        <p>
          Kies eerst of je al een account hebt of nieuw bent. Oude profielen blijven gekoppeld aan het
          e-mailadres waarmee ze zijn gemaakt.
        </p>

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
                if (id === "login") setPrivacyAccepted(false);
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

          <button className="primary-button wide" disabled={loading} type="submit">
            {loading ? "Even wachten" : activeAuthMode.submit}
          </button>
          <button className="text-button" type="button" onClick={onDemo}>
            Bekijk eerst de demo
          </button>
        </form>
      </section>
    </div>
  );
}

function ProductApp({ user, initialProfile = null, demoMode = false, onLogout, onPrivacy }) {
  const [activeTab, setActiveTab] = useState("discover");
  const [profile, setProfile] = useState(initialProfile ? normalizeProfile(initialProfile) : null);
  const [needsProfile, setNeedsProfile] = useState(!initialProfile);
  const [profiles, setProfiles] = useState(demoMode ? DEMO_PROFILES.map(normalizeProfile) : []);
  const [matches, setMatches] = useState(demoMode ? DEMO_MATCHES : []);
  const [matchProfiles, setMatchProfiles] = useState(
    demoMode ? Object.fromEntries(DEMO_PROFILES.map((item) => [item.id, normalizeProfile(item)])) : {},
  );
  const [interestedIds, setInterestedIds] = useState(new Set());
  const [selectedMatchId, setSelectedMatchId] = useState(demoMode ? DEMO_MATCHES[0]?.id ?? null : null);
  const [messages, setMessages] = useState(demoMode ? DEMO_MESSAGES : {});
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(!demoMode);

  const selectedMatch = matches.find((match) => match.id === selectedMatchId) ?? matches[0] ?? null;
  const selectedOther = selectedMatch ? matchProfiles[getOtherUserId(selectedMatch, user.id)] : null;

  const allOtherProfiles = useMemo(() => {
    const matchedIds = new Set(matches.map((match) => getOtherUserId(match, user.id)));
    return profiles.filter((item) => item.id !== user.id && !matchedIds.has(item.id) && isPotentialMatch(profile, item));
  }, [matches, profile, profiles, user.id]);

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
    loadData();
  };

  const likeProfile = async (targetProfile) => {
    if (demoMode) {
      setInterestedIds((current) => new Set([...current, targetProfile.id]));
      setNotice(`Interesse getoond in ${targetProfile.naam}. In demo ontstaat de match zodra de ander ook kiest.`);
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

  const sendMessage = async (content) => {
    if (!selectedMatch || !content.trim()) return;

    if (demoMode) {
      const message = {
        id: `demo-message-${Date.now()}`,
        match_id: selectedMatch.id,
        sender_id: user.id,
        content: content.trim(),
        created_at: new Date().toISOString(),
      };
      setMessages((current) => ({
        ...current,
        [selectedMatch.id]: [...(current[selectedMatch.id] ?? []), message],
      }));
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
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => setActiveTab(tab.id)}
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

        {activeTab === "discover" && (
          <DiscoverView
            profiles={allOtherProfiles}
            interestedIds={interestedIds}
            onLike={likeProfile}
            loading={loading}
          />
        )}

        {activeTab === "matches" && (
          <MatchesView
            matches={matches}
            matchProfiles={matchProfiles}
            userId={user.id}
            selectedMatchId={selectedMatchId}
            onSelect={(matchId) => {
              setSelectedMatchId(matchId);
              setActiveTab("messages");
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
          />
        )}

        {activeTab === "profile" && (
          <ProfileView
            profile={profile}
            user={user}
            onSaved={handleProfileSaved}
            demoMode={demoMode}
            onPrivacy={onPrivacy}
          />
        )}
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
          Andere leden zien je naam, leeftijd, verhaal en passies. Je foto blijft bewust buiten beeld.
        </p>
        <ProfileForm user={user} onSaved={onSaved} demoMode={demoMode} onPrivacy={onPrivacy} />
      </section>
    </main>
  );
}

function ProfileView({ profile, user, onSaved, demoMode, onPrivacy }) {
  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">Profiel</p>
        <h2>Houd je verhaal actueel.</h2>
      </div>
      <ProfileForm user={user} profile={profile} onSaved={onSaved} demoMode={demoMode} onPrivacy={onPrivacy} />
    </section>
  );
}

function ProfileForm({ user, profile = null, onSaved, demoMode = false, onPrivacy }) {
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const passionList = normalizeList(form.passies);

  const save = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.naam.trim()) {
      setError("Vul je voornaam in.");
      return;
    }
    if (!form.leeftijd || Number(form.leeftijd) < 18) {
      setError("Je moet minimaal 18 jaar zijn.");
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
    if (!sensitiveConsent) {
      setError("Geef expliciet toestemming voor het verwerken van je datingvoorkeuren.");
      return;
    }

    const acceptedAt = profile?.sensitive_data_consent_at || consentTimestamp();

    const payload = {
      id: user.id,
      naam: form.naam.trim(),
      voornaam: form.naam.trim(),
      leeftijd: Number(form.leeftijd),
      geslacht: form.geslacht,
      zoekt: form.zoekt,
      verhaal: form.verhaal.trim(),
      passies: passionList,
      tags: passionList,
      actief: true,
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
      <div className="form-grid">
        <label>
          Voornaam
          <input value={form.naam} onChange={(event) => update("naam", event.target.value)} placeholder="Marcel" />
        </label>
        <label>
          Leeftijd
          <input value={form.leeftijd} onChange={(event) => update("leeftijd", event.target.value)} inputMode="numeric" placeholder="48" />
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

function DiscoverView({ profiles, interestedIds, onLike, loading }) {
  if (loading) return <EmptyState title="Profielen laden" text="We halen de nieuwste leden op." />;
  if (!profiles.length) {
    return (
      <EmptyState
        title="Nog geen nieuwe leden"
        text="Je profiel staat klaar. Zodra er leden actief zijn die bij je voorkeur passen, verschijnen ze hier."
      />
    );
  }

  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">Ontdek</p>
        <h2>Nieuwe leden zonder foto-oordeel.</h2>
      </div>
      <div className="profile-grid">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            liked={interestedIds.has(profile.id)}
            onLike={() => onLike(profile)}
          />
        ))}
      </div>
    </section>
  );
}

function ProfileCard({ profile, liked, onLike }) {
  return (
    <article className="member-card">
      <div className="member-avatar" aria-hidden="true">
        {profile.naam.slice(0, 1).toUpperCase()}
      </div>
      <div className="member-main">
        <div className="member-title">
          <h3>{profile.naam}</h3>
          {profile.leeftijd && <span>{profile.leeftijd}</span>}
        </div>
        <p>{profile.verhaal || "Dit lid vult binnenkort een verhaal in."}</p>
        <TagList tags={profile.tags} />
      </div>
      <button className={classNames("like-button", liked && "liked")} onClick={onLike} disabled={liked}>
        {liked ? "Interesse verstuurd" : "Toon interesse"}
      </button>
    </article>
  );
}

function MatchesView({ matches, matchProfiles, userId, selectedMatchId, onSelect }) {
  if (!matches.length) {
    return (
      <EmptyState
        title="Nog geen matches"
        text="Een match ontstaat zodra twee leden allebei interesse tonen."
      />
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

function MessagesView({ match, otherProfile, messages, userId, onSend }) {
  const [draft, setDraft] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onSend(draft);
    setDraft("");
  };

  if (!match) {
    return (
      <EmptyState
        title="Kies een match"
        text="Zodra je een match hebt, kun je hier berichten sturen."
      />
    );
  }

  return (
    <section className="message-layout">
      <div className="message-header">
        <div>
          <p className="eyebrow">Berichten</p>
          <h2>{otherProfile?.naam ?? "Je match"}</h2>
        </div>
        <span className="call-badge">Anoniem bellen voorbereid</span>
      </div>

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
          />
        )}
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

function EmptyState({ title, text, compact = false }) {
  return (
    <section className={classNames("empty-state", compact && "compact")}>
      <img src="/lhc-seal.svg" alt="" />
      <h2>{title}</h2>
      <p>{text}</p>
    </section>
  );
}
