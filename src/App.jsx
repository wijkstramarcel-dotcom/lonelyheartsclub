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

const PRODUCT_FLOW_STEPS = [
  ["01", "Match zoeken", "Ontdek leden op verhaal en intentie, zonder foto als eerste oordeel."],
  ["02", "Interesse tonen", "Bij wederzijdse interesse ontstaat een match en gaat de chat open."],
  ["03", "Chatten", "Voel of er ritme, aandacht en nieuwsgierigheid in het gesprek zit."],
  ["04", "Anoniem bellen", "Bel afgeschermd voordat je persoonlijke gegevens of nummers deelt."],
  ["05", "Afspreken", "Pas als het goed voelt, stel je een echte ontmoeting voor."],
];

const TRUST_PILLARS = [
  [
    "Eerst inhoud, dan pas uiterlijk",
    "Profielen beginnen met verhaal, passies en intentie. Dat vertraagt het oordeel en maakt ruimte voor een echte eerste indruk.",
  ],
  [
    "Rustige stappen in plaats van druk",
    "Je gaat pas verder als er wederzijdse interesse is: eerst matchen, dan chatten, daarna eventueel anoniem bellen.",
  ],
  [
    "Klein starten, beter bewaken",
    "De eerste toegang gaat via de wachtlijst. Zo kunnen we kwaliteit, privacy en veiligheid serieuzer nemen dan snelle groei.",
  ],
];

const AUDIENCE_ITEMS = [
  "Singles die genoeg hebben van eindeloos swipen.",
  "Mensen die liever eerst karakter, taal en aandacht voelen.",
  "Daters die privacy belangrijk vinden en rustig willen opbouwen.",
];

const SAFETY_ITEMS = [
  [
    "Profielen niet publiek",
    "Profielinformatie is bedoeld voor ingelogde leden en niet als openbare zoekmachine-pagina.",
  ],
  [
    "Toestemming per stap",
    "Voor wachtlijst, account en profielgegevens vragen we expliciet om akkoord voordat data wordt opgeslagen.",
  ],
  [
    "Anoniem bellen als tussenstap",
    "Het doel is dat je eerst veilig kunt praten zonder direct telefoonnummers of privegegevens te delen.",
  ],
  [
    "Menselijke schaal",
    "We laten liever gecontroleerd mensen toe dan meteen een grote, rommelige datingdatabase te maken.",
  ],
];

const FAQ_ITEMS = [
  [
    "Wat is Lonely Hearts Club?",
    "Lonely Hearts Club is een Nederlandse dating community in pre-registratie. De app draait om rustig matchen, chatten en anoniem bellen voordat je eventueel afspreekt.",
  ],
  [
    "Is dit een dating app zonder foto?",
    "Je profiel begint zonder foto als eerste oordeel. Leden ontdekken elkaar via verhaal, passies, intentie en gesprek voordat uiterlijk centraal staat.",
  ],
  [
    "Hoe werkt anoniem bellen?",
    "Na een match en chat kun je een afgeschermde belronde starten. Het doel is dat telefoonnummers prive blijven totdat beide mensen zelf verder willen.",
  ],
  [
    "Kan ik me nu al aanmelden?",
    "Ja. Je kunt je e-mailadres achterlaten op de wachtlijst. Zodra we de eerste groep gebruikers toelaten, krijg je bericht om eventueel een profiel te maken.",
  ],
  [
    "Voor wie is Lonely Hearts Club bedoeld?",
    "Voor singles die bewuster willen daten: minder swipe-druk, meer aandacht voor verhaal, intentie, chat en een veilige belstap.",
  ],
];

const AUTH_MODES = [
  {
    id: "link",
    label: "Inloglink",
    hint: "zonder wachtwoord",
    title: "Ik heb al een account",
    text: "Beste keuze als je al eerder bent aangemeld of je wachtwoord niet weet. Je krijgt een veilige link per e-mail. We maken hiermee geen nieuw account aan.",
    submit: "Stuur inloglink",
  },
  {
    id: "login",
    label: "Wachtwoord",
    hint: "bestaand account",
    title: "Inloggen met wachtwoord",
    text: "Gebruik dit als je e-mailadres al bevestigd is en je het wachtwoord weet. Lukt dit niet, probeer dan eerst Inloglink.",
    submit: "Log in",
  },
  {
    id: "signup",
    label: "Nieuw account",
    hint: "registreren",
    title: "Nieuw account maken",
    text: "Gebruik dit alleen als je nog geen account hebt. Je kiest een wachtwoord en bevestigt daarna je e-mail voordat je profiel echt actief wordt.",
    submit: "Maak account",
  },
];

const AUTH_GUIDE_ITEMS = [
  ["Al eerder aangemeld?", "Kies Inloglink. Dat werkt ook als je je wachtwoord niet weet."],
  ["Wachtwoord ingesteld?", "Kies Wachtwoord als je mail al bevestigd is."],
  ["Nieuw hier?", "Kies Nieuw account en bevestig daarna je e-mailadres."],
];

const CONTACT_EMAIL = "privacy@lonelyheartsclub.nl";
const CONSENT_VERSION = "2026-06-10";
const SENSITIVE_CONSENT_KEY = "lhc-sensitive-consent";

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

function describeMatchFilter(profile) {
  return {
    gender: profile?.geslacht || "Nog niet ingevuld",
    seeking: profile?.zoekt || "Nog niet ingevuld",
    summary:
      profile?.geslacht && profile?.zoekt
        ? "Je ziet alleen leden die bij jouw zoekvoorkeur passen én waarvan de zoekvoorkeur ook bij jou past."
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

function classNames(...parts) {
  return parts.filter(Boolean).join(" ");
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));
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

function isDuplicateEmailError(error) {
  const message = String(error?.message || "");
  return error?.code === "23505" || message.includes("duplicate key");
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
            Eerst zoek je een match op verhaal en intentie. Daarna chat je, bel je anoniem en spreek
            je pas af als het gesprek echt goed voelt.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#voorinschrijven">
              Schrijf je voor in
            </a>
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
              <h2>Van match naar chat, belronde en echte afspraak.</h2>
              <div className="flow-list">
                <span>1. Zoek een match zonder foto-oordeel</span>
                <span>2. Chat pas na wederzijdse interesse</span>
                <span>3. Bel anoniem voordat je gegevens deelt</span>
                <span>4. Spreek af als het veilig en goed voelt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PreRegisterSection onPrivacy={onPrivacy} onCreateAccount={() => setAuthOpen(true)} />

      <section className="section-band" id="waarom">
        <div className="section-inner">
          <p className="eyebrow">Dating zonder swipe-ruis</p>
          <h2>Voor singles die eerst karakter willen voelen.</h2>
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
                Je ontdekt leden op inhoud en wederzijdse interesse. Pas daarna ga je naar chat, anoniem
                bellen en eventueel een echte afspraak.
              </p>
            </article>
            <article>
              <h3>Nederlandse dating community</h3>
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
          <h2>Niet sneller daten, maar beter beginnen.</h2>
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
          <h2>De route is bewust: match, chat, bel, spreek af.</h2>
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
        <a className="primary-button" href="#voorinschrijven">
          Voorinschrijven
        </a>
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
        <h2>Anoniem daten, matchen en voorinschrijven.</h2>
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
  const [email, setEmail] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setStatus(
        result?.duplicate
          ? "Je stond al op de wachtlijst. We mailen je zodra de volgende groep leden wordt toegelaten."
          : "Je staat op de wachtlijst. We mailen je zodra de volgende groep leden wordt toegelaten.",
      );
      setEmail("");
      setPrivacyAccepted(false);
    } catch (err) {
      setError(err.message || "Voorinschrijven lukte niet. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pre-register-section" id="voorinschrijven">
      <div className="pre-register-copy">
        <p className="eyebrow">Pre-registratie</p>
        <h2>Kom op de wachtlijst voor vroege toegang.</h2>
        <p>
          Laat je e-mailadres achter als je interesse hebt in rustig, privacy-first daten zonder foto-oordeel.
          Je maakt nog geen profiel aan; dit is alleen de wachtlijst.
        </p>
        <ul>
          <li>Geen marketingruis, alleen updates over toegang.</li>
          <li>Je kunt later zelf kiezen of je een profiel maakt.</li>
          <li>We starten bewust klein, zodat matches betekenisvoller blijven.</li>
        </ul>
      </div>

      <form className="pre-register-form" onSubmit={submit} noValidate>
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
        {status && <p className="form-message success">{status}</p>}

        <button className="primary-button wide" disabled={loading} type="submit">
          {loading ? "Inschrijven" : "Zet mij op de wachtlijst"}
        </button>
        <button className="text-button" type="button" onClick={onCreateAccount}>
          Ik wil nu direct een account maken
        </button>
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
        <a href="#voorinschrijven">Voorinschrijven</a>
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
  const [resendLoading, setResendLoading] = useState(false);

  const normalizedEmail = normalizeEmail(email);
  const validEmail = isValidEmail(normalizedEmail);
  const needsPrivacyConsent = mode === "signup";
  const activeAuthMode = AUTH_MODES.find((item) => item.id === mode) ?? AUTH_MODES[0];
  const canResendConfirmation =
    mode === "signup" ||
    error.toLowerCase().includes("bevestig") ||
    status.toLowerCase().includes("bevestig");

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
          emailRedirectTo: window.location.origin,
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
          email: normalizedEmail,
          options: {
            emailRedirectTo: window.location.origin,
            shouldCreateUser: false,
          },
        });
        if (authError) throw authError;
        setStatus("Check je inbox. Als dit e-mailadres een account heeft, staat daar nu een veilige inloglink.");
      }

      if (mode === "signup") {
        const acceptedAt = consentTimestamp();
        const authOptions = {
          emailRedirectTo: window.location.origin,
          data: consentMetadata(acceptedAt),
        };
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: authOptions,
        });
        if (signUpError) throw signUpError;
        await upsertWaitlist(normalizedEmail, acceptedAt);
        if (signUpData.session) {
          setStatus("Account aangemaakt. Je bent ingelogd; je kunt nu je profiel maken.");
        } else {
          setStatus("Account gestart. Bevestig je e-mailadres via de link in je inbox. Daarna kun je inloggen met Inloglink of Wachtwoord.");
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
        setError("Geen bestaand account gevonden. Kies Nieuw account om je eerst te registreren.");
      } else if (message.toLowerCase().includes("email not confirmed")) {
        setError("Je e-mailadres is nog niet bevestigd. Open eerst de bevestigingsmail of stuur hem hieronder opnieuw.");
      } else if (message.toLowerCase().includes("invalid login credentials")) {
        setError("E-mailadres of wachtwoord klopt niet. Had je eerder alleen een inloglink gebruikt? Kies dan Inloglink in plaats van Wachtwoord.");
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
          gekoppeld; maak alleen een nieuw account als je echt nieuw bent.
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

  const unmatchedProfiles = useMemo(() => {
    const matchedIds = new Set(matches.map((match) => getOtherUserId(match, user.id)));
    return profiles.filter((item) => item.id !== user.id && !matchedIds.has(item.id));
  }, [matches, profiles, user.id]);

  const suggestedProfiles = useMemo(
    () => unmatchedProfiles.filter((item) => isPotentialMatch(profile, item)),
    [profile, unmatchedProfiles],
  );

  const hiddenByPreferenceCount = Math.max(unmatchedProfiles.length - suggestedProfiles.length, 0);

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
    loadData().then(() => {
      setNotice("Profiel opgeslagen. Je ziet nu alleen leden die wederzijds bij je voorkeur passen.");
    });
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
      setNotice(`Demo-match met ${targetProfile.naam}. Stuur een bericht en ga daarna door naar anoniem bellen.`);
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
      setNotice("Chat werkt. Volgende stap: start de demo-belronde vanuit dit gesprek.");
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

        {demoMode && (
          <DemoJourney activeTab={activeTab} />
        )}

        {activeTab === "discover" && (
          <DiscoverView
            profiles={suggestedProfiles}
            interestedIds={interestedIds}
            onLike={likeProfile}
            loading={loading}
            viewerProfile={profile}
            hiddenByPreferenceCount={hiddenByPreferenceCount}
          />
        )}

        {activeTab === "matches" && (
          <MatchesView
            matches={matches}
            matchProfiles={matchProfiles}
            userId={user.id}
            selectedMatchId={selectedMatchId}
            demoMode={demoMode}
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
            demoMode={demoMode}
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

function DemoJourney({ activeTab }) {
  const flow = [
    ["discover", "Match zoeken", activeTab === "discover"],
    ["matches", "Match kiezen", activeTab === "matches"],
    ["messages", "Chatten", activeTab === "messages"],
    ["call", "Anoniem bellen", false],
    ["meet", "Afspreken", false],
  ];

  return (
    <section className="demo-journey" aria-label="Demo route">
      <div>
        <p className="eyebrow">Demo-route</p>
        <h2>Test de echte volgorde: match, chat, bel, spreek af.</h2>
      </div>
      <div className="journey-steps">
        {flow.map(([id, label, active], index) => (
          <span key={id} className={active ? "active" : ""}>
            {index + 1}. {label}
          </span>
        ))}
      </div>
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
  const age = Number(form.leeftijd);
  const matchFilter = describeMatchFilter(form);

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

function DiscoverView({ profiles, interestedIds, onLike, loading, viewerProfile, hiddenByPreferenceCount = 0 }) {
  if (loading) return <EmptyState title="Profielen laden" text="We halen de nieuwste leden op." />;
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
      </EmptyState>
    );
  }

  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">Ontdek</p>
        <h2>Nieuwe leden zonder foto-oordeel.</h2>
      </div>
      <MatchFilterNote profile={viewerProfile} hiddenByPreferenceCount={hiddenByPreferenceCount} />
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

function MatchFilterNote({ profile, hiddenByPreferenceCount = 0 }) {
  const filter = describeMatchFilter(profile);
  return (
    <div className="match-filter-note">
      <div>
        <strong>Wederzijdse matchfilter actief</strong>
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

function MatchesView({ matches, matchProfiles, userId, selectedMatchId, onSelect, demoMode = false }) {
  if (!matches.length) {
    return (
      <EmptyState
        title="Nog geen matches"
        text={
          demoMode
            ? "Ga naar Ontdek en toon interesse. In de demo maken we daarna meteen een match, zodat je chat en bellen kunt testen."
            : "Een match ontstaat zodra twee leden allebei interesse tonen. Daarna kun je chatten en later anoniem bellen."
        }
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

function MessagesView({ match, otherProfile, messages, userId, onSend, demoMode = false }) {
  const [draft, setDraft] = useState("");
  const [callStep, setCallStep] = useState("ready");

  useEffect(() => {
    setCallStep("ready");
  }, [match?.id]);

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
        <span className="call-badge">Stap 3: chatten</span>
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

      {demoMode && (
        <div className="call-panel">
          <div>
            <p className="eyebrow">Volgende stap</p>
            <h3>Anoniem bellen voordat je afspreekt.</h3>
            <p>
              In de echte app blijven telefoonnummers afgeschermd. In deze demo zie je hoe het gesprek
              verder gaat na de chat.
            </p>
          </div>
          <div className="call-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => setCallStep((current) => (current === "ready" ? "calling" : current))}
            >
              {callStep === "ready" ? "Start demo-belronde" : "Belronde gestart"}
            </button>
            <button
              className="text-button"
              type="button"
              disabled={callStep === "ready"}
              onClick={() => setCallStep("meet")}
            >
              Afspraak voorstellen
            </button>
          </div>
          {callStep === "calling" && (
            <p className="call-note">
              Demo-belronde actief: eerst vijf minuten praten, zonder nummers te delen.
            </p>
          )}
          {callStep === "meet" && (
            <p className="call-note success">
              Afspraakvoorstel klaar: kies pas een plek en moment als de belronde goed voelde.
            </p>
          )}
        </div>
      )}

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
