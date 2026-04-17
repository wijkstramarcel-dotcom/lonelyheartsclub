import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kdkccffbvdrgqnvfkcqd.supabase.co",
  "sb_publishable_vJkfyqOYDdAx7d0ggyERHA_nL6c8K0U"
);

const C = {
  bg: "#FBF6EF",
  bgSoft: "#F4EBDD",
  bgDark: "#171311",
  card: "rgba(255,255,255,0.76)",
  cardSolid: "#FFFDF9",
  terra: "#C4562C",
  terraDeep: "#9A3C18",
  bronze: "#8E6B1F",
  gold: "#C9A34A",
  text: "#1C1814",
  textMid: "#5C4C41",
  textDim: "#938477",
  border: "rgba(28,24,20,0.12)",
  green: "#2D6A4F",
  white: "#FFFFFF",
};

const serif = "'Playfair Display', Georgia, serif";
const sans = "'DM Sans', system-ui, sans-serif";

function useFonts() {
  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@400;500;600;700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);
    return () => { document.head.removeChild(fontLink); };
  }, []);
}

function softButtonShadow() {
  return "0 10px 24px rgba(28,24,20,0.06)";
}

function LHCLogo({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 440 440" role="img" aria-label="Lonely Hearts Club">
      <title>Lonely Hearts Club</title>
      <defs>
        <radialGradient id="lhcGradient" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#D96E43" />
          <stop offset="100%" stopColor="#A63E1E" />
        </radialGradient>
      </defs>
      <circle cx="220" cy="220" r="218" fill="url(#lhcGradient)" />
      <circle cx="220" cy="220" r="203" fill="none" stroke="#FAF7F2" strokeWidth="2.5" />
      <circle cx="220" cy="220" r="188" fill="#FAF7F2" />
      <circle cx="220" cy="220" r="173" fill="none" stroke="#C4562C" strokeWidth="1.5" />
      <g fill="#FAF7F2">
        <circle cx="220" cy="5" r="4" /><circle cx="220" cy="435" r="4" />
        <circle cx="5" cy="220" r="4" /><circle cx="435" cy="220" r="4" />
        <circle cx="67" cy="67" r="3" /><circle cx="373" cy="67" r="3" />
        <circle cx="67" cy="373" r="3" /><circle cx="373" cy="373" r="3" />
      </g>
      <path d="M220,84 C217,78 208,78 208,87 C208,96 220,106 220,106 C220,106 232,96 232,87 C232,78 223,78 220,84 Z" fill="#C4562C" />
      <text x="220" y="126" textAnchor="middle" fontFamily={sans} fontSize="13" fontWeight="700" fill="#C4562C" letterSpacing="7">THE</text>
      <line x1="168" y1="134" x2="272" y2="134" stroke="#C4562C" strokeWidth="0.8" opacity="0.5" />
      <text x="220" y="181" textAnchor="middle" fontFamily={serif} fontSize="46" fontWeight="900" fill="#1C1814" letterSpacing="1">LONELY</text>
      <text x="220" y="234" textAnchor="middle" fontFamily={serif} fontSize="46" fontWeight="900" fill="#C4562C" letterSpacing="1">HEARTS</text>
      <text x="220" y="287" textAnchor="middle" fontFamily={serif} fontSize="46" fontWeight="900" fill="#1C1814" letterSpacing="1">CLUB</text>
      <g transform="translate(220,308)">
        <line x1="-70" y1="0" x2="-18" y2="0" stroke="#C4562C" strokeWidth="0.8" opacity="0.6" />
        <circle cx="0" cy="0" r="3" fill="#C4562C" />
        <line x1="18" y1="0" x2="70" y2="0" stroke="#C4562C" strokeWidth="0.8" opacity="0.6" />
        <circle cx="-11" cy="0" r="1.5" fill="#C4562C" opacity="0.6" />
        <circle cx="11" cy="0" r="1.5" fill="#C4562C" opacity="0.6" />
      </g>
      <text x="220" y="340" textAnchor="middle" fontFamily={sans} fontSize="11" fontWeight="600" fill="#8B6914" letterSpacing="3">DATEN ZONDER FOTO'S</text>
      <line x1="168" y1="352" x2="272" y2="352" stroke="#C4562C" strokeWidth="0.8" opacity="0.4" />
      <text x="220" y="370" textAnchor="middle" fontFamily={sans} fontSize="10" fontWeight="600" fill="#C4562C" letterSpacing="3">NL · 2026</text>
    </svg>
  );
}

function Rule({ color = C.border }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
      <div style={{ flex: 1, height: 1, background: color }} />
      <span style={{ color: C.textDim, fontSize: 8, letterSpacing: 4 }}>✦</span>
      <div style={{ flex: 1, height: 1, background: color }} />
    </div>
  );
}

function PrimaryBtn({ onClick, children, style = {} }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", padding: "14px 20px",
      background: `linear-gradient(180deg, ${C.terra}, ${C.terraDeep})`,
      border: "none", borderRadius: 999,
      color: C.white, fontSize: 12, fontFamily: sans,
      fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
      cursor: "pointer",
      boxShadow: "0 10px 24px rgba(196, 86, 44, 0.25)",
      transition: "transform 0.18s ease, box-shadow 0.18s ease",
      ...style,
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 14px 28px rgba(196, 86, 44, 0.32)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.boxShadow = "0 10px 24px rgba(196, 86, 44, 0.25)"; }}
    >{children}</button>
  );
}

function GlassCard({ children, style = {} }) {
  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(255,255,255,0.72))",
      backdropFilter: "blur(18px)",
      border: `1px solid ${C.border}`,
      boxShadow: "0 18px 60px rgba(28,24,20,0.08)",
      borderRadius: 24,
      ...style,
    }}>{children}</div>
  );
}

function DesktopLanding({ onPrototype, onPrivacy, onLogin, user, onLogout }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t); }, []);

  const sectionChip = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "8px 14px", borderRadius: 999,
    background: "rgba(196,86,44,0.08)", color: C.terra,
    fontFamily: sans, fontSize: 10, fontWeight: 700,
    letterSpacing: 3, textTransform: "uppercase",
  };

  return (
    <div style={{
      minHeight: "100vh", color: C.text, fontFamily: sans,
      background: `radial-gradient(circle at 15% 20%, rgba(196,86,44,0.08), transparent 26%), radial-gradient(circle at 85% 25%, rgba(142,107,31,0.08), transparent 22%), radial-gradient(circle at 50% 85%, rgba(45,106,79,0.06), transparent 28%), linear-gradient(180deg, #FBF6EF 0%, #F7F0E7 100%)`,
    }}>
      <nav style={{ padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, background: "rgba(251,246,239,0.82)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LHCLogo size={42} />
          <div>
            <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: C.text, lineHeight: 1 }}>Lonely Hearts Club</div>
            <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>eerst connectie, dan daten</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <a href="#hoe" style={{ color: C.textMid, fontSize: 13, textDecoration: "none" }}>Hoe het werkt</a>
          <a href="#waarom" style={{ color: C.textMid, fontSize: 13, textDecoration: "none" }}>Waarom anders</a>
          {user ? (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontFamily: sans, fontSize: 13, color: C.textMid }}>{user.email}</span>
              <button onClick={onLogout} style={{ padding: "9px 18px", background: "transparent", border: `1.5px solid ${C.border}`, color: C.textMid, borderRadius: 999, fontFamily: sans, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Uitloggen</button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onLogin} style={{ padding: "9px 18px", background: "transparent", border: `1.5px solid ${C.border}`, color: C.textMid, borderRadius: 999, fontFamily: sans, fontSize: 12, fontWeight: 600, letterSpacing: 1, cursor: "pointer" }}>Inloggen</button>
              <button onClick={onLogin} style={{ padding: "9px 18px", background: `linear-gradient(180deg, ${C.terra}, ${C.terraDeep})`, border: "none", color: C.white, borderRadius: 999, fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: 1, cursor: "pointer", boxShadow: "0 6px 16px rgba(196,86,44,0.25)" }}>Registreer gratis</button>
            </div>
          )}
          <button onClick={onPrototype} style={{ padding: "9px 18px", background: "transparent", border: `1.5px solid ${C.terra}`, color: C.terra, borderRadius: 999, fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: 1, cursor: "pointer" }}>Bekijk prototype</button>
        </div>
      </nav>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "84px 28px 76px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 64, alignItems: "center", opacity: vis ? 1 : 0, transition: "opacity 0.7s ease" }}>
        <div>
          <div style={sectionChip}>Nederland · 2026 · Gratis</div>
          <h1 style={{ fontFamily: serif, fontSize: 60, fontWeight: 700, lineHeight: 1.03, margin: "18px 0 22px", color: C.text, letterSpacing: -0.6 }}>
            Dating begint<br />met een <em style={{ color: C.terra, fontStyle: "italic" }}>stem</em>,<br />niet een gezicht.
          </h1>
          <p style={{ fontSize: 17, color: C.textMid, lineHeight: 1.9, margin: "0 0 34px", maxWidth: 470 }}>Bij Lonely Hearts Club leer je iemand kennen van binnenuit. Eerst een anoniem gesprek, dan pas een gezicht. Rustiger, veiliger en veel persoonlijker.</p>
          {!user ? (
            <div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <PrimaryBtn onClick={onLogin} style={{ width: "auto", padding: "15px 32px", fontSize: 14 }}>
                  Word lid — gratis →
                </PrimaryBtn>
                <button onClick={onLogin} style={{ padding: "15px 24px", background: "transparent", border: `1.5px solid ${C.border}`, borderRadius: 999, color: C.textMid, fontFamily: sans, fontSize: 14, cursor: "pointer" }}>
                  Inloggen
                </button>
              </div>
              <p style={{ fontSize: 12, color: C.textDim, marginTop: 12 }}>
                Gratis · Je staat eerst op een wachtlijst · Geen foto's vereist
              </p>
            </div>
          ) : (
            <div style={{ padding: "16px 20px", border: `1.5px solid ${C.green}33`, background: "rgba(45,106,79,0.08)", borderRadius: 18, display: "inline-flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: C.green, fontSize: 18 }}>✓</span>
              <span style={{ fontSize: 14, color: C.green, fontWeight: 700 }}>Je bent ingelogd als {user.email}</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <div style={{ filter: "drop-shadow(0 24px 60px rgba(28,24,20,0.16))" }}><LHCLogo size={276} /></div>
          <button onClick={onPrototype} style={{ padding: "11px 28px", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(10px)", border: `1.5px solid ${C.terra}55`, color: C.terra, borderRadius: 999, fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>Bekijk prototype →</button>
        </div>
      </section>

      <section id="hoe" style={{ background: C.card, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "82px 28px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ ...sectionChip, marginBottom: 14 }}>Hoe het werkt</div>
            <h2 style={{ fontFamily: serif, fontSize: 40, fontWeight: 700, color: C.text, margin: 0, letterSpacing: -0.4 }}>Vier stappen naar echte verbinding</h2>
            <p style={{ color: C.textMid, maxWidth: 720, margin: "14px auto 0", lineHeight: 1.8 }}>Geen snelle swipe-cultuur, maar een rustige flow waarin je eerst iemand leert kennen via woorden en stem.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 18 }}>
            {[
              { n: "01", title: "Profiel zonder foto", desc: "Beschrijf wie je bent in woorden. Geen filters, geen poses. Gewoon jij.", color: C.bronze, icon: "◆" },
              { n: "02", title: "Anoniem bellen", desc: "Een gesprek van 10 minuten. Jullie nummers blijven verborgen voor elkaar.", color: C.terra, icon: "☎" },
              { n: "03", title: "Videogesprek", desc: "Na 3 gesprekken kun je elkaar voor het eerst écht zien via video.", color: "#6B4E8A", icon: "◉" },
              { n: "04", title: "Echte afspraak", desc: "Jullie kennen elkaar al. De eerste date voelt als een tweede.", color: C.green, icon: "♥" },
            ].map((s, i) => (
              <GlassCard key={i} style={{ padding: "26px 22px", borderTop: `3px solid ${s.color}`, borderRadius: 22 }}>
                <div style={{ fontSize: 20, color: s.color, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontFamily: sans, fontSize: 9, letterSpacing: 3, color: s.color, fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>{s.n}</div>
                <h3 style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 10px", lineHeight: 1.15 }}>{s.title}</h3>
                <p style={{ fontFamily: sans, fontSize: 13, color: C.textMid, lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section id="waarom" style={{ maxWidth: 1180, margin: "0 auto", padding: "82px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
        <div>
          <div style={{ ...sectionChip, marginBottom: 14 }}>Waarom anders</div>
          <h2 style={{ fontFamily: serif, fontSize: 40, fontWeight: 700, color: C.text, margin: "0 0 22px", lineHeight: 1.12, letterSpacing: -0.4 }}>Tinder is gemaakt<br />voor uiterlijk. Wij niet.</h2>
          <p style={{ fontFamily: sans, fontSize: 15, color: C.textMid, lineHeight: 1.9, marginBottom: 18 }}>Op de meeste datingapps beslis je in twee seconden op basis van een foto. Bij Lonely Hearts Club leer je eerst wie iemand is — en pas daarna zie je hoe diegene eruitziet.</p>
          <p style={{ fontFamily: sans, fontSize: 15, color: C.textMid, lineHeight: 1.9 }}>Het resultaat: diepere verbindingen, minder oppervlakkigheid, en een eerste date die voelt als een tweede.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Tinder / Bumble", text: "Foto eerst, dan pas praten", bad: true },
            { label: "Lonely Hearts Club", text: "Stem eerst, dan pas zien", bad: false },
          ].map((s, i) => (
            <GlassCard key={i} style={{ padding: "18px 20px", background: s.bad ? "rgba(255,255,255,0.62)" : "rgba(253,248,244,0.88)", border: `1.5px solid ${s.bad ? C.border : C.terra + "66"}`, borderRadius: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: s.bad ? C.border : C.terra, display: "flex", alignItems: "center", justifyContent: "center", color: s.bad ? C.textDim : C.white, fontSize: 14, flexShrink: 0 }}>{s.bad ? "✕" : "♥"}</div>
              <div>
                <div style={{ fontFamily: sans, fontSize: 10, letterSpacing: 2, color: s.bad ? C.textDim : C.terra, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>{s.label}</div>
                <div style={{ fontFamily: sans, fontSize: 14, color: s.bad ? C.textMid : C.text, fontWeight: s.bad ? 400 : 700 }}>{s.text}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      <section style={{ background: C.bgDark, padding: "82px 28px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <LHCLogo size={84} />
          <h2 style={{ fontFamily: serif, fontSize: 42, fontWeight: 700, color: C.white, margin: "26px 0 16px", letterSpacing: -0.4 }}>Klaar voor een echte verbinding?</h2>
          <p style={{ fontFamily: sans, fontSize: 15, color: "#A89A8D", marginBottom: 32, lineHeight: 1.8 }}>Schrijf je in en ontvang een bericht als we live gaan.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <PrimaryBtn onClick={onLogin} style={{ width: "auto", padding: "15px 32px", fontSize: 14 }}>Word lid — gratis →</PrimaryBtn>
          </div>
          <p style={{ fontFamily: sans, fontSize: 12, color: "#6A5A52", marginTop: 14 }}>Je staat eerst op een wachtlijst totdat we genoeg leden hebben.</p>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid #2C2420`, background: C.bgDark, padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LHCLogo size={32} />
          <span style={{ fontFamily: serif, fontSize: 14, color: "#8A7C72" }}>Lonely Hearts Club</span>
        </div>
        <span style={{ fontFamily: sans, fontSize: 11, color: "#5A4D43", letterSpacing: 2, textTransform: "uppercase" }}>Est. 2026 · Nederland</span>
        <button onClick={onPrivacy} style={{ background: "none", border: "none", fontFamily: sans, fontSize: 11, color: "#8A7C72", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>Privacyverklaring</button>
      </footer>
    </div>
  );
}

function MobileApp({ onLogin, isPrototype = false, user, onLogout }) {
  const [idx, setIdx] = useState(0);
  const screens = ["Home", "Profiel", "Ontdek", "Match", "Bellen", "Review"];
  const [step, setStep] = useState(0);
  const [profileIdx, setProfileIdx] = useState(0);
  const [secs, setSecs] = useState(0);
  const [bars, setBars] = useState(Array(18).fill(4));
  const [muted, setMuted] = useState(false);
  const [scale, setScale] = useState(1);
  const [stars, setStars] = useState(4);

  const [geslacht, setGeslacht] = useState("");
  const [zoekt, setZoekt] = useState("");
  const [voorkeurConsent, setVoorkeurConsent] = useState(false);
  const [profielNaam, setProfielNaam] = useState("Marcel");
  const [profielLeeftijd, setProfielLeeftijd] = useState("48");
  const [profielVerhaal, setProfielVerhaal] = useState("Avontuurlijk, eerlijk, op zoek naar verbinding.");
  const [profielPassies, setProfielPassies] = useState("Hardlopen, schilderen, reizen.");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");

  const saveProfile = async () => {
    if (!user) return;
    setSaveLoading(true);
    setSaveError("");
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        voornaam: profielNaam,
        leeftijd: parseInt(profielLeeftijd) || 0,
        geslacht: geslacht,
        zoekt: zoekt,
        verhaal: profielVerhaal,
        passies: profielPassies.split(",").map(p => p.trim()).filter(Boolean),
        actief: true,
      });
      if (error) throw error;
      next();
    } catch (err) {
      setSaveError(err.message);
    }
    setSaveLoading(false);
  };

  const profileSteps = useMemo(() => [
    { label: "Naam",     q: "Wat is je voornaam?",          val: "Marcel",                                         type: "input" },
    { label: "Leeftijd", q: "Hoe oud ben je?",              val: "48",                                             type: "input" },
    { label: "Geslacht", q: "Wat is je geslacht?",          val: "",                                               type: "geslacht" },
    { label: "Voorkeur", q: "Wie zoek je?",                 val: "",                                               type: "voorkeur" },
    { label: "Verhaal",  q: "Omschrijf jezelf in één zin",  val: "Avontuurlijk, eerlijk, op zoek naar verbinding.", type: "area" },
    { label: "Passies",  q: "Wat zijn je passies?",         val: "Hardlopen, schilderen, reizen.",                  type: "area" },
  ], []);

  const accent = [C.bronze, "#6B4E8A", C.terra, C.terra, C.green, C.bronze];
  const profiles = useMemo(() => [
    { name: "Sarah", age: 42, tagline: "Dromer met beide voeten op de grond", bio: "Op zoek naar echte gesprekken en verbinding. Ik hou van natuur en eerlijke mensen.", tags: ["Natuur", "Lezen", "Koken"], match: 94 },
    { name: "Linda", age: 45, tagline: "Nieuwsgierig naar het leven", bio: "Moeder, reiziger, yogalerares. De mooiste liefde begint bij een goed gesprek.", tags: ["Yoga", "Reizen", "Theater"], match: 87 },
  ], []);

  const p = profiles[profileIdx] || profiles[0];
  const ps = profileSteps[step];
  const pa = accent[step];

  useEffect(() => {
    if (idx !== 4) return;
    const t = setInterval(() => { setSecs(s => s + 1); setBars(b => b.map(() => Math.floor(Math.random() * 10) + 2)); }, 1000);
    return () => clearInterval(t);
  }, [idx]);

  useEffect(() => {
    if (idx !== 3) return;
    const t = setInterval(() => setScale(s => s === 1 ? 1.08 : 1), 1100);
    return () => clearInterval(t);
  }, [idx]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const next = () => setIdx(i => Math.min(i + 1, screens.length - 1));

  const Header = ({ label, title }) => (
    <div style={{ background: "rgba(255,255,255,0.86)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}`, padding: "12px 18px", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 12px 28px rgba(28,24,20,0.05)" }}>
      <div>
        <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: C.terra, fontWeight: 700, textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontFamily: serif, fontSize: 17, color: C.text, fontWeight: 700, marginTop: 2 }}>{title}</div>
      </div>
      <LHCLogo size={36} />
    </div>
  );

  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(circle at 18% 18%, rgba(196,86,44,0.08), transparent 34%), radial-gradient(circle at 82% 22%, rgba(142,107,31,0.08), transparent 30%), ${C.bg}`, display: "flex", flexDirection: "column", fontFamily: sans, overflow: "hidden" }}>
      <div style={{ padding: "10px 20px 6px", display: "flex", justifyContent: "space-between", fontFamily: sans, fontSize: 10, color: C.textDim, flexShrink: 0, background: "rgba(255,255,255,0.78)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${C.border}` }}>
        <span>9:41</span>
        <span style={{ color: C.terra, letterSpacing: 1, fontWeight: 700 }}>Lonely Hearts Club</span>
        <span>●●●</span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {idx === 0 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg, overflow: "hidden" }}>
            <div style={{ background: C.terra, padding: "8px 0", textAlign: "center" }}>
              <span style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: C.white, fontWeight: 700 }}>LONELYHEARTSCLUB.NL</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 20px 16px", overflowY: "auto" }}>
              <div style={{ filter: "drop-shadow(0 18px 36px rgba(28,24,20,0.12))" }}><LHCLogo size={120} /></div>
              <p style={{ fontFamily: sans, fontSize: 13, color: C.terra, textAlign: "center", margin: "10px 0 12px" }}>Dating begint met een stem</p>
              <Rule />
              <div style={{ width: "100%", marginBottom: 20 }}>
                {[
                  { n: "01", text: "Profiel zonder foto", color: C.bronze },
                  { n: "02", text: "Anoniem bellen", color: C.terra },
                  { n: "03", text: "Videogesprek", color: "#6B4E8A" },
                  { n: "04", text: "Echte afspraak", color: C.green },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "9px 14px", marginBottom: 5, borderLeft: `2px solid ${s.color}`, background: `${s.color}12`, borderRadius: 14 }}>
                    <span style={{ fontFamily: sans, fontSize: 9, color: s.color, fontWeight: 700, width: 20 }}>{s.n}</span>
                    <span style={{ fontFamily: sans, fontSize: 13, color: C.text }}>{s.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ width: "100%" }}>
                {user ? (
                  // Already logged in
                  <>
                    <div style={{ padding: "12px 16px", border: `1.5px solid ${C.green}55`, background: "rgba(45,106,79,0.08)", borderRadius: 18, textAlign: "center", marginBottom: 10 }}>
                      <p style={{ fontFamily: sans, fontSize: 13, color: C.green, margin: 0, fontWeight: 700 }}>✓ Ingelogd als {user.email}</p>
                    </div>
                    <PrimaryBtn onClick={next}>Ga naar de app →</PrimaryBtn>
                  </>
                ) : !isPrototype ? (
                  // Not logged in, real mobile
                  <>
                    <PrimaryBtn onClick={onLogin}>Word lid — gratis →</PrimaryBtn>
                    <p style={{ fontFamily: sans, fontSize: 11, color: C.textDim, textAlign: "center", marginTop: 8 }}>Je staat eerst op een wachtlijst · Geen foto's vereist</p>
                    <button onClick={next} style={{ width: "100%", marginTop: 10, padding: "13px", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", border: `1.5px solid ${C.terra}55`, borderRadius: 999, color: C.terra, fontFamily: sans, fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
                      Bekijk prototype →
                    </button>
                  </>
                ) : (
                  // Prototype mode on desktop
                  <button onClick={next} style={{ width: "100%", padding: "13px", background: "transparent", border: `1.5px solid ${C.terra}`, borderRadius: 999, color: C.terra, fontFamily: sans, fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
                    Bekijk de app →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {idx === 1 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg, overflow: "hidden" }}>
            <Header label="Jouw profiel" title="Vertel je verhaal" />

            {/* NAV BAR - boven de content */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: C.terra, flexShrink: 0, minHeight: 48 }}>
              <button
                onClick={() => step > 0 && setStep(s => s - 1)}
                style={{ padding: "7px 14px", background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: 999, color: C.white, fontFamily: sans, fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0, opacity: step > 0 ? 1 : 0.3 }}
              >← Terug</button>
              <div style={{ flex: 1, display: "flex", gap: 3 }}>
                {profileSteps.map((_, i) => (<div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: i <= step ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)" }} />))}
              </div>
              <button
                onClick={() => {
                  if (ps.type === "voorkeur" && !voorkeurConsent) return;
                  if (step < profileSteps.length - 1) {
                    setStep(s => s + 1);
                  } else {
                    saveProfile();
                  }
                }}
                style={{ padding: "7px 18px", background: C.white, border: "none", borderRadius: 999, color: C.terra, fontFamily: sans, fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0, opacity: (ps.type === "voorkeur" && !voorkeurConsent) ? 0.4 : 1 }}
              >{saveLoading ? "Opslaan..." : step < profileSteps.length - 1 ? "Verder →" : "Opslaan ✓"}</button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "12px 18px" }}>
              {saveError && (
                <div style={{ padding: "10px 14px", background: "rgba(192,57,43,0.08)", borderRadius: 10, marginBottom: 10 }}>
                  <p style={{ fontFamily: sans, fontSize: 12, color: "#C0392B", margin: 0 }}>⚠ {saveError}</p>
                </div>
              )}
              <GlassCard style={{ padding: "8px 14px", marginBottom: 10, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ color: C.terra }}>◆</span>
                <span style={{ fontFamily: sans, fontSize: 12, color: C.textMid, fontStyle: "italic" }}>Geen foto. Jij bent meer dan een plaatje.</span>
              </GlassCard>
              <GlassCard style={{ border: `1.5px solid ${pa}40`, padding: 14, marginBottom: 10 }}>
                <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: pa, marginBottom: 8, fontWeight: 700, textTransform: "uppercase" }}>{ps.label}</div>
                <h3 style={{ fontFamily: serif, fontSize: 18, color: C.text, margin: "0 0 12px", fontWeight: 700, lineHeight: 1.1 }}>{ps.q}</h3>
                {ps.type === "input" && ps.label === "Naam" && (
                  <input value={profielNaam} onChange={e => setProfielNaam(e.target.value)} style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 18, padding: "12px 12px", fontFamily: serif, outline: "none", boxSizing: "border-box", borderRadius: 14 }} />
                )}
                {ps.type === "input" && ps.label === "Leeftijd" && (
                  <input value={profielLeeftijd} onChange={e => setProfielLeeftijd(e.target.value)} type="number" style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 18, padding: "12px 12px", fontFamily: serif, outline: "none", boxSizing: "border-box", borderRadius: 14 }} />
                )}
                {ps.type === "area" && ps.label === "Verhaal" && (
                  <textarea value={profielVerhaal} onChange={e => setProfielVerhaal(e.target.value)} rows={3} style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 13, padding: "12px 12px", fontFamily: sans, outline: "none", resize: "none", boxSizing: "border-box", lineHeight: 1.7, borderRadius: 14 }} />
                )}
                {ps.type === "area" && ps.label === "Passies" && (
                  <textarea value={profielPassies} onChange={e => setProfielPassies(e.target.value)} rows={3} style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 13, padding: "12px 12px", fontFamily: sans, outline: "none", resize: "none", boxSizing: "border-box", lineHeight: 1.7, borderRadius: 14 }} />
                )}
                {ps.type === "geslacht" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {["Man", "Vrouw", "Anders"].map(opt => (
                      <button key={opt} onClick={() => setGeslacht(opt)} style={{ padding: "12px 16px", borderRadius: 14, border: `1.5px solid ${geslacht === opt ? pa : C.border}`, background: geslacht === opt ? `${pa}12` : "transparent", color: geslacht === opt ? pa : C.textMid, fontFamily: sans, fontSize: 14, fontWeight: geslacht === opt ? 700 : 400, cursor: "pointer", textAlign: "left" }}>
                        {geslacht === opt ? "✓ " : ""}{opt}
                      </button>
                    ))}
                  </div>
                )}
                {ps.type === "voorkeur" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {["Ik zoek mannen", "Ik zoek vrouwen", "Ik zoek iedereen"].map(opt => (
                      <button key={opt} onClick={() => setZoekt(opt)} style={{ padding: "12px 16px", borderRadius: 14, border: `1.5px solid ${zoekt === opt ? pa : C.border}`, background: zoekt === opt ? `${pa}12` : "transparent", color: zoekt === opt ? pa : C.textMid, fontFamily: sans, fontSize: 14, fontWeight: zoekt === opt ? 700 : 400, cursor: "pointer", textAlign: "left" }}>
                        {zoekt === opt ? "✓ " : ""}{opt}
                      </button>
                    ))}
                    <div style={{ marginTop: 8, padding: "12px 14px", background: "rgba(196,86,44,0.04)", borderRadius: 14, border: `1px solid ${C.border}` }}>
                      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
                        <input type="checkbox" checked={voorkeurConsent} onChange={e => setVoorkeurConsent(e.target.checked)} style={{ marginTop: 2, accentColor: pa, width: 16, height: 16, flexShrink: 0 }} />
                        <span style={{ fontFamily: sans, fontSize: 11, color: C.textMid, lineHeight: 1.5 }}>
                          Ik geef toestemming voor het verwerken van mijn seksuele voorkeur conform de{" "}
                          <span style={{ color: C.terra, textDecoration: "underline" }}>privacyverklaring</span>
                          {" "}(AVG artikel 9)
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </GlassCard>
              {step === 5 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {[["Hardlopen", true], ["Kunst", true], ["Reizen", true], ["Lezen", false], ["Wijn", false]].map(([t, active], i) => (
                    <span key={i} style={{ padding: "5px 14px", fontSize: 12, border: `1px solid ${active ? C.terra : C.border}`, color: active ? C.terra : C.textDim, background: active ? "#FDF0EC" : "rgba(255,255,255,0.7)", cursor: "pointer", borderRadius: 999 }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {idx === 2 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
            <Header label="Nieuwe leden" title="Ontdek matches" />
            <div style={{ flex: 1, padding: 14, display: "flex", flexDirection: "column" }}>
              <GlassCard style={{ flex: 1, padding: 18, marginBottom: 10, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ width: 54, height: 54, borderRadius: "50%", background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 18, color: C.textDim }}>?</div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, color: C.terra, lineHeight: 1 }}>{p.match}%</div>
                    <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 2, color: C.textDim, fontWeight: 700, textTransform: "uppercase", marginTop: 3 }}>Match</div>
                  </div>
                </div>
                <h3 style={{ fontFamily: serif, fontSize: 21, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>{p.name}, {p.age}</h3>
                <p style={{ fontFamily: sans, fontSize: 12, color: C.terra, margin: "0 0 14px" }}>{p.tagline}</p>
                <Rule />
                <p style={{ fontFamily: sans, fontSize: 13, color: C.textMid, lineHeight: 1.7, flex: 1 }}>{p.bio}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
                  {p.tags.map((t, i) => <span key={i} style={{ padding: "4px 12px", border: `1px solid ${C.border}`, fontFamily: sans, fontSize: 11, color: C.textMid, borderRadius: 999, background: "rgba(255,255,255,0.8)" }}>{t}</span>)}
                </div>
                <div style={{ marginTop: 12, padding: "9px 12px", background: "rgba(242,237,229,0.9)", display: "flex", gap: 8, alignItems: "center", borderRadius: 14, border: `1px solid ${C.border}` }}>
                  <span style={{ color: C.terra, fontSize: 10 }}>◆</span>
                  <span style={{ fontFamily: sans, fontSize: 10, color: C.textDim, letterSpacing: 1, textTransform: "uppercase" }}>Foto zichtbaar na eerste gesprek</span>
                </div>
              </GlassCard>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setProfileIdx(i => Math.min(i + 1, profiles.length - 1))} style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.88)", border: `1px solid ${C.border}`, color: C.textDim, fontSize: 16, cursor: "pointer", borderRadius: 999 }}>✕</button>
                <PrimaryBtn onClick={next} style={{ flex: 3 }}>♥ &nbsp;Interesse</PrimaryBtn>
                <button style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.88)", border: `1px solid ${C.border}`, color: C.bronze, fontSize: 16, cursor: "pointer", borderRadius: 999 }}>★</button>
              </div>
            </div>
          </div>
        )}

        {idx === 3 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
            <div style={{ background: `linear-gradient(180deg, ${C.terra}, ${C.terraDeep})`, padding: "10px 0", textAlign: "center", boxShadow: "0 12px 24px rgba(196,86,44,0.22)" }}>
              <span style={{ fontFamily: sans, fontSize: 8, letterSpacing: 5, color: C.white, fontWeight: 700, textTransform: "uppercase" }}>Het is wederzijds</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 18px" }}>
              <div style={{ fontSize: 72, marginBottom: 20, color: C.terra, transform: `scale(${scale})`, transition: "transform 0.5s ease" }}>♥</div>
              <GlassCard style={{ width: "100%", padding: 20, textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: C.terra, marginBottom: 8, fontWeight: 700, textTransform: "uppercase" }}>Jullie hebben een klik</div>
                <h2 style={{ fontFamily: serif, fontSize: 23, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Jij & Sarah</h2>
                <p style={{ fontFamily: sans, fontSize: 12, color: C.textDim, margin: 0 }}>Beiden tonen interesse</p>
              </GlassCard>
              {[
                { n: "I", label: "Anoniem bellen", sub: "10 min · Nu beschikbaar", active: true, color: C.terra },
                { n: "II", label: "Videobel", sub: "Na 3 gesprekken", active: false, color: "#6B4E8A" },
                { n: "III", label: "Afspreken", sub: "Na videogesprek", active: false, color: C.green },
              ].map(s => (
                <div key={s.n} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", marginBottom: 6, borderLeft: `2px solid ${s.active ? s.color : C.border}`, background: s.active ? "#FDF0EC" : C.card, opacity: s.active ? 1 : 0.72, borderRadius: 14 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", border: `1px solid ${s.active ? s.color : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 9, color: s.active ? s.color : C.textDim, flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: s.active ? C.text : C.textDim }}>{s.label}</div>
                    <div style={{ fontFamily: sans, fontSize: 10, color: s.active ? s.color : C.textDim }}>{s.sub}</div>
                  </div>
                  {s.active && <div style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: C.green }} />}
                </div>
              ))}
              <PrimaryBtn onClick={next} style={{ marginTop: 16 }}>☎ &nbsp;Bel Sarah nu</PrimaryBtn>
            </div>
          </div>
        )}

        {idx === 4 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
            <div style={{ background: C.green, padding: "8px 20px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.white }} />
              <span style={{ fontFamily: sans, fontSize: 9, letterSpacing: 3, color: C.white, fontWeight: 700, textTransform: "uppercase" }}>Anoniem gesprek actief</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around", padding: "24px 18px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 90, height: 90, borderRadius: "50%", background: C.card, border: `1.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 30, color: C.textDim, margin: "0 auto 12px" }}>?</div>
                <h2 style={{ fontFamily: serif, fontSize: 19, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Sarah, 42</h2>
                <p style={{ fontFamily: sans, fontSize: 10, color: C.textDim, margin: 0 }}>Nummers verborgen voor beiden</p>
              </div>
              <GlassCard style={{ padding: "14px 28px", textAlign: "center" }}>
                <div style={{ fontFamily: sans, fontSize: 32, fontWeight: 700, color: C.text, letterSpacing: 4 }}>{fmt(secs)}</div>
                <div style={{ fontFamily: sans, fontSize: 9, color: C.textDim, letterSpacing: 2, marginTop: 4, textTransform: "uppercase" }}>{Math.max(0, 600 - secs)}s resterend</div>
              </GlassCard>
              <div style={{ display: "flex", gap: 3, alignItems: "center", height: 26 }}>
                {bars.map((h, i) => (<div key={i} style={{ width: 3, borderRadius: 2, height: h * 1.8, background: i % 2 === 0 ? C.terra : C.bronze, opacity: 0.65, transition: "height 0.2s ease" }} />))}
              </div>
              <GlassCard style={{ width: "100%", padding: 14 }}>
                <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: C.terra, marginBottom: 6, fontWeight: 700, textTransform: "uppercase" }}>Gespreksstarter</div>
                <p style={{ fontFamily: sans, fontSize: 13, color: C.textMid, margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>"Wat is het mooiste moment dat je ooit hebt meegemaakt op reis?"</p>
              </GlassCard>
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <button onClick={() => setMuted(m => !m)} style={{ width: 48, height: 48, borderRadius: "50%", background: muted ? "#FDF0EC" : C.white, border: `1px solid ${muted ? C.terra : C.border}`, color: muted ? C.terra : C.textDim, fontSize: 16, cursor: "pointer", boxShadow: softButtonShadow() }}>{muted ? "✕" : "♪"}</button>
                <button onClick={next} style={{ width: 62, height: 62, borderRadius: "50%", background: "#C0392B", border: "none", color: C.white, fontSize: 20, cursor: "pointer", boxShadow: "0 8px 18px rgba(192,57,43,0.28)" }}>✕</button>
                <button style={{ width: 48, height: 48, borderRadius: "50%", background: C.white, border: `1px solid ${C.border}`, color: C.textDim, fontSize: 16, cursor: "pointer", boxShadow: softButtonShadow() }}>◎</button>
              </div>
            </div>
          </div>
        )}

        {idx === 5 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
            <Header label="Gesprek afgerond" title="Jouw beoordeling" />
            <div style={{ flex: 1, padding: "20px 18px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
              <h2 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 6px" }}>Hoe was het met Sarah?</h2>
              <p style={{ fontFamily: sans, fontSize: 13, color: C.textMid, margin: "0 0 20px", lineHeight: 1.6 }}>Jouw terugkoppeling helpt ons betere matches te maken.</p>
              <Rule />
              <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "16px 0 24px" }}>
                {[1, 2, 3, 4, 5].map(i => (<span key={i} onClick={() => setStars(i)} style={{ fontSize: 30, cursor: "pointer", color: i <= stars ? C.bronze : C.border, transition: "all 0.2s", display: "inline-block", transform: i <= stars ? "scale(1.08)" : "scale(1)" }}>★</span>))}
              </div>
              <GlassCard style={{ padding: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: sans, fontSize: 9, letterSpacing: 2, color: C.textDim, fontWeight: 700, textTransform: "uppercase" }}>Voortgang naar video</span>
                  <span style={{ fontFamily: serif, fontSize: 13, fontWeight: 700, color: C.terra }}>1 / 3</span>
                </div>
                <div style={{ height: 4, background: C.border, marginBottom: 8, borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: "33%", height: "100%", background: `linear-gradient(90deg, ${C.terra}, ${C.gold})` }} />
                </div>
                <p style={{ fontFamily: sans, fontSize: 10, color: C.textDim, margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>Nog 2 gesprekken voor video</p>
              </GlassCard>
              <div style={{ flex: 1 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setIdx(i => Math.max(i - 1, 0))} style={{ flex: 1, padding: "13px", background: "rgba(255,255,255,0.88)", border: `1px solid ${C.border}`, color: C.textMid, fontFamily: sans, fontSize: 12, cursor: "pointer", borderRadius: 999 }}>← Terug</button>
                <PrimaryBtn onClick={() => setIdx(0)} style={{ flex: 2 }}>Opslaan ✓</PrimaryBtn>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", borderTop: `1px solid ${C.border}`, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", flexShrink: 0 }}>
        {screens.map((s, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ flex: 1, padding: "10px 0", background: "transparent", border: "none", fontFamily: sans, fontSize: 8, color: i === idx ? C.terra : C.textDim, fontWeight: i === idx ? 700 : 400, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", borderTop: i === idx ? `2px solid ${C.terra}` : "2px solid transparent" }}>{s}</button>
        ))}
      </div>
    </div>
  );
}

function CookieNotice({ onAccept }) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(23,19,17,0.96)", borderTop: `1px solid ${C.terra}40`, padding: "16px 20px", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap", backdropFilter: "blur(12px)" }}>
      <p style={{ fontFamily: sans, fontSize: 13, color: "#A7988D", margin: 0, flex: 1, lineHeight: 1.6 }}>
        Wij gebruiken alleen functionele cookies. Geen tracking, geen advertenties.{" "}
        <button onClick={() => window.open("/privacy", "_blank")} style={{ background: "none", border: "none", color: C.terra, fontFamily: sans, fontSize: 13, cursor: "pointer", textDecoration: "underline", padding: 0 }}>Lees onze privacyverklaring</button>
      </p>
      <button onClick={onAccept} style={{ padding: "10px 22px", background: `linear-gradient(180deg, ${C.terra}, ${C.terraDeep})`, border: "none", color: C.white, fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", borderRadius: 999, boxShadow: "0 10px 24px rgba(196, 86, 44, 0.22)" }}>Akkoord</button>
    </div>
  );
}

function PrivacyPage({ onBack }) {
  const today = new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });

  const Section = ({ n, title, children }) => (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 12px", borderBottom: `2px solid ${C.terra}`, paddingBottom: 8 }}>{n}. {title}</h2>
      {children}
    </div>
  );
  const P = ({ children }) => <p style={{ fontFamily: sans, fontSize: 14, color: C.textMid, lineHeight: 1.8, margin: "0 0 10px" }}>{children}</p>;
  const Ul = ({ items }) => (
    <ul style={{ paddingLeft: 20, margin: "8px 0 12px" }}>
      {items.map((item, i) => <li key={i} style={{ fontFamily: sans, fontSize: 14, color: C.textMid, lineHeight: 1.8, marginBottom: 4 }}>{item}</li>)}
    </ul>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: sans }}>
      <div style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${C.border}`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.terra, fontFamily: sans, fontSize: 13, cursor: "pointer" }}>← Terug naar site</button>
        <div style={{ width: 1, height: 20, background: C.border }} />
        <LHCLogo size={28} />
        <span style={{ fontFamily: serif, fontSize: 16, fontWeight: 700, color: C.text }}>Lonely Hearts Club</span>
      </div>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "54px 20px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <LHCLogo size={84} />
          <h1 style={{ fontFamily: serif, fontSize: 40, fontWeight: 700, color: C.text, margin: "20px 0 8px" }}>Privacyverklaring</h1>
          <p style={{ fontFamily: sans, fontSize: 13, color: C.textDim }}>Versie 1.0 · {today}</p>
        </div>
        <Section n="1" title="Wie zijn wij?">
          <P>Lonely Hearts Club is een Nederlandse datingservice die mensen verbindt op basis van persoonlijkheid en stem. Bereikbaar via lonelyheartsclub.nl.</P>
          <GlassCard style={{ padding: "16px 20px", marginTop: 12 }}>
            {[["Bedrijf", "Lonely Hearts Club"], ["Land", "Nederland"], ["E-mail", "privacy@lonelyheartsclub.nl"], ["Website", "lonelyheartsclub.nl"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 16, marginBottom: 6 }}>
                <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.text, width: 80, flexShrink: 0 }}>{k}</span>
                <span style={{ fontFamily: sans, fontSize: 13, color: C.textMid }}>{v}</span>
              </div>
            ))}
          </GlassCard>
        </Section>
        <Section n="2" title="Welke gegevens verzamelen wij?">
          <P><strong>Gegevens die je zelf verstrekt:</strong></P>
          <Ul items={["Voornaam en leeftijd", "E-mailadres", "Profieltekst", "Seksuele voorkeur (bijzonder persoonsgegeven — alleen met expliciete toestemming)", "Stemopnames tijdens gesprekken (tijdelijk, niet opgeslagen)"]} />
          <P><strong>Automatisch verzameld:</strong></P>
          <Ul items={["IP-adres (geanonimiseerd na 30 dagen)", "Browsertype", "Datum en tijdstip van bezoek"]} />
        </Section>
        <Section n="3" title="Bijzondere persoonsgegevens">
          <P>Seksuele voorkeur valt onder bijzondere persoonsgegevens (AVG artikel 9). Verwerking alleen met expliciete toestemming, intrekbaar via privacy@lonelyheartsclub.nl.</P>
        </Section>
        <Section n="4" title="Waarom verwerken wij jouw gegevens?">
          <Ul items={["Leveren van de datingdienst", "Informeren over de lancering", "Verbeteren van de dienst", "Voorkomen van misbruik", "Wettelijke verplichtingen"]} />
        </Section>
        <Section n="5" title="Bewaartermijnen">
          <Ul items={["Wachtlijst: tot 1 jaar of uitschrijving", "Accountgegevens: tot 30 dagen na verwijdering", "Gespreksdata: niet opgeslagen", "Logbestanden: max 90 dagen"]} />
        </Section>
        <Section n="6" title="Met wie delen wij jouw gegevens?">
          <P>Wij verkopen nooit gegevens. Verwerkers: Supabase (EU), Vercel, Tally.so — allen met verwerkersovereenkomst.</P>
        </Section>
        <Section n="7" title="Jouw rechten">
          <P>Inzage, rectificatie, verwijdering, beperking, dataportabiliteit, bezwaar. Mail naar privacy@lonelyheartsclub.nl. Reactie binnen 30 dagen. Klacht: autoriteitpersoonsgegevens.nl.</P>
        </Section>
        <Section n="8" title="Cookies">
          <P>Alleen functionele cookies. Geen tracking of marketing cookies.</P>
        </Section>
        <Section n="9" title="Beveiliging">
          <Ul items={["HTTPS/TLS", "Gehashte wachtwoorden", "Gemaskeerde telefoonnummers via Twilio", "Beperkte toegang tot persoonsgegevens"]} />
        </Section>
        <Section n="10" title="Kinderen">
          <P>Uitsluitend voor personen van 18 jaar en ouder.</P>
        </Section>
        <Section n="11" title="Contact">
          <P>privacy@lonelyheartsclub.nl</P>
          <p style={{ fontFamily: sans, fontSize: 12, color: C.textDim, marginTop: 24, fontStyle: "italic" }}>Datum laatste wijziging: {today}</p>
        </Section>
      </div>
    </div>
  );
}

// ── ONBOARDING WIZARD ─────────────────────────────────────────────────────────
function OnboardingWizard({ user, onComplete }) {
  const [step, setStep] = useState(0);
  const [naam, setNaam] = useState("");
  const [leeftijd, setLeeftijd] = useState("");
  const [geslacht, setGeslacht] = useState("");
  const [zoekt, setZoekt] = useState("");
  const [voorkeurConsent, setVoorkeurConsent] = useState(false);
  const [verhaal, setVerhaal] = useState("");
  const [passies, setPassies] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const steps = [
    { label: "Naam",     title: "Wat is je voornaam?",         type: "input",    hint: "Alleen je voornaam — geen achternaam nodig." },
    { label: "Leeftijd", title: "Hoe oud ben je?",             type: "number",   hint: "Je leeftijd is zichtbaar voor andere leden." },
    { label: "Geslacht", title: "Wat is je geslacht?",         type: "geslacht", hint: "Dit helpt ons je beter te matchen." },
    { label: "Voorkeur", title: "Wie zoek je?",                type: "voorkeur", hint: "Je kunt dit later altijd aanpassen." },
    { label: "Verhaal",  title: "Omschrijf jezelf in één zin", type: "area",     hint: "Wat maakt jou uniek?" },
    { label: "Passies",  title: "Wat zijn je passies?",        type: "area",     hint: "Gescheiden door komma's, bijv: hardlopen, lezen, reizen" },
  ];

  const accent = [C.bronze, "#6B4E8A", C.terra, C.terra, C.green, C.bronze];
  const pa = accent[step];
  const ps = steps[step];

  const canNext = () => {
    if (ps.type === "voorkeur") return zoekt !== "" && voorkeurConsent;
    if (ps.type === "geslacht") return geslacht !== "";
    if (ps.label === "Naam") return naam.trim() !== "";
    if (ps.label === "Leeftijd") return leeftijd !== "" && parseInt(leeftijd) >= 18;
    return true;
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        voornaam: naam.trim(),
        leeftijd: parseInt(leeftijd),
        geslacht,
        zoekt,
        verhaal: verhaal.trim(),
        passies: passies.split(",").map(p => p.trim()).filter(Boolean),
        actief: true,
      });
      if (error) throw error;
      onComplete();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!canNext()) return;
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      handleSave();
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(circle at 15% 20%, rgba(196,86,44,0.08), transparent 26%), ${C.bg}`, fontFamily: sans }}>

      {/* Header */}
      <div style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LHCLogo size={32} />
          <span style={{ fontFamily: serif, fontSize: 16, fontWeight: 700, color: C.text }}>Jouw profiel</span>
        </div>
        <span style={{ fontFamily: sans, fontSize: 12, color: C.textDim }}>{step + 1} van {steps.length}</span>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", gap: 4, padding: "0 24px", background: "rgba(255,255,255,0.9)", paddingBottom: 12 }}>
        {steps.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: i < step ? C.terra : i === step ? pa : C.border, transition: "all 0.3s" }} />
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 540, margin: "0 auto", padding: "40px 24px" }}>

        <div style={{ marginBottom: 8, fontFamily: sans, fontSize: 10, letterSpacing: 4, color: pa, fontWeight: 700, textTransform: "uppercase" }}>{ps.label}</div>
        <h1 style={{ fontFamily: serif, fontSize: 32, fontWeight: 700, color: C.text, margin: "0 0 8px", lineHeight: 1.15 }}>{ps.title}</h1>
        <p style={{ fontFamily: sans, fontSize: 14, color: C.textDim, margin: "0 0 28px" }}>{ps.hint}</p>

        <GlassCard style={{ padding: 20, marginBottom: 16 }}>
          {(ps.label === "Naam") && (
            <input
              autoFocus value={naam} onChange={e => setNaam(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleNext()}
              placeholder="Jouw voornaam"
              style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 22, padding: "14px 16px", fontFamily: serif, outline: "none", boxSizing: "border-box", borderRadius: 14 }}
            />
          )}
          {(ps.label === "Leeftijd") && (
            <input
              autoFocus value={leeftijd} onChange={e => setLeeftijd(e.target.value)} type="number" min="18" max="99"
              onKeyDown={e => e.key === "Enter" && handleNext()}
              placeholder="Bijv. 34"
              style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 22, padding: "14px 16px", fontFamily: serif, outline: "none", boxSizing: "border-box", borderRadius: 14 }}
            />
          )}
          {ps.type === "geslacht" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Man", "Vrouw", "Anders"].map(opt => (
                <button key={opt} onClick={() => setGeslacht(opt)} style={{ padding: "14px 18px", borderRadius: 14, border: `1.5px solid ${geslacht === opt ? pa : C.border}`, background: geslacht === opt ? `${pa}12` : "transparent", color: geslacht === opt ? pa : C.textMid, fontFamily: sans, fontSize: 15, fontWeight: geslacht === opt ? 700 : 400, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                  {geslacht === opt ? "✓ " : ""}{opt}
                </button>
              ))}
            </div>
          )}
          {ps.type === "voorkeur" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Ik zoek mannen", "Ik zoek vrouwen", "Ik zoek iedereen"].map(opt => (
                <button key={opt} onClick={() => setZoekt(opt)} style={{ padding: "14px 18px", borderRadius: 14, border: `1.5px solid ${zoekt === opt ? pa : C.border}`, background: zoekt === opt ? `${pa}12` : "transparent", color: zoekt === opt ? pa : C.textMid, fontFamily: sans, fontSize: 15, fontWeight: zoekt === opt ? 700 : 400, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                  {zoekt === opt ? "✓ " : ""}{opt}
                </button>
              ))}
              <div style={{ marginTop: 8, padding: "14px 16px", background: "rgba(196,86,44,0.04)", borderRadius: 14, border: `1px solid ${C.border}` }}>
                <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
                  <input type="checkbox" checked={voorkeurConsent} onChange={e => setVoorkeurConsent(e.target.checked)} style={{ marginTop: 2, accentColor: pa, width: 18, height: 18, flexShrink: 0 }} />
                  <span style={{ fontFamily: sans, fontSize: 12, color: C.textMid, lineHeight: 1.6 }}>
                    Ik geef toestemming voor het verwerken van mijn seksuele voorkeur conform de <span style={{ color: C.terra }}>privacyverklaring</span> (AVG artikel 9)
                  </span>
                </label>
              </div>
            </div>
          )}
          {(ps.label === "Verhaal") && (
            <textarea
              autoFocus value={verhaal} onChange={e => setVerhaal(e.target.value)} rows={4}
              placeholder="Bijv. Avontuurlijk, eerlijk en op zoek naar echte verbinding."
              style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 15, padding: "14px 16px", fontFamily: sans, outline: "none", resize: "none", boxSizing: "border-box", lineHeight: 1.7, borderRadius: 14 }}
            />
          )}
          {(ps.label === "Passies") && (
            <textarea
              autoFocus value={passies} onChange={e => setPassies(e.target.value)} rows={3}
              placeholder="Hardlopen, lezen, reizen, koken..."
              style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 15, padding: "14px 16px", fontFamily: sans, outline: "none", resize: "none", boxSizing: "border-box", lineHeight: 1.7, borderRadius: 14 }}
            />
          )}
        </GlassCard>

        {error && <p style={{ fontFamily: sans, fontSize: 13, color: "#C0392B", marginBottom: 16, padding: "10px 14px", background: "rgba(192,57,43,0.08)", borderRadius: 10 }}>⚠ {error}</p>}

        <div style={{ display: "flex", gap: 10 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.8)", border: `1px solid ${C.border}`, borderRadius: 999, color: C.textMid, fontFamily: sans, fontSize: 13, cursor: "pointer" }}>← Terug</button>
          )}
          <PrimaryBtn
            onClick={handleNext}
            style={{ flex: step > 0 ? 3 : 1, background: canNext() ? `linear-gradient(180deg, ${pa}, ${C.terraDeep})` : C.border, cursor: canNext() ? "pointer" : "default" }}
          >
            {loading ? "Opslaan..." : step < steps.length - 1 ? "Verder →" : "Profiel opslaan ✓"}
          </PrimaryBtn>
        </div>

        <p style={{ fontFamily: sans, fontSize: 11, color: C.textDim, textAlign: "center", marginTop: 14 }}>
          Ingelogd als {user.email} · <button onClick={() => { supabase.auth.signOut(); }} style={{ background: "none", border: "none", color: C.textDim, fontFamily: sans, fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>Uitloggen</button>
        </p>
      </div>
    </div>
  );
}

// ── AUTH SCREEN ───────────────────────────────────────────────────────────────
function AuthScreen({ onAuth, onBack }) {
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [onWaitlist, setOnWaitlist] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Save to waitlist table
        await supabase.from("waitlist").upsert({ email });
        setOnWaitlist(true);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuth(data.user);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Waitlist confirmation screen
  if (onWaitlist) {
    return (
      <div style={{ minHeight: "100vh", background: `radial-gradient(circle at 15% 20%, rgba(196,86,44,0.08), transparent 26%), ${C.bg}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: sans, padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>
          <LHCLogo size={100} />
          <h1 style={{ fontFamily: serif, fontSize: 32, fontWeight: 700, color: C.text, margin: "20px 0 12px" }}>
            Je staat op de lijst! 🎉
          </h1>
          <p style={{ fontFamily: sans, fontSize: 16, color: C.textMid, lineHeight: 1.8, margin: "0 0 28px", maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
            Welkom bij Lonely Hearts Club. We bouwen op dit moment de app en laten je weten zodra je toegang krijgt.
          </p>
          <GlassCard style={{ padding: 24, marginBottom: 24, textAlign: "left" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.terra, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontSize: 14, flexShrink: 0 }}>1</div>
              <div>
                <div style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 2 }}>Account aangemaakt</div>
                <div style={{ fontFamily: sans, fontSize: 13, color: C.textDim }}>Check je e-mail voor een bevestigingslink</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.border, display: "flex", alignItems: "center", justifyContent: "center", color: C.textDim, fontSize: 14, flexShrink: 0 }}>2</div>
              <div>
                <div style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, color: C.textMid, marginBottom: 2 }}>Wachten op toegang</div>
                <div style={{ fontFamily: sans, fontSize: 13, color: C.textDim }}>We openen de app stapsgewijs — jij bent er vroeg bij</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.border, display: "flex", alignItems: "center", justifyContent: "center", color: C.textDim, fontSize: 14, flexShrink: 0 }}>3</div>
              <div>
                <div style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, color: C.textMid, marginBottom: 2 }}>Jouw eerste gesprek</div>
                <div style={{ fontFamily: sans, fontSize: 13, color: C.textDim }}>Leer iemand kennen via stem — zonder foto</div>
              </div>
            </div>
          </GlassCard>
          <button onClick={onBack} style={{ background: "none", border: "none", fontFamily: sans, fontSize: 13, color: C.textDim, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>
            ← Terug naar de site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(circle at 15% 20%, rgba(196,86,44,0.08), transparent 26%), ${C.bg}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: sans, padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontFamily: sans, fontSize: 13, color: C.textDim, cursor: "pointer", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>← Terug</button>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <LHCLogo size={80} />
          <h1 style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, color: C.text, margin: "16px 0 6px" }}>
            {mode === "login" ? "Welkom terug" : "Word lid"}
          </h1>
          <p style={{ fontFamily: sans, fontSize: 14, color: C.textDim, margin: 0 }}>
            {mode === "login" ? "Log in op je account" : "Schrijf je in — helemaal gratis"}
          </p>
        </div>

        <GlassCard style={{ padding: 24 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.textMid, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 6 }}>E-mailadres</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="jouw@emailadres.nl"
              style={{ width: "100%", padding: "13px 16px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, color: C.text, fontSize: 14, fontFamily: sans, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.textMid, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Wachtwoord</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Minimaal 6 tekens"
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{ width: "100%", padding: "13px 16px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, color: C.text, fontSize: 14, fontFamily: sans, outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {error && <p style={{ fontFamily: sans, fontSize: 13, color: "#C0392B", marginBottom: 14, padding: "10px 14px", background: "rgba(192,57,43,0.08)", borderRadius: 10 }}>{error}</p>}

          <PrimaryBtn onClick={handleSubmit} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? "Even wachten..." : mode === "login" ? "Inloggen →" : "Word lid →"}
          </PrimaryBtn>

          {mode === "signup" && (
            <p style={{ fontFamily: sans, fontSize: 11, color: C.textDim, textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
              Door je aan te melden ga je akkoord met onze privacyverklaring. Je staat eerst op een wachtlijst totdat we genoeg leden hebben.
            </p>
          )}
        </GlassCard>

        <p style={{ textAlign: "center", fontFamily: sans, fontSize: 13, color: C.textDim, marginTop: 16 }}>
          {mode === "login" ? "Nog geen account? " : "Al een account? "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            style={{ background: "none", border: "none", color: C.terra, fontFamily: sans, fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>
            {mode === "login" ? "Registreer hier" : "Log hier in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function App() {
  useFonts();
  const [isMobile, setIsMobile] = useState(false);
  const [showPrototype, setShowPrototype] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [user, setUser] = useState(null);
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const compute = () => setIsMobile(window.innerWidth < 768);
    compute();
    window.addEventListener("resize", compute);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("resize", compute);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    try { setCookieAccepted(localStorage.getItem("lhc_cookie") === "1"); } catch { setCookieAccepted(false); }
  }, []);

  const acceptCookie = () => {
    try { localStorage.setItem("lhc_cookie", "1"); } catch {}
    setCookieAccepted(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowOnboarding(false);
  };

  const handleAuth = (u) => {
    setUser(u);
    setShowAuth(false);
    setShowOnboarding(true); // Na registratie → profielwizard
  };

  if (!hydrated) return <div style={{ minHeight: "100vh", background: C.bg }} />;
  if (showPrivacy) return <PrivacyPage onBack={() => setShowPrivacy(false)} />;
  if (showAuth) return <AuthScreen onAuth={handleAuth} onBack={() => setShowAuth(false)} />;

  // Na registratie → onboarding profielwizard
  if (showOnboarding && user) return (
    <OnboardingWizard
      user={user}
      onComplete={() => setShowOnboarding(false)}
    />
  );

  // Logged in on mobile → show app
  if (isMobile && user) return (<><MobileApp user={user} onLogout={handleLogout} onLogin={() => setShowAuth(true)} />{!cookieAccepted && <CookieNotice onAccept={acceptCookie} />}</>);

  // Not logged in on mobile → show landing
  if (isMobile) return (<><MobileApp onLogin={() => setShowAuth(true)} />{!cookieAccepted && <CookieNotice onAccept={acceptCookie} />}</>);

  if (showPrototype) {
    return (
      <div style={{ minHeight: "100vh", background: C.bgSoft, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <button onClick={() => setShowPrototype(false)} style={{ marginBottom: 18, background: "rgba(255,255,255,0.7)", border: `1px solid ${C.border}`, color: C.textMid, fontFamily: sans, fontSize: 12, padding: "9px 18px", cursor: "pointer", letterSpacing: 1, borderRadius: 999 }}>← Terug naar site</button>
        <div style={{ width: 375, height: 750, borderRadius: 38, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 24px 70px rgba(28,24,20,0.16)", background: C.bg, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
            <MobileApp isPrototype={true} />
          </div>
        </div>
        {!cookieAccepted && <CookieNotice onAccept={acceptCookie} />}
      </div>
    );
  }

  return (
    <>
      <DesktopLanding
        onPrototype={() => setShowPrototype(true)}
        onPrivacy={() => setShowPrivacy(true)}
        onLogin={() => setShowAuth(true)}
        user={user}
        onLogout={handleLogout}
      />
      {!cookieAccepted && <CookieNotice onAccept={acceptCookie} />}
    </>
  );
}
