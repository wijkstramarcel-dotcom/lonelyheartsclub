import { useState, useEffect } from "react";

const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@400;500;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const C = {
  bg:      "#0a0614",
  card:    "#130920",
  magenta: "#d4145a",
  gold:    "#c9963a",
  cream:   "#f0e6d3",
  dim:     "#7a6a5a",
  muted:   "#2a1a3a",
  green:   "#27ae60",
  white:   "#ffffff",
};

const serif = "'Playfair Display', Georgia, serif";
const sans  = "'DM Sans', sans-serif";

const Rule = ({ color = C.gold }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
    <div style={{ flex: 1, height: 1, background: `${color}30` }} />
    <span style={{ color: `${color}60`, fontSize: 9, letterSpacing: 4 }}>✦</span>
    <div style={{ flex: 1, height: 1, background: `${color}30` }} />
  </div>
);

// ── DESKTOP LANDING PAGE ──────────────────────────────────────────────────────
function DesktopLanding({ onPrototype }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);

  const submit = () => { if (email.includes("@")) setSent(true); };

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 30% 0%, #2a0840 0%, ${C.bg} 50%), radial-gradient(ellipse at 70% 100%, #1a0428 0%, transparent 50%), ${C.bg}`,
      color: C.cream,
      fontFamily: sans,
    }}>

      {/* Nav */}
      <nav style={{
        padding: "20px 60px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: `1px solid ${C.gold}15`,
        position: "sticky", top: 0,
        background: `${C.bg}ee`,
        backdropFilter: "blur(10px)",
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: C.magenta, fontSize: 20 }}>♥</span>
          <span style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: C.cream }}>Lonely Hearts Club</span>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <a href="#hoe" style={{ color: C.dim, fontSize: 13, textDecoration: "none", letterSpacing: 1 }}>Hoe het werkt</a>
          <a href="#waarom" style={{ color: C.dim, fontSize: 13, textDecoration: "none", letterSpacing: 1 }}>Waarom</a>
          <button onClick={onPrototype} style={{
            padding: "8px 20px", background: "transparent",
            border: `1px solid ${C.gold}50`, color: C.gold,
            fontFamily: sans, fontSize: 11, letterSpacing: 2,
            textTransform: "uppercase", cursor: "pointer",
          }}>Bekijk prototype</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "100px 60px 80px",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 80, alignItems: "center",
        opacity: vis ? 1 : 0, transition: "opacity 0.8s ease",
      }}>
        {/* Left */}
        <div>
          <div style={{ fontFamily: sans, fontSize: 10, letterSpacing: 5, color: C.magenta, fontWeight: 700, marginBottom: 20 }}>
            NIEUW · NEDERLAND · 2026
          </div>
          <h1 style={{
            fontFamily: serif, fontSize: 58, fontWeight: 900,
            lineHeight: 1.05, margin: "0 0 24px",
            color: C.cream,
          }}>
            Dating begint<br />
            met een <span style={{ color: C.gold, fontStyle: "italic" }}>stem</span>,<br />
            niet een gezicht.
          </h1>
          <p style={{
            fontSize: 16, color: C.dim, lineHeight: 1.8,
            margin: "0 0 36px", maxWidth: 420,
          }}>
            Bij Lonely Hearts Club leer je iemand kennen van binnenuit.
            Eerst een anoniem gesprek, dan pas een gezicht.
            Echte verbinding begint hier.
          </p>

          {/* Waitlist form */}
          {!sent ? (
            <div style={{ display: "flex", gap: 0, maxWidth: 420 }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jouw@emailadres.nl"
                onKeyDown={e => e.key === "Enter" && submit()}
                style={{
                  flex: 1, padding: "14px 18px",
                  background: C.card,
                  border: `1px solid ${C.gold}30`,
                  borderRight: "none",
                  color: C.cream, fontSize: 14,
                  fontFamily: sans, outline: "none",
                }}
              />
              <button onClick={submit} style={{
                padding: "14px 24px",
                background: C.magenta,
                border: "none",
                color: C.cream, fontSize: 12,
                fontFamily: sans, fontWeight: 700,
                letterSpacing: 2, textTransform: "uppercase",
                cursor: "pointer", whiteSpace: "nowrap",
                boxShadow: `0 4px 24px ${C.magenta}40`,
              }}>
                Schrijf me in →
              </button>
            </div>
          ) : (
            <div style={{
              padding: "16px 20px", maxWidth: 420,
              border: `1px solid ${C.green}40`,
              background: `${C.green}08`,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ color: C.green, fontSize: 18 }}>✓</span>
              <span style={{ fontSize: 14, color: C.cream }}>Je staat op de lijst — we bellen je als we live gaan 😊</span>
            </div>
          )}

          <p style={{ fontSize: 11, color: C.muted, marginTop: 10, letterSpacing: 1 }}>
            Geen spam. Alleen een bericht als we live gaan.
          </p>
        </div>

        {/* Right — phone mockup */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{
            width: 280, background: C.card,
            border: `1px solid ${C.gold}20`,
            borderRadius: 32, overflow: "hidden",
            boxShadow: `0 0 60px ${C.magenta}20, 0 40px 80px rgba(0,0,0,0.5)`,
            position: "relative",
          }}>
            {/* Phone content preview */}
            <div style={{ background: C.magenta, padding: "8px 0", textAlign: "center" }}>
              <span style={{ fontFamily: sans, fontSize: 7, letterSpacing: 4, color: C.gold, fontWeight: 700 }}>LONELYHEARTSCLUB.NL</span>
            </div>
            <div style={{ padding: "28px 20px", textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", border: `1px solid ${C.gold}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: C.magenta, margin: "0 auto 16px", background: `radial-gradient(circle, #1a0830, ${C.bg})` }}>♥</div>
              <h2 style={{ fontFamily: serif, fontSize: 20, fontWeight: 900, color: C.cream, margin: "0 0 6px" }}>Lonely Hearts<br />Club</h2>
              <p style={{ fontFamily: sans, fontSize: 10, fontStyle: "italic", color: C.gold, marginBottom: 20 }}>Daten zonder foto's</p>
              <Rule />
              {[
                { n: "01", text: "Profiel zonder foto", color: C.gold },
                { n: "02", text: "Anoniem bellen",      color: C.magenta },
                { n: "03", text: "Videogesprek",         color: "#7b5ea7" },
                { n: "04", text: "Echte afspraak",       color: C.green },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", marginBottom: 4, borderLeft: `2px solid ${s.color}`, background: `${s.color}08`, textAlign: "left" }}>
                  <span style={{ fontFamily: sans, fontSize: 8, color: s.color, fontWeight: 700, width: 16, flexShrink: 0 }}>{s.n}</span>
                  <span style={{ fontFamily: sans, fontSize: 11, color: C.cream }}>{s.text}</span>
                </div>
              ))}
              <button onClick={onPrototype} style={{ marginTop: 16, width: "100%", padding: "11px", background: C.magenta, border: "none", color: C.gold, fontFamily: sans, fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>
                ★ Bekijk prototype ★
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="hoe" style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "80px 60px",
        borderTop: `1px solid ${C.gold}15`,
      }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontFamily: sans, fontSize: 10, letterSpacing: 5, color: C.magenta, fontWeight: 700, marginBottom: 12 }}>HOE HET WERKT</div>
          <h2 style={{ fontFamily: serif, fontSize: 40, fontWeight: 900, color: C.cream, margin: 0 }}>Vier stappen naar echte verbinding</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {[
            { n: "01", title: "Profiel zonder foto", desc: "Beschrijf wie je bent in woorden. Geen filters, geen poses. Gewoon jij.", color: C.gold, icon: "♦" },
            { n: "02", title: "Anoniem bellen", desc: "Een gesprek van 10 minuten. Jullie nummers blijven verborgen voor elkaar.", color: C.magenta, icon: "☎" },
            { n: "03", title: "Videogesprek", desc: "Na 3 gesprekken kun je elkaar voor het eerst echt zien via video.", color: "#7b5ea7", icon: "◉" },
            { n: "04", title: "Echte afspraak", desc: "Jullie kennen elkaar al — de eerste date voelt als een tweede.", color: C.green, icon: "♥" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "28px 24px",
              background: C.card,
              border: `1px solid ${s.color}20`,
              borderTop: `3px solid ${s.color}`,
            }}>
              <div style={{ fontSize: 24, color: s.color, marginBottom: 14 }}>{s.icon}</div>
              <div style={{ fontFamily: sans, fontSize: 9, letterSpacing: 3, color: s.color, fontWeight: 700, marginBottom: 10 }}>{s.n}</div>
              <h3 style={{ fontFamily: serif, fontSize: 17, fontWeight: 700, color: C.cream, margin: "0 0 10px" }}>{s.title}</h3>
              <p style={{ fontFamily: sans, fontSize: 13, color: C.dim, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section id="waarom" style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "80px 60px",
        borderTop: `1px solid ${C.gold}15`,
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center",
      }}>
        <div>
          <div style={{ fontFamily: sans, fontSize: 10, letterSpacing: 5, color: C.magenta, fontWeight: 700, marginBottom: 16 }}>WAAROM ANDERS</div>
          <h2 style={{ fontFamily: serif, fontSize: 40, fontWeight: 900, color: C.cream, margin: "0 0 24px", lineHeight: 1.2 }}>
            Tinder is gemaakt voor<br />uiterlijk. Wij niet.
          </h2>
          <p style={{ fontFamily: sans, fontSize: 15, color: C.dim, lineHeight: 1.8, marginBottom: 24 }}>
            Op de meeste datingapps beslis je in twee seconden op basis van een foto. Bij Lonely Hearts Club leer je eerst wie iemand is — en pas daarna zie je hoe ze eruitzien.
          </p>
          <p style={{ fontFamily: sans, fontSize: 15, color: C.dim, lineHeight: 1.8 }}>
            Het resultaat: diepere verbindingen, minder oppervlakkigheid, en een eerste date die voelt als een tweede.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Tinder/Bumble", text: "Foto eerst, dan pas praten", bad: true },
            { label: "Lonely Hearts Club", text: "Stem eerst, dan pas zien", bad: false },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "20px 24px",
              background: s.bad ? `${C.muted}30` : `${C.magenta}15`,
              border: `1px solid ${s.bad ? C.muted : C.magenta}40`,
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <span style={{ fontSize: 18, color: s.bad ? C.muted : C.magenta }}>{s.bad ? "✕" : "♥"}</span>
              <div>
                <div style={{ fontFamily: sans, fontSize: 10, letterSpacing: 2, color: s.bad ? C.dim : C.gold, fontWeight: 700, marginBottom: 4 }}>{s.label.toUpperCase()}</div>
                <div style={{ fontFamily: sans, fontSize: 14, color: s.bad ? C.dim : C.cream }}>{s.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "80px 60px",
        borderTop: `1px solid ${C.gold}15`,
        textAlign: "center",
      }}>
        <h2 style={{ fontFamily: serif, fontSize: 42, fontWeight: 900, color: C.cream, margin: "0 0 16px" }}>
          Klaar voor een echte verbinding?
        </h2>
        <p style={{ fontFamily: sans, fontSize: 15, color: C.dim, marginBottom: 32 }}>
          Schrijf je in en ontvang een bericht als we live gaan.
        </p>
        {!sent ? (
          <div style={{ display: "flex", gap: 0, maxWidth: 420, margin: "0 auto" }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jouw@emailadres.nl"
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{
                flex: 1, padding: "14px 18px",
                background: C.card,
                border: `1px solid ${C.gold}30`,
                borderRight: "none",
                color: C.cream, fontSize: 14,
                fontFamily: sans, outline: "none",
              }}
            />
            <button onClick={submit} style={{
              padding: "14px 24px",
              background: C.magenta, border: "none",
              color: C.cream, fontSize: 12,
              fontFamily: sans, fontWeight: 700,
              letterSpacing: 2, textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: `0 4px 24px ${C.magenta}40`,
            }}>Schrijf me in →</button>
          </div>
        ) : (
          <div style={{ padding: "16px 24px", border: `1px solid ${C.green}40`, background: `${C.green}08`, display: "inline-flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: C.green, fontSize: 18 }}>✓</span>
            <span style={{ fontSize: 14, color: C.cream }}>Je staat op de lijst!</span>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${C.gold}15`,
        padding: "24px 60px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: C.magenta }}>♥</span>
          <span style={{ fontFamily: serif, fontSize: 14, color: C.dim }}>Lonely Hearts Club</span>
        </div>
        <span style={{ fontFamily: sans, fontSize: 11, color: C.muted, letterSpacing: 2 }}>EST. 2026 · NEDERLAND · GRATIS</span>
        <button onClick={onPrototype} style={{ background: "none", border: "none", fontFamily: sans, fontSize: 11, color: C.dim, cursor: "pointer", letterSpacing: 1, textDecoration: "underline", textUnderlineOffset: 3 }}>
          Bekijk prototype →
        </button>
      </footer>
    </div>
  );
}

// ── MOBILE APP ────────────────────────────────────────────────────────────────
function MobileApp() {
  const [idx, setIdx] = useState(0);

  const Tag = ({ children, active }) => (
    <span style={{ padding: "5px 14px", fontSize: 11, border: `1px solid ${active ? C.gold : C.gold + "30"}`, color: active ? C.gold : C.dim, background: active ? `${C.gold}12` : "transparent", fontFamily: sans, letterSpacing: 1, cursor: "pointer" }}>{children}</span>
  );

  const Rule = ({ color = C.gold }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "14px 0" }}>
      <div style={{ flex: 1, height: 1, background: `${color}30` }} />
      <span style={{ color: `${color}60`, fontSize: 9, letterSpacing: 4 }}>✦</span>
      <div style={{ flex: 1, height: 1, background: `${color}30` }} />
    </div>
  );

  const screens = ["Home", "Profiel", "Ontdek", "Match", "Bellen", "Review"];

  // Waitlist
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const submit = () => { if (email.includes("@")) setSent(true); };

  // Profile
  const [step, setStep] = useState(0);
  const profileSteps = [
    { label: "Naam", q: "Wat is je voornaam?", val: "Marcel", type: "input" },
    { label: "Leeftijd", q: "Hoe oud ben je?", val: "48", type: "input" },
    { label: "Verhaal", q: "Omschrijf jezelf in één zin", val: "Avontuurlijk, eerlijk, op zoek naar verbinding.", type: "area" },
    { label: "Passies", q: "Wat zijn je passies?", val: "Hardlopen, schilderen, reizen.", type: "area" },
  ];
  const accent = [C.gold, "#7b5ea7", C.magenta, C.green];

  // Discover
  const [profileIdx, setProfileIdx] = useState(0);
  const profiles = [
    { name: "Sarah", age: 42, tagline: "Dromer met beide voeten op de grond", bio: "Op zoek naar echte gesprekken en verbinding.", tags: ["Natuur", "Lezen", "Koken"], match: 94 },
    { name: "Linda", age: 45, tagline: "Nieuwsgierig naar het leven", bio: "Moeder, reiziger, yogalerares.", tags: ["Yoga", "Reizen", "Theater"], match: 87 },
  ];

  // Call
  const [secs, setSecs] = useState(0);
  const [bars, setBars] = useState(Array(18).fill(4));
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    if (idx === 4) {
      const t = setInterval(() => { setSecs(s => s + 1); setBars(b => b.map(() => Math.floor(Math.random() * 10) + 2)); }, 1000);
      return () => clearInterval(t);
    }
  }, [idx]);
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // Match pulse
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (idx === 3) { const t = setInterval(() => setScale(s => s === 1 ? 1.1 : 1), 1100); return () => clearInterval(t); }
  }, [idx]);

  // Stars
  const [stars, setStars] = useState(4);

  const next = () => setIdx(i => Math.min(i + 1, screens.length - 1));
  const p = profiles[profileIdx] || profiles[0];
  const ps = profileSteps[step];
  const pa = accent[step];

  const Header = ({ label, title }) => (
    <div style={{ background: C.card, padding: "12px 20px", borderBottom: `1px solid ${C.gold}20`, flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: C.gold, fontWeight: 700 }}>{label}</div>
        <div style={{ fontFamily: serif, fontSize: 15, color: C.cream, fontWeight: 700, marginTop: 2 }}>{title}</div>
      </div>
      <span style={{ color: `${C.gold}60`, fontSize: 16 }}>♥</span>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column" }}>
      {/* Status bar */}
      <div style={{ padding: "10px 20px 6px", display: "flex", justifyContent: "space-between", fontFamily: sans, fontSize: 10, color: C.dim, flexShrink: 0, background: C.bg }}>
        <span>9:41</span>
        <span style={{ color: C.gold, letterSpacing: 2, fontWeight: 700 }}>♥ LHC</span>
        <span>●●●</span>
      </div>

      {/* Screen content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* HOME */}
        {idx === 0 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: `radial-gradient(ellipse at 50% 0%, #2a0840, ${C.bg})`, overflow: "hidden" }}>
            <div style={{ background: C.magenta, padding: "8px 0", textAlign: "center", borderBottom: `1px solid ${C.gold}40`, flexShrink: 0 }}>
              <span style={{ fontFamily: sans, fontSize: 8, letterSpacing: 5, color: C.gold, fontWeight: 700 }}>LONELYHEARTSCLUB.NL</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 24px 20px", overflowY: "auto" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", border: `1px solid ${C.gold}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: C.magenta, marginBottom: 20, background: `radial-gradient(circle, #1a0830, ${C.bg})`, boxShadow: `0 0 32px ${C.magenta}20` }}>♥</div>
              <h1 style={{ fontFamily: serif, fontSize: 28, fontWeight: 900, color: C.cream, textAlign: "center", margin: "0 0 6px", lineHeight: 1.15 }}>Lonely Hearts<br />Club</h1>
              <p style={{ fontFamily: sans, fontSize: 12, fontStyle: "italic", color: C.gold, textAlign: "center", margin: "0 0 20px" }}>Dating begint met een stem</p>
              <Rule />
              <div style={{ width: "100%", marginBottom: 24 }}>
                {[
                  { n: "01", text: "Profiel zonder foto", color: C.gold },
                  { n: "02", text: "Anoniem bellen", color: C.magenta },
                  { n: "03", text: "Videogesprek", color: "#7b5ea7" },
                  { n: "04", text: "Echte afspraak", color: C.green },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", marginBottom: 4, borderLeft: `2px solid ${s.color}`, background: `${s.color}08` }}>
                    <span style={{ fontFamily: sans, fontSize: 9, color: s.color, fontWeight: 700, width: 20, flexShrink: 0 }}>{s.n}</span>
                    <span style={{ fontFamily: sans, fontSize: 13, color: C.cream }}>{s.text}</span>
                  </div>
                ))}
              </div>
              {!sent ? (
                <div style={{ width: "100%" }}>
                  <p style={{ fontFamily: sans, fontSize: 10, color: C.dim, textAlign: "center", marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>Vroege toegang</p>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jouw@emailadres.nl" style={{ width: "100%", padding: "12px 14px", background: C.card, border: `1px solid ${C.gold}30`, color: C.cream, fontSize: 13, fontFamily: sans, outline: "none", marginBottom: 8, boxSizing: "border-box" }} />
                  <button onClick={submit} style={{ width: "100%", padding: "13px", background: C.magenta, border: "none", color: C.gold, fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", boxShadow: `0 4px 20px ${C.magenta}40` }}>Zet mij op de lijst →</button>
                </div>
              ) : (
                <div style={{ width: "100%", padding: "16px", border: `1px solid ${C.green}40`, background: `${C.green}08`, textAlign: "center" }}>
                  <div style={{ fontSize: 24, color: C.green, marginBottom: 8 }}>✓</div>
                  <p style={{ fontFamily: sans, fontSize: 13, color: C.cream, margin: 0 }}>Je staat op de lijst!</p>
                </div>
              )}
              <button onClick={next} style={{ marginTop: 16, background: "none", border: "none", fontFamily: sans, fontSize: 11, color: C.dim, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>Bekijk het prototype →</button>
            </div>
            <div style={{ padding: "8px 0", textAlign: "center", borderTop: `1px solid ${C.gold}15`, background: "#050310", flexShrink: 0 }}>
              <span style={{ fontFamily: sans, fontSize: 8, letterSpacing: 3, color: C.muted }}>EST. 2026 · NEDERLAND · GRATIS</span>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {idx === 1 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
            <Header label="JOUW PROFIEL" title="Vertel je verhaal" />
            <div style={{ display: "flex", gap: 4, padding: "12px 20px 0" }}>
              {profileSteps.map((_, i) => (
                <div key={i} style={{ flex: i === step ? 3 : 1, height: 2, background: i < step ? C.gold : i === step ? pa : C.muted, transition: "all 0.3s ease" }} />
              ))}
            </div>
            <div style={{ flex: 1, padding: "16px 20px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
              <div style={{ padding: "10px 14px", marginBottom: 14, border: `1px dashed ${C.gold}25`, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ color: C.gold }}>♦</span>
                <span style={{ fontFamily: sans, fontSize: 12, color: C.dim, fontStyle: "italic" }}>Geen foto. Jij bent meer dan een plaatje.</span>
              </div>
              <div style={{ border: `1px solid ${pa}30`, padding: "16px", marginBottom: 14, background: `${pa}06` }}>
                <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: pa, marginBottom: 8, fontWeight: 700 }}>{ps.label.toUpperCase()}</div>
                <h3 style={{ fontFamily: serif, fontSize: 16, color: C.cream, margin: "0 0 12px", fontWeight: 700 }}>{ps.q}</h3>
                {ps.type === "input" ? (
                  <input defaultValue={ps.val} style={{ width: "100%", background: `${pa}08`, border: `1px solid ${pa}30`, color: C.cream, fontSize: 18, padding: "10px 12px", fontFamily: serif, outline: "none", boxSizing: "border-box" }} />
                ) : (
                  <textarea defaultValue={ps.val} rows={3} style={{ width: "100%", background: `${pa}08`, border: `1px solid ${pa}30`, color: C.cream, fontSize: 13, padding: "10px 12px", fontFamily: sans, outline: "none", resize: "none", boxSizing: "border-box", lineHeight: 1.7 }} />
                )}
              </div>
              {step === 3 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {[["Hardlopen", true], ["Kunst", true], ["Reizen", true], ["Lezen", false], ["Wijn", false]].map(([t, active], i) => (
                    <Tag key={i} active={active}>{t}</Tag>
                  ))}
                </div>
              )}
              <div style={{ flex: 1 }} />
              <div style={{ display: "flex", gap: 8 }}>
                {step > 0 && <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: "13px", background: "transparent", border: `1px solid ${C.white}10`, color: C.dim, fontFamily: sans, fontSize: 11, letterSpacing: 1, cursor: "pointer" }}>← Terug</button>}
                <button onClick={() => step < profileSteps.length - 1 ? setStep(s => s + 1) : next()} style={{ flex: step > 0 ? 3 : 1, padding: "13px", background: pa, border: "none", color: C.bg, fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>
                  {step < profileSteps.length - 1 ? "Verder →" : "Opslaan ✓"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DISCOVER */}
        {idx === 2 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
            <Header label="NIEUWE LEDEN" title="Ontdek matches" />
            <div style={{ flex: 1, padding: "14px", display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1, background: C.card, border: `1px solid ${C.gold}20`, padding: "18px", marginBottom: 10, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: `radial-gradient(circle, #2a0840, ${C.bg})`, border: `1px solid ${C.gold}30`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 18, color: C.gold }}>?</div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 900, color: C.gold }}>{p.match}%</div>
                    <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 2, color: C.dim, fontWeight: 700 }}>MATCH</div>
                  </div>
                </div>
                <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: C.cream, margin: "0 0 4px" }}>{p.name}, {p.age}</h3>
                <p style={{ fontFamily: sans, fontSize: 11, fontStyle: "italic", color: C.gold, margin: "0 0 12px" }}>{p.tagline}</p>
                <Rule />
                <p style={{ fontFamily: sans, fontSize: 12, color: C.dim, lineHeight: 1.7, flex: 1 }}>{p.bio}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                  {p.tags.map((t, i) => <Tag key={i}>{t}</Tag>)}
                </div>
                <div style={{ marginTop: 12, padding: "8px 10px", border: `1px dashed ${C.gold}20`, display: "flex", gap: 8 }}>
                  <span style={{ color: C.gold, fontSize: 10 }}>♦</span>
                  <span style={{ fontFamily: sans, fontSize: 9, color: C.dim, letterSpacing: 1 }}>FOTO ZICHTBAAR NA EERSTE GESPREK</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setProfileIdx(i => Math.min(i + 1, profiles.length - 1))} style={{ flex: 1, padding: "12px", background: "transparent", border: `1px solid ${C.white}10`, color: C.dim, fontSize: 16, cursor: "pointer" }}>✕</button>
                <button onClick={next} style={{ flex: 3, padding: "12px", background: C.magenta, border: "none", color: C.cream, fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", boxShadow: `0 4px 16px ${C.magenta}40` }}>♥ Interesse</button>
                <button style={{ flex: 1, padding: "12px", background: `${C.gold}10`, border: `1px solid ${C.gold}30`, color: C.gold, fontSize: 16, cursor: "pointer" }}>★</button>
              </div>
            </div>
          </div>
        )}

        {/* MATCH */}
        {idx === 3 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: `radial-gradient(ellipse at 50% 20%, #2a0840, ${C.bg})` }}>
            <div style={{ background: C.magenta, padding: "10px 0", textAlign: "center", borderBottom: `1px solid ${C.gold}30`, flexShrink: 0 }}>
              <span style={{ fontFamily: sans, fontSize: 8, letterSpacing: 5, color: C.gold, fontWeight: 700 }}>HET IS WEDERZIJDS</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
              <div style={{ fontSize: 64, marginBottom: 20, color: C.magenta, transform: `scale(${scale})`, transition: "transform 0.5s ease", filter: `drop-shadow(0 0 20px ${C.magenta}60)` }}>♥</div>
              <div style={{ width: "100%", padding: "18px", border: `1px solid ${C.gold}30`, background: C.card, textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: C.gold, marginBottom: 8, fontWeight: 700 }}>JULLIE HEBBEN EEN KLIK</div>
                <h2 style={{ fontFamily: serif, fontSize: 22, fontWeight: 900, color: C.cream, margin: "0 0 4px" }}>Jij & Sarah</h2>
                <p style={{ fontFamily: sans, fontSize: 12, color: C.dim, margin: 0 }}>Beiden tonen interesse</p>
              </div>
              {[
                { n: "I", label: "Anoniem bellen", sub: "10 min · Nu", active: true, color: C.gold },
                { n: "II", label: "Videobel", sub: "Na 3 gesprekken", active: false, color: "#7b5ea7" },
                { n: "III", label: "Afspreken", sub: "Na videogesprek", active: false, color: C.green },
              ].map(s => (
                <div key={s.n} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", marginBottom: 6, borderLeft: `2px solid ${s.active ? s.color : s.color + "30"}`, background: s.active ? `${s.color}10` : "transparent", opacity: s.active ? 1 : 0.4 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", border: `1px solid ${s.active ? s.color : s.color + "40"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 9, color: s.active ? s.color : C.dim, flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: s.active ? C.cream : C.dim }}>{s.label}</div>
                    <div style={{ fontFamily: sans, fontSize: 10, color: s.active ? s.color : C.muted }}>{s.sub}</div>
                  </div>
                  {s.active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: C.green }} />}
                </div>
              ))}
              <button onClick={next} style={{ width: "100%", marginTop: 16, padding: "13px", background: C.magenta, border: "none", color: C.cream, fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", boxShadow: `0 4px 20px ${C.magenta}40` }}>☎ Bel Sarah nu</button>
            </div>
          </div>
        )}

        {/* CALL */}
        {idx === 4 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
            <div style={{ background: C.green, padding: "8px 20px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.white }} />
              <span style={{ fontFamily: sans, fontSize: 9, letterSpacing: 3, color: "#0a1a0a", fontWeight: 700 }}>ANONIEM GESPREK ACTIEF</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around", padding: "24px 20px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 84, height: 84, borderRadius: "50%", background: `radial-gradient(circle, #2a0840, ${C.bg})`, border: `1px solid ${C.magenta}40`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 30, color: C.magenta, margin: "0 auto 12px", boxShadow: `0 0 24px ${C.magenta}25` }}>?</div>
                <h2 style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: C.cream, margin: "0 0 4px" }}>Sarah, 42</h2>
                <p style={{ fontFamily: sans, fontSize: 10, color: C.dim, margin: 0 }}>Nummers verborgen voor beiden</p>
              </div>
              <div style={{ padding: "12px 24px", border: `1px solid ${C.gold}30`, textAlign: "center", background: C.card }}>
                <div style={{ fontFamily: sans, fontSize: 32, fontWeight: 700, color: C.gold, letterSpacing: 4 }}>{fmt(secs)}</div>
                <div style={{ fontFamily: sans, fontSize: 9, color: C.dim, letterSpacing: 2, marginTop: 4 }}>{Math.max(0, 600 - secs)}S RESTEREND</div>
              </div>
              <div style={{ display: "flex", gap: 3, alignItems: "center", height: 26 }}>
                {bars.map((h, i) => (
                  <div key={i} style={{ width: 3, borderRadius: 2, height: h * 1.8, background: i % 2 === 0 ? C.magenta : C.gold, opacity: 0.6, transition: "height 0.2s ease" }} />
                ))}
              </div>
              <div style={{ width: "100%", padding: "12px 14px", border: `1px solid ${C.gold}20`, background: C.card }}>
                <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: C.gold, marginBottom: 6, fontWeight: 700 }}>GESPREKSSTARTER</div>
                <p style={{ fontFamily: sans, fontSize: 12, fontStyle: "italic", color: C.dim, margin: 0, lineHeight: 1.6 }}>"Wat is het mooiste moment op reis?"</p>
              </div>
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <button onClick={() => setMuted(m => !m)} style={{ width: 48, height: 48, borderRadius: "50%", background: muted ? `${C.magenta}20` : `${C.white}06`, border: `1px solid ${muted ? C.magenta : C.white + "15"}`, color: muted ? C.magenta : C.dim, fontSize: 16, cursor: "pointer" }}>{muted ? "✕" : "♪"}</button>
                <button onClick={next} style={{ width: 60, height: 60, borderRadius: "50%", background: "#c0392b", border: `1px solid ${C.gold}40`, color: C.white, fontSize: 20, cursor: "pointer", boxShadow: "0 4px 16px rgba(192,57,43,0.4)" }}>✕</button>
                <button style={{ width: 48, height: 48, borderRadius: "50%", background: `${C.white}06`, border: `1px solid ${C.white}15`, color: C.dim, fontSize: 16, cursor: "pointer" }}>◎</button>
              </div>
            </div>
          </div>
        )}

        {/* REVIEW */}
        {idx === 5 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
            <Header label="GESPREK AFGEROND" title="Jouw beoordeling" />
            <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
              <h2 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: C.cream, margin: "0 0 6px" }}>Hoe was het met Sarah?</h2>
              <p style={{ fontFamily: sans, fontSize: 12, color: C.dim, margin: "0 0 20px", lineHeight: 1.6 }}>Jouw terugkoppeling helpt ons betere matches te maken.</p>
              <Rule />
              <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "16px 0 24px" }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <span key={i} onClick={() => setStars(i)} style={{ fontSize: 30, cursor: "pointer", color: i <= stars ? C.gold : C.muted, transition: "all 0.2s", display: "inline-block", transform: i <= stars ? "scale(1.08)" : "scale(1)" }}>★</span>
                ))}
              </div>
              <div style={{ padding: "14px", border: `1px solid ${C.gold}20`, background: C.card, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: sans, fontSize: 9, letterSpacing: 2, color: C.dim, fontWeight: 700 }}>VOORTGANG NAAR VIDEO</span>
                  <span style={{ fontFamily: serif, fontSize: 13, fontWeight: 700, color: C.gold }}>1 / 3</span>
                </div>
                <div style={{ height: 3, background: C.muted, marginBottom: 8 }}>
                  <div style={{ width: "33%", height: "100%", background: `linear-gradient(90deg, ${C.gold}, ${C.magenta})` }} />
                </div>
                <p style={{ fontFamily: sans, fontSize: 9, color: C.dim, margin: 0, letterSpacing: 1 }}>NOG 2 GESPREKKEN VOOR VIDEO</p>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setIdx(i => Math.max(i - 1, 0))} style={{ flex: 1, padding: "12px", background: "transparent", border: `1px solid ${C.white}10`, color: C.dim, fontFamily: sans, fontSize: 10, cursor: "pointer" }}>← Terug</button>
                <button onClick={() => setIdx(0)} style={{ flex: 2, padding: "12px", background: C.magenta, border: "none", color: C.cream, fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>Opslaan ★</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ display: "flex", borderTop: `1px solid ${C.gold}15`, background: C.card, flexShrink: 0 }}>
        {screens.map((s, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{
            flex: 1, padding: "10px 0",
            background: "transparent", border: "none",
            fontFamily: sans, fontSize: 8,
            color: i === idx ? C.gold : C.muted,
            fontWeight: i === idx ? 700 : 400,
            letterSpacing: 1, textTransform: "uppercase",
            cursor: "pointer",
            borderTop: i === idx ? `2px solid ${C.magenta}` : "2px solid transparent",
          }}>{s}</button>
        ))}
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [isMobile] = useState(() => window.innerWidth < 768);
  const [showPrototype, setShowPrototype] = useState(false);

  if (isMobile) return <MobileApp />;
  if (showPrototype) {
    return (
      <div style={{ minHeight: "100vh", background: "#040210", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 0" }}>
        <button onClick={() => setShowPrototype(false)} style={{ marginBottom: 16, background: "none", border: `1px solid ${C.gold}30`, color: C.dim, fontFamily: sans, fontSize: 11, padding: "6px 16px", cursor: "pointer", letterSpacing: 2 }}>← Terug naar site</button>
        <div style={{ width: 375, height: 750, borderRadius: 38, border: `1px solid ${C.gold}20`, overflow: "hidden", boxShadow: `0 0 60px ${C.magenta}18, 0 32px 64px rgba(0,0,0,0.7)` }}>
          <MobileApp />
        </div>
      </div>
    );
  }
  return <DesktopLanding onPrototype={() => setShowPrototype(true)} />;
}
