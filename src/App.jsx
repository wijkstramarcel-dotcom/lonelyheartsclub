import { useState, useEffect } from "react";

const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// ── WARM EDITORIAL PALETTE ────────────────────────────────────────────────────
const C = {
  bg:        "#FAF7F2",   // warm off-white
  bgDark:    "#1C1814",   // near black warm
  card:      "#F2EDE5",   // slightly darker cream
  terra:     "#C4522A",   // terracotta - main accent
  terraDeep: "#9E3D1A",   // darker terracotta
  bronze:    "#8B6914",   // warm bronze
  text:      "#1C1814",   // near black
  textMid:   "#5C4A3A",   // warm brown mid
  textDim:   "#9C8A7A",   // warm grey
  border:    "#DDD5C8",   // warm border
  green:     "#2D6A4F",   // forest green
  white:     "#FFFFFF",
};

const serif = "'Playfair Display', Georgia, serif";
const sans  = "'DM Sans', sans-serif";

// ── SHARED ────────────────────────────────────────────────────────────────────
const Rule = ({ color = C.border }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "14px 0" }}>
    <div style={{ flex: 1, height: 1, background: color }} />
    <span style={{ color: C.textDim, fontSize: 8, letterSpacing: 4 }}>✦</span>
    <div style={{ flex: 1, height: 1, background: color }} />
  </div>
);

const PrimaryBtn = ({ onClick, children, style = {} }) => (
  <button onClick={onClick} style={{
    width: "100%", padding: "14px 20px",
    background: C.terra, border: "none",
    color: C.white, fontSize: 12,
    fontFamily: sans, fontWeight: 600,
    letterSpacing: 2, textTransform: "uppercase",
    cursor: "pointer",
    transition: "background 0.2s ease",
    ...style,
  }}
    onMouseEnter={e => e.currentTarget.style.background = C.terraDeep}
    onMouseLeave={e => e.currentTarget.style.background = C.terra}
    onMouseDown={e => e.currentTarget.style.transform = "scale(0.99)"}
    onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
  >{children}</button>
);

// ── DESKTOP LANDING ───────────────────────────────────────────────────────────
function DesktopLanding({ onPrototype }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  const submit = () => { if (email.includes("@")) setSent(true); };

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: sans, minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{
        padding: "18px 60px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: `1px solid ${C.border}`,
        position: "sticky", top: 0,
        background: `${C.bg}f5`,
        backdropFilter: "blur(8px)",
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.terra, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontSize: 13 }}>♥</div>
          <span style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: C.text }}>Lonely Hearts Club</span>
        </div>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          <a href="#hoe" style={{ color: C.textMid, fontSize: 13, textDecoration: "none" }}>Hoe het werkt</a>
          <a href="#waarom" style={{ color: C.textMid, fontSize: 13, textDecoration: "none" }}>Waarom anders</a>
          <button onClick={onPrototype} style={{
            padding: "8px 20px",
            background: "transparent",
            border: `1.5px solid ${C.terra}`,
            color: C.terra, fontFamily: sans,
            fontSize: 12, fontWeight: 600,
            letterSpacing: 1, cursor: "pointer",
          }}>Bekijk prototype</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "90px 60px 80px",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 80, alignItems: "center",
        opacity: vis ? 1 : 0, transition: "opacity 0.7s ease",
      }}>
        <div>
          <div style={{ fontFamily: sans, fontSize: 10, letterSpacing: 5, color: C.terra, fontWeight: 600, marginBottom: 20, textTransform: "uppercase" }}>
            Nederland · 2026 · Gratis
          </div>
          <h1 style={{
            fontFamily: serif, fontSize: 54, fontWeight: 700,
            lineHeight: 1.1, margin: "0 0 24px", color: C.text,
          }}>
            Dating begint<br />
            met een <em style={{ color: C.terra }}>stem</em>,<br />
            niet een gezicht.
          </h1>
          <p style={{
            fontSize: 16, color: C.textMid, lineHeight: 1.8,
            margin: "0 0 36px", maxWidth: 400,
          }}>
            Bij Lonely Hearts Club leer je iemand kennen van binnenuit.
            Eerst een anoniem gesprek, dan pas een gezicht.
          </p>

          {!sent ? (
            <div>
              <div style={{ display: "flex", gap: 0, maxWidth: 420 }}>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jouw@emailadres.nl"
                  onKeyDown={e => e.key === "Enter" && submit()}
                  style={{
                    flex: 1, padding: "14px 18px",
                    background: C.white,
                    border: `1.5px solid ${C.border}`,
                    borderRight: "none",
                    color: C.text, fontSize: 14,
                    fontFamily: sans, outline: "none",
                  }}
                />
                <button onClick={submit} style={{
                  padding: "14px 24px",
                  background: C.terra, border: "none",
                  color: C.white, fontSize: 12,
                  fontFamily: sans, fontWeight: 600,
                  letterSpacing: 1, textTransform: "uppercase",
                  cursor: "pointer", whiteSpace: "nowrap",
                }}>
                  Schrijf me in →
                </button>
              </div>
              <p style={{ fontSize: 11, color: C.textDim, marginTop: 10 }}>
                Geen spam. Alleen een bericht als we live gaan.
              </p>
            </div>
          ) : (
            <div style={{ padding: "16px 20px", border: `1.5px solid ${C.green}`, background: "#F0F7F3", display: "flex", alignItems: "center", gap: 12, maxWidth: 420 }}>
              <span style={{ color: C.green, fontSize: 18 }}>✓</span>
              <span style={{ fontSize: 14, color: C.green, fontWeight: 600 }}>Je staat op de lijst — we laten het je weten!</span>
            </div>
          )}
        </div>

        {/* Phone mockup */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{
            width: 260, background: C.white,
            border: `1.5px solid ${C.border}`,
            borderRadius: 28, overflow: "hidden",
            boxShadow: "0 20px 60px rgba(28,24,20,0.12), 0 4px 16px rgba(28,24,20,0.08)",
          }}>
            <div style={{ background: C.terra, padding: "8px 0", textAlign: "center" }}>
              <span style={{ fontFamily: sans, fontSize: 7, letterSpacing: 4, color: C.white, fontWeight: 600 }}>LONELYHEARTSCLUB.NL</span>
            </div>
            <div style={{ padding: "24px 18px" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", border: `1.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: C.terra, margin: "0 auto 14px" }}>♥</div>
              <h2 style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: C.text, textAlign: "center", margin: "0 0 4px" }}>Lonely Hearts Club</h2>
              <p style={{ fontFamily: sans, fontSize: 10, color: C.terra, textAlign: "center", margin: "0 0 16px" }}>Daten zonder foto's</p>
              <Rule />
              {[
                { n: "01", text: "Profiel zonder foto", color: C.bronze },
                { n: "02", text: "Anoniem bellen",      color: C.terra  },
                { n: "03", text: "Videogesprek",         color: "#6B4E8A"},
                { n: "04", text: "Echte afspraak",       color: C.green  },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", marginBottom: 4, borderLeft: `2px solid ${s.color}`, background: `${s.color}10` }}>
                  <span style={{ fontFamily: sans, fontSize: 8, color: s.color, fontWeight: 700, width: 16 }}>{s.n}</span>
                  <span style={{ fontFamily: sans, fontSize: 11, color: C.text }}>{s.text}</span>
                </div>
              ))}
              <button onClick={onPrototype} style={{ marginTop: 14, width: "100%", padding: "10px", background: C.terra, border: "none", color: C.white, fontFamily: sans, fontSize: 9, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>
                Bekijk prototype →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="hoe" style={{ background: C.card, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 60px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontFamily: sans, fontSize: 10, letterSpacing: 5, color: C.terra, fontWeight: 600, marginBottom: 12, textTransform: "uppercase" }}>Hoe het werkt</div>
            <h2 style={{ fontFamily: serif, fontSize: 38, fontWeight: 700, color: C.text, margin: 0 }}>Vier stappen naar echte verbinding</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {[
              { n: "01", title: "Profiel zonder foto", desc: "Beschrijf wie je bent in woorden. Geen filters, geen poses. Gewoon jij.", color: C.bronze, icon: "◆" },
              { n: "02", title: "Anoniem bellen", desc: "Een gesprek van 10 minuten. Jullie nummers blijven verborgen voor elkaar.", color: C.terra, icon: "☎" },
              { n: "03", title: "Videogesprek", desc: "Na 3 gesprekken kun je elkaar voor het eerst écht zien via video.", color: "#6B4E8A", icon: "◉" },
              { n: "04", title: "Echte afspraak", desc: "Jullie kennen elkaar al. De eerste date voelt als een tweede.", color: C.green, icon: "♥" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "28px 22px", background: C.white, borderTop: `3px solid ${s.color}`, border: `1px solid ${C.border}`, borderTopWidth: 3, borderTopColor: s.color }}>
                <div style={{ fontSize: 20, color: s.color, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontFamily: sans, fontSize: 9, letterSpacing: 3, color: s.color, fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>{s.n}</div>
                <h3 style={{ fontFamily: serif, fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 10px" }}>{s.title}</h3>
                <p style={{ fontFamily: sans, fontSize: 13, color: C.textMid, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why different */}
      <section id="waarom" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 60px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: sans, fontSize: 10, letterSpacing: 5, color: C.terra, fontWeight: 600, marginBottom: 16, textTransform: "uppercase" }}>Waarom anders</div>
          <h2 style={{ fontFamily: serif, fontSize: 38, fontWeight: 700, color: C.text, margin: "0 0 22px", lineHeight: 1.2 }}>
            Tinder is gemaakt<br />voor uiterlijk. Wij niet.
          </h2>
          <p style={{ fontFamily: sans, fontSize: 15, color: C.textMid, lineHeight: 1.8, marginBottom: 20 }}>
            Op de meeste datingapps beslis je in twee seconden op basis van een foto. Bij Lonely Hearts Club leer je eerst wie iemand is — en pas daarna zie je hoe ze eruitzien.
          </p>
          <p style={{ fontFamily: sans, fontSize: 15, color: C.textMid, lineHeight: 1.8 }}>
            Het resultaat: diepere verbindingen, minder oppervlakkigheid, en een eerste date die voelt als een tweede.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Tinder / Bumble", text: "Foto eerst, dan pas praten", bad: true },
            { label: "Lonely Hearts Club", text: "Stem eerst, dan pas zien", bad: false },
          ].map((s, i) => (
            <div key={i} style={{ padding: "20px 24px", background: s.bad ? C.card : "#FDF8F4", border: `1.5px solid ${s.bad ? C.border : C.terra + "60"}`, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: s.bad ? C.border : C.terra, display: "flex", alignItems: "center", justifyContent: "center", color: s.bad ? C.textDim : C.white, fontSize: 14, flexShrink: 0 }}>{s.bad ? "✕" : "♥"}</div>
              <div>
                <div style={{ fontFamily: sans, fontSize: 10, letterSpacing: 2, color: s.bad ? C.textDim : C.terra, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>{s.label}</div>
                <div style={{ fontFamily: sans, fontSize: 14, color: s.bad ? C.textMid : C.text, fontWeight: s.bad ? 400 : 600 }}>{s.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ background: C.bgDark, padding: "80px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: serif, fontSize: 40, fontWeight: 700, color: C.white, margin: "0 0 16px" }}>
            Klaar voor een echte verbinding?
          </h2>
          <p style={{ fontFamily: sans, fontSize: 15, color: "#A09080", marginBottom: 32 }}>
            Schrijf je in en ontvang een bericht als we live gaan.
          </p>
          {!sent ? (
            <div style={{ display: "flex", gap: 0, maxWidth: 420, margin: "0 auto" }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jouw@emailadres.nl" onKeyDown={e => e.key === "Enter" && submit()} style={{ flex: 1, padding: "14px 18px", background: "#2C2420", border: `1.5px solid #3C3028`, borderRight: "none", color: C.white, fontSize: 14, fontFamily: sans, outline: "none" }} />
              <button onClick={submit} style={{ padding: "14px 24px", background: C.terra, border: "none", color: C.white, fontSize: 12, fontFamily: sans, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>Schrijf me in →</button>
            </div>
          ) : (
            <div style={{ padding: "16px 24px", border: `1.5px solid ${C.green}`, background: "rgba(45,106,79,0.15)", display: "inline-flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: C.green, fontSize: 18 }}>✓</span>
              <span style={{ fontSize: 14, color: "#80C0A0" }}>Je staat op de lijst!</span>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid #2C2420`, background: C.bgDark, padding: "24px 60px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.terra, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontSize: 10 }}>♥</div>
          <span style={{ fontFamily: serif, fontSize: 14, color: "#80706A" }}>Lonely Hearts Club</span>
        </div>
        <span style={{ fontFamily: sans, fontSize: 11, color: "#4C3C34", letterSpacing: 2, textTransform: "uppercase" }}>Est. 2026 · Nederland</span>
        <button onClick={onPrototype} style={{ background: "none", border: "none", fontFamily: sans, fontSize: 11, color: "#80706A", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>
          Bekijk prototype →
        </button>
      </footer>
    </div>
  );
}

// ── MOBILE APP ────────────────────────────────────────────────────────────────
function MobileApp() {
  const [idx, setIdx] = useState(0);
  const screens = ["Home", "Profiel", "Ontdek", "Match", "Bellen", "Review"];

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const submit = () => { if (email.includes("@")) setSent(true); };

  const [step, setStep] = useState(0);
  const profileSteps = [
    { label: "Naam",     q: "Wat is je voornaam?",         val: "Marcel",                                         type: "input" },
    { label: "Leeftijd", q: "Hoe oud ben je?",             val: "48",                                             type: "input" },
    { label: "Verhaal",  q: "Omschrijf jezelf in één zin", val: "Avontuurlijk, eerlijk, op zoek naar verbinding.", type: "area"  },
    { label: "Passies",  q: "Wat zijn je passies?",        val: "Hardlopen, schilderen, reizen.",                  type: "area"  },
  ];
  const accent = [C.bronze, "#6B4E8A", C.terra, C.green];

  const [profileIdx, setProfileIdx] = useState(0);
  const profiles = [
    { name: "Sarah", age: 42, tagline: "Dromer met beide voeten op de grond", bio: "Op zoek naar echte gesprekken en verbinding. Ik hou van natuur en eerlijke mensen.", tags: ["Natuur", "Lezen", "Koken"], match: 94 },
    { name: "Linda", age: 45, tagline: "Nieuwsgierig naar het leven", bio: "Moeder, reiziger, yogalerares. De mooiste liefde begint bij een goed gesprek.", tags: ["Yoga", "Reizen", "Theater"], match: 87 },
  ];

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

  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (idx === 3) { const t = setInterval(() => setScale(s => s === 1 ? 1.08 : 1), 1100); return () => clearInterval(t); }
  }, [idx]);

  const [stars, setStars] = useState(4);
  const next = () => setIdx(i => Math.min(i + 1, screens.length - 1));
  const p = profiles[profileIdx] || profiles[0];
  const ps = profileSteps[step];
  const pa = accent[step];

  const Header = ({ label, title }) => (
    <div style={{ background: C.white, padding: "12px 20px", borderBottom: `1px solid ${C.border}`, flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: C.terra, fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontFamily: serif, fontSize: 16, color: C.text, fontWeight: 700, marginTop: 2 }}>{title}</div>
      </div>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.terra, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontSize: 12 }}>♥</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: sans }}>
      {/* Status bar */}
      <div style={{ padding: "10px 20px 6px", display: "flex", justifyContent: "space-between", fontFamily: sans, fontSize: 10, color: C.textDim, flexShrink: 0, background: C.white, borderBottom: `1px solid ${C.border}` }}>
        <span>9:41</span>
        <span style={{ color: C.terra, letterSpacing: 1, fontWeight: 700 }}>Lonely Hearts Club</span>
        <span>●●●</span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* HOME */}
        {idx === 0 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg, overflow: "hidden" }}>
            <div style={{ background: C.terra, padding: "8px 0", textAlign: "center" }}>
              <span style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: C.white, fontWeight: 600 }}>LONELYHEARTSCLUB.NL</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 24px 20px", overflowY: "auto" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", border: `1.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: C.terra, marginBottom: 18 }}>♥</div>
              <h1 style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, color: C.text, textAlign: "center", margin: "0 0 6px", lineHeight: 1.15 }}>Lonely Hearts Club</h1>
              <p style={{ fontFamily: sans, fontSize: 13, color: C.terra, textAlign: "center", margin: "0 0 18px" }}>Dating begint met een stem</p>
              <Rule />
              <div style={{ width: "100%", marginBottom: 24 }}>
                {[
                  { n: "01", text: "Profiel zonder foto", color: C.bronze },
                  { n: "02", text: "Anoniem bellen",      color: C.terra  },
                  { n: "03", text: "Videogesprek",         color: "#6B4E8A"},
                  { n: "04", text: "Echte afspraak",       color: C.green  },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", marginBottom: 4, borderLeft: `2px solid ${s.color}`, background: `${s.color}10` }}>
                    <span style={{ fontFamily: sans, fontSize: 9, color: s.color, fontWeight: 700, width: 20 }}>{s.n}</span>
                    <span style={{ fontFamily: sans, fontSize: 13, color: C.text }}>{s.text}</span>
                  </div>
                ))}
              </div>
              {!sent ? (
                <div style={{ width: "100%" }}>
                  <p style={{ fontFamily: sans, fontSize: 10, color: C.textDim, textAlign: "center", marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>Vroege toegang</p>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jouw@emailadres.nl" style={{ width: "100%", padding: "12px 14px", background: C.white, border: `1.5px solid ${C.border}`, color: C.text, fontSize: 13, fontFamily: sans, outline: "none", marginBottom: 8, boxSizing: "border-box" }} />
                  <PrimaryBtn onClick={submit}>Zet mij op de lijst →</PrimaryBtn>
                </div>
              ) : (
                <div style={{ width: "100%", padding: "16px", border: `1.5px solid ${C.green}`, background: "#F0F7F4", textAlign: "center" }}>
                  <p style={{ fontFamily: sans, fontSize: 13, color: C.green, margin: 0, fontWeight: 600 }}>✓ Je staat op de lijst!</p>
                </div>
              )}
              <button onClick={next} style={{ marginTop: 16, background: "none", border: "none", fontFamily: sans, fontSize: 12, color: C.textDim, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>Bekijk het prototype →</button>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {idx === 1 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
            <Header label="Jouw profiel" title="Vertel je verhaal" />
            <div style={{ display: "flex", gap: 4, padding: "12px 20px 0" }}>
              {profileSteps.map((_, i) => (
                <div key={i} style={{ flex: i === step ? 3 : 1, height: 2, background: i < step ? C.terra : i === step ? pa : C.border, transition: "all 0.3s" }} />
              ))}
            </div>
            <div style={{ flex: 1, padding: "16px 20px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
              <div style={{ padding: "10px 14px", marginBottom: 14, border: `1px solid ${C.border}`, background: C.card, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ color: C.terra }}>◆</span>
                <span style={{ fontFamily: sans, fontSize: 12, color: C.textMid, fontStyle: "italic" }}>Geen foto. Jij bent meer dan een plaatje.</span>
              </div>
              <div style={{ border: `1.5px solid ${pa}40`, padding: "16px", marginBottom: 14, background: C.white }}>
                <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: pa, marginBottom: 8, fontWeight: 700, textTransform: "uppercase" }}>{ps.label}</div>
                <h3 style={{ fontFamily: serif, fontSize: 17, color: C.text, margin: "0 0 12px", fontWeight: 700 }}>{ps.q}</h3>
                {ps.type === "input" ? (
                  <input defaultValue={ps.val} style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 18, padding: "10px 12px", fontFamily: serif, outline: "none", boxSizing: "border-box" }} />
                ) : (
                  <textarea defaultValue={ps.val} rows={3} style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 13, padding: "10px 12px", fontFamily: sans, outline: "none", resize: "none", boxSizing: "border-box", lineHeight: 1.7 }} />
                )}
              </div>
              {step === 3 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {[["Hardlopen", true], ["Kunst", true], ["Reizen", true], ["Lezen", false], ["Wijn", false]].map(([t, active], i) => (
                    <span key={i} style={{ padding: "5px 14px", fontSize: 12, border: `1px solid ${active ? C.terra : C.border}`, color: active ? C.terra : C.textDim, background: active ? "#FDF0EC" : "transparent", cursor: "pointer" }}>{t}</span>
                  ))}
                </div>
              )}
              <div style={{ flex: 1 }} />
              <div style={{ display: "flex", gap: 8 }}>
                {step > 0 && <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: "13px", background: "transparent", border: `1px solid ${C.border}`, color: C.textMid, fontFamily: sans, fontSize: 12, cursor: "pointer" }}>← Terug</button>}
                <PrimaryBtn onClick={() => step < profileSteps.length - 1 ? setStep(s => s + 1) : next()} style={{ flex: step > 0 ? 3 : 1, background: pa }}>
                  {step < profileSteps.length - 1 ? "Verder →" : "Opslaan ✓"}
                </PrimaryBtn>
              </div>
            </div>
          </div>
        )}

        {/* DISCOVER */}
        {idx === 2 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
            <Header label="Nieuwe leden" title="Ontdek matches" />
            <div style={{ flex: 1, padding: "14px", display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1, background: C.white, border: `1px solid ${C.border}`, padding: "18px", marginBottom: 10, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 18, color: C.textDim }}>?</div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: serif, fontSize: 26, fontWeight: 700, color: C.terra }}>{p.match}%</div>
                    <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 2, color: C.textDim, fontWeight: 600, textTransform: "uppercase" }}>Match</div>
                  </div>
                </div>
                <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>{p.name}, {p.age}</h3>
                <p style={{ fontFamily: sans, fontSize: 12, color: C.terra, margin: "0 0 14px" }}>{p.tagline}</p>
                <Rule />
                <p style={{ fontFamily: sans, fontSize: 13, color: C.textMid, lineHeight: 1.7, flex: 1 }}>{p.bio}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
                  {p.tags.map((t, i) => <span key={i} style={{ padding: "4px 12px", border: `1px solid ${C.border}`, fontFamily: sans, fontSize: 11, color: C.textMid }}>{t}</span>)}
                </div>
                <div style={{ marginTop: 12, padding: "8px 12px", background: C.card, display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ color: C.terra, fontSize: 10 }}>◆</span>
                  <span style={{ fontFamily: sans, fontSize: 10, color: C.textDim, letterSpacing: 1, textTransform: "uppercase" }}>Foto zichtbaar na eerste gesprek</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setProfileIdx(i => Math.min(i + 1, profiles.length - 1))} style={{ flex: 1, padding: "12px", background: C.white, border: `1px solid ${C.border}`, color: C.textDim, fontSize: 16, cursor: "pointer" }}>✕</button>
                <PrimaryBtn onClick={next} style={{ flex: 3 }}>♥ &nbsp;Interesse</PrimaryBtn>
                <button style={{ flex: 1, padding: "12px", background: C.white, border: `1px solid ${C.border}`, color: C.bronze, fontSize: 16, cursor: "pointer" }}>★</button>
              </div>
            </div>
          </div>
        )}

        {/* MATCH */}
        {idx === 3 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
            <div style={{ background: C.terra, padding: "10px 0", textAlign: "center" }}>
              <span style={{ fontFamily: sans, fontSize: 8, letterSpacing: 5, color: C.white, fontWeight: 600, textTransform: "uppercase" }}>Het is wederzijds</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
              <div style={{ fontSize: 64, marginBottom: 20, color: C.terra, transform: `scale(${scale})`, transition: "transform 0.5s ease" }}>♥</div>
              <div style={{ width: "100%", padding: "20px", border: `1px solid ${C.border}`, background: C.white, textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: C.terra, marginBottom: 8, fontWeight: 700, textTransform: "uppercase" }}>Jullie hebben een klik</div>
                <h2 style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Jij & Sarah</h2>
                <p style={{ fontFamily: sans, fontSize: 12, color: C.textDim, margin: 0 }}>Beiden tonen interesse</p>
              </div>
              {[
                { n: "I",   label: "Anoniem bellen", sub: "10 min · Nu beschikbaar", active: true,  color: C.terra  },
                { n: "II",  label: "Videobel",        sub: "Na 3 gesprekken",         active: false, color: "#6B4E8A"},
                { n: "III", label: "Afspreken",        sub: "Na videogesprek",         active: false, color: C.green  },
              ].map(s => (
                <div key={s.n} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", marginBottom: 6, borderLeft: `2px solid ${s.active ? s.color : C.border}`, background: s.active ? "#FDF0EC" : C.card, opacity: s.active ? 1 : 0.6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", border: `1px solid ${s.active ? s.color : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 9, color: s.active ? s.color : C.textDim, flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: s.active ? C.text : C.textDim }}>{s.label}</div>
                    <div style={{ fontFamily: sans, fontSize: 10, color: s.active ? s.color : C.textDim }}>{s.sub}</div>
                  </div>
                  {s.active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: C.green }} />}
                </div>
              ))}
              <PrimaryBtn onClick={next} style={{ marginTop: 16 }}>☎ &nbsp;Bel Sarah nu</PrimaryBtn>
            </div>
          </div>
        )}

        {/* CALL */}
        {idx === 4 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
            <div style={{ background: C.green, padding: "8px 20px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.white }} />
              <span style={{ fontFamily: sans, fontSize: 9, letterSpacing: 3, color: C.white, fontWeight: 600, textTransform: "uppercase" }}>Anoniem gesprek actief</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around", padding: "24px 20px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 84, height: 84, borderRadius: "50%", background: C.card, border: `1.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 30, color: C.textDim, margin: "0 auto 12px" }}>?</div>
                <h2 style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Sarah, 42</h2>
                <p style={{ fontFamily: sans, fontSize: 10, color: C.textDim, margin: 0 }}>Nummers verborgen voor beiden</p>
              </div>
              <div style={{ padding: "14px 28px", border: `1px solid ${C.border}`, textAlign: "center", background: C.white }}>
                <div style={{ fontFamily: sans, fontSize: 32, fontWeight: 700, color: C.text, letterSpacing: 4 }}>{fmt(secs)}</div>
                <div style={{ fontFamily: sans, fontSize: 9, color: C.textDim, letterSpacing: 2, marginTop: 4, textTransform: "uppercase" }}>{Math.max(0, 600 - secs)}s resterend</div>
              </div>
              <div style={{ display: "flex", gap: 3, alignItems: "center", height: 26 }}>
                {bars.map((h, i) => (
                  <div key={i} style={{ width: 3, borderRadius: 2, height: h * 1.8, background: i % 2 === 0 ? C.terra : C.bronze, opacity: 0.6, transition: "height 0.2s ease" }} />
                ))}
              </div>
              <div style={{ width: "100%", padding: "14px", border: `1px solid ${C.border}`, background: C.white }}>
                <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: C.terra, marginBottom: 6, fontWeight: 700, textTransform: "uppercase" }}>Gespreksstarter</div>
                <p style={{ fontFamily: sans, fontSize: 13, color: C.textMid, margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>"Wat is het mooiste moment dat je ooit hebt meegemaakt op reis?"</p>
              </div>
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <button onClick={() => setMuted(m => !m)} style={{ width: 48, height: 48, borderRadius: "50%", background: muted ? "#FDF0EC" : C.white, border: `1px solid ${muted ? C.terra : C.border}`, color: muted ? C.terra : C.textDim, fontSize: 16, cursor: "pointer" }}>{muted ? "✕" : "♪"}</button>
                <button onClick={next} style={{ width: 60, height: 60, borderRadius: "50%", background: "#C0392B", border: "none", color: C.white, fontSize: 20, cursor: "pointer", boxShadow: "0 4px 16px rgba(192,57,43,0.3)" }}>✕</button>
                <button style={{ width: 48, height: 48, borderRadius: "50%", background: C.white, border: `1px solid ${C.border}`, color: C.textDim, fontSize: 16, cursor: "pointer" }}>◎</button>
              </div>
            </div>
          </div>
        )}

        {/* REVIEW */}
        {idx === 5 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
            <Header label="Gesprek afgerond" title="Jouw beoordeling" />
            <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
              <h2 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 6px" }}>Hoe was het met Sarah?</h2>
              <p style={{ fontFamily: sans, fontSize: 13, color: C.textMid, margin: "0 0 20px", lineHeight: 1.6 }}>Jouw terugkoppeling helpt ons betere matches te maken.</p>
              <Rule />
              <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "16px 0 24px" }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <span key={i} onClick={() => setStars(i)} style={{ fontSize: 30, cursor: "pointer", color: i <= stars ? C.bronze : C.border, transition: "all 0.2s", display: "inline-block", transform: i <= stars ? "scale(1.08)" : "scale(1)" }}>★</span>
                ))}
              </div>
              <div style={{ padding: "16px", border: `1px solid ${C.border}`, background: C.white, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: sans, fontSize: 9, letterSpacing: 2, color: C.textDim, fontWeight: 700, textTransform: "uppercase" }}>Voortgang naar video</span>
                  <span style={{ fontFamily: serif, fontSize: 13, fontWeight: 700, color: C.terra }}>1 / 3</span>
                </div>
                <div style={{ height: 3, background: C.border, marginBottom: 8 }}>
                  <div style={{ width: "33%", height: "100%", background: C.terra }} />
                </div>
                <p style={{ fontFamily: sans, fontSize: 10, color: C.textDim, margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>Nog 2 gesprekken voor video</p>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setIdx(i => Math.max(i - 1, 0))} style={{ flex: 1, padding: "13px", background: C.white, border: `1px solid ${C.border}`, color: C.textMid, fontFamily: sans, fontSize: 12, cursor: "pointer" }}>← Terug</button>
                <PrimaryBtn onClick={() => setIdx(0)} style={{ flex: 2 }}>Opslaan ✓</PrimaryBtn>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ display: "flex", borderTop: `1px solid ${C.border}`, background: C.white, flexShrink: 0 }}>
        {screens.map((s, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{
            flex: 1, padding: "10px 0",
            background: "transparent", border: "none",
            fontFamily: sans, fontSize: 8,
            color: i === idx ? C.terra : C.textDim,
            fontWeight: i === idx ? 700 : 400,
            letterSpacing: 1, textTransform: "uppercase",
            cursor: "pointer",
            borderTop: i === idx ? `2px solid ${C.terra}` : "2px solid transparent",
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
      <div style={{ minHeight: "100vh", background: C.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
        <button onClick={() => setShowPrototype(false)} style={{ marginBottom: 20, background: "none", border: `1px solid ${C.border}`, color: C.textMid, fontFamily: sans, fontSize: 12, padding: "8px 20px", cursor: "pointer", letterSpacing: 1 }}>← Terug naar site</button>
        <div style={{ width: 375, height: 750, borderRadius: 38, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 20px 60px rgba(28,24,20,0.15), 0 4px 16px rgba(28,24,20,0.08)" }}>
          <MobileApp />
        </div>
      </div>
    );
  }
  return <DesktopLanding onPrototype={() => setShowPrototype(true)} />;
}
