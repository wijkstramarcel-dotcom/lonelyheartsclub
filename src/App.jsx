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

const serif  = "'Playfair Display', Georgia, serif";
const sans   = "'DM Sans', sans-serif";

// ── TINY COMPONENTS ──────────────────────────────────────────────────────────

const Rule = ({ color = C.gold }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
    <div style={{ flex: 1, height: 1, background: `${color}30` }} />
    <span style={{ color: `${color}80`, fontSize: 9, letterSpacing: 4 }}>✦</span>
    <div style={{ flex: 1, height: 1, background: `${color}30` }} />
  </div>
);

const Tag = ({ children, active, color = C.gold }) => (
  <span style={{
    padding: "5px 14px", fontSize: 11,
    border: `1px solid ${active ? color : color + "30"}`,
    color: active ? color : C.dim,
    background: active ? `${color}12` : "transparent",
    fontFamily: sans, letterSpacing: 1,
    cursor: "pointer",
  }}>{children}</span>
);

// ── WAITLIST SCREEN ───────────────────────────────────────────────────────────
function WaitlistScreen({ onNext }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [vis, setVis] = useState(false);

  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);

  const submit = () => {
    if (email.includes("@")) { setSent(true); }
  };

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      background: `radial-gradient(ellipse at 50% -10%, #2a0840 0%, ${C.bg} 55%)`,
      overflow: "hidden",
    }}>
      {/* Top bar */}
      <div style={{
        background: C.magenta,
        padding: "9px 0", textAlign: "center",
        borderBottom: `1px solid ${C.gold}40`,
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: sans, fontSize: 8, letterSpacing: 5, color: C.gold, fontWeight: 700 }}>
          LONELYHEARTSCLUB.NL
        </span>
      </div>

      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", padding: "32px 28px 24px",
        opacity: vis ? 1 : 0, transition: "opacity 0.7s ease",
        overflowY: "auto",
      }}>

        {/* Logo mark */}
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          border: `1px solid ${C.gold}50`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, color: C.magenta, marginBottom: 24,
          background: `radial-gradient(circle, #1a0830, ${C.bg})`,
          boxShadow: `0 0 40px ${C.magenta}20`,
        }}>♥</div>

        {/* Title */}
        <h1 style={{
          fontFamily: serif, fontSize: 30, fontWeight: 900,
          color: C.cream, textAlign: "center",
          margin: "0 0 6px", lineHeight: 1.15,
          letterSpacing: 1,
        }}>Lonely Hearts<br />Club</h1>

        <p style={{
          fontFamily: serif, fontSize: 13, fontStyle: "italic",
          color: C.gold, textAlign: "center", margin: "0 0 24px",
        }}>De Nederlandse datingapp zonder foto's</p>

        <Rule />

        {/* Concept */}
        <p style={{
          fontFamily: sans, fontSize: 13, color: C.dim,
          textAlign: "center", lineHeight: 1.8,
          margin: "0 0 24px",
        }}>
          Bij ons leer je iemand kennen van<br />
          binnenuit. Eerst een stem, dan een gezicht.
        </p>

        {/* Steps */}
        <div style={{ width: "100%", marginBottom: 28 }}>
          {[
            { n: "01", text: "Profiel zonder foto",  color: C.gold    },
            { n: "02", text: "Anoniem bellen",        color: C.magenta },
            { n: "03", text: "Videogesprek",          color: "#7b5ea7" },
            { n: "04", text: "Echte afspraak",        color: C.green   },
          ].map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "11px 16px", marginBottom: 4,
              borderLeft: `2px solid ${s.color}`,
              background: `${s.color}08`,
              opacity: vis ? 1 : 0,
              transition: `opacity 0.4s ease ${i * 0.1 + 0.3}s`,
            }}>
              <span style={{ fontFamily: sans, fontSize: 9, color: s.color, fontWeight: 700, letterSpacing: 1, width: 20, flexShrink: 0 }}>{s.n}</span>
              <span style={{ fontFamily: sans, fontSize: 13, color: C.cream, fontWeight: 500 }}>{s.text}</span>
            </div>
          ))}
        </div>

        <Rule color={C.magenta} />

        {/* Waitlist form */}
        {!sent ? (
          <div style={{ width: "100%" }}>
            <p style={{
              fontFamily: sans, fontSize: 11, color: C.dim,
              textAlign: "center", marginBottom: 14, letterSpacing: 1,
              textTransform: "uppercase",
            }}>
              Schrijf je in voor vroege toegang
            </p>

            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jouw@emailadres.nl"
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{
                width: "100%", padding: "13px 16px",
                background: C.card,
                border: `1px solid ${C.gold}30`,
                color: C.cream, fontSize: 14,
                fontFamily: sans,
                outline: "none", marginBottom: 10,
                boxSizing: "border-box",
              }}
            />

            <button onClick={submit} style={{
              width: "100%", padding: "14px",
              background: C.magenta,
              border: `1px solid ${C.gold}50`,
              color: C.gold, fontSize: 11,
              fontFamily: sans, fontWeight: 700,
              letterSpacing: 3, textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: `0 4px 24px ${C.magenta}40`,
            }}>
              Zet mij op de lijst →
            </button>

            <p style={{
              fontFamily: sans, fontSize: 10, color: C.muted,
              textAlign: "center", marginTop: 10,
            }}>
              Geen spam. Alleen een bericht als we live gaan.
            </p>
          </div>
        ) : (
          <div style={{
            width: "100%", padding: "24px",
            border: `1px solid ${C.green}40`,
            background: `${C.green}08`,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>♥</div>
            <h3 style={{ fontFamily: serif, fontSize: 18, color: C.cream, margin: "0 0 8px" }}>
              Je staat op de lijst
            </h3>
            <p style={{ fontFamily: sans, fontSize: 12, color: C.dim, margin: 0 }}>
              We sturen je een bericht zodra<br />we live gaan.
            </p>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <button onClick={onNext} style={{
            background: "none", border: "none",
            fontFamily: sans, fontSize: 11,
            color: C.dim, cursor: "pointer",
            letterSpacing: 1, textDecoration: "underline",
            textUnderlineOffset: 3,
          }}>
            Bekijk het prototype →
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        padding: "8px 0", textAlign: "center",
        borderTop: `1px solid ${C.gold}15`,
        background: "#050310", flexShrink: 0,
      }}>
        <span style={{ fontFamily: sans, fontSize: 8, letterSpacing: 3, color: C.muted }}>
          EST. 2026 · NEDERLAND · GRATIS
        </span>
      </div>
    </div>
  );
}

// ── PROFILE SCREEN ────────────────────────────────────────────────────────────
function ProfileScreen({ onNext }) {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Naam",     q: "Wat is je voornaam?",          val: "Marcel", type: "input" },
    { label: "Leeftijd", q: "Hoe oud ben je?",              val: "48",     type: "input" },
    { label: "Verhaal",  q: "Omschrijf jezelf in één zin",  val: "Avontuurlijk, eerlijk, op zoek naar echte verbinding.", type: "area" },
    { label: "Passies",  q: "Wat zijn je passies?",         val: "Hardlopen, schilderen, reizen.", type: "area" },
  ];
  const accent = [C.gold, "#7b5ea7", C.magenta, C.green];
  const s = steps[step];
  const a = accent[step];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      {/* Header */}
      <div style={{ background: C.card, padding: "12px 24px", borderBottom: `1px solid ${C.gold}20`, flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: C.gold, fontWeight: 700 }}>JOUW PROFIEL</div>
          <div style={{ fontFamily: serif, fontSize: 16, color: C.cream, fontWeight: 700, marginTop: 2 }}>Vertel je verhaal</div>
        </div>
        <div style={{ fontFamily: sans, fontSize: 11, color: C.dim }}>{step + 1} / {steps.length}</div>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", gap: 4, padding: "12px 24px 0" }}>
        {steps.map((_, i) => (
          <div key={i} style={{ flex: i === step ? 3 : 1, height: 2, background: i < step ? C.gold : i === step ? a : C.muted, transition: "all 0.3s ease" }} />
        ))}
      </div>

      <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {/* No photo */}
        <div style={{ padding: "10px 14px", marginBottom: 18, border: `1px dashed ${C.gold}25`, display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ color: C.gold, fontSize: 13 }}>♦</span>
          <span style={{ fontFamily: sans, fontSize: 12, color: C.dim, fontStyle: "italic" }}>Geen foto. Jij bent meer dan een plaatje.</span>
        </div>

        {/* Question */}
        <div style={{ border: `1px solid ${a}30`, padding: "18px", marginBottom: 16, background: `${a}06` }}>
          <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: a, marginBottom: 10, fontWeight: 700 }}>{s.label.toUpperCase()}</div>
          <h3 style={{ fontFamily: serif, fontSize: 17, color: C.cream, margin: "0 0 14px", fontWeight: 700 }}>{s.q}</h3>
          {s.type === "input" ? (
            <input defaultValue={s.val} style={{ width: "100%", background: `${a}08`, border: `1px solid ${a}30`, color: C.cream, fontSize: 18, padding: "10px 12px", fontFamily: serif, outline: "none", boxSizing: "border-box" }} />
          ) : (
            <textarea defaultValue={s.val} rows={3} style={{ width: "100%", background: `${a}08`, border: `1px solid ${a}30`, color: C.cream, fontSize: 13, padding: "10px 12px", fontFamily: sans, outline: "none", resize: "none", boxSizing: "border-box", lineHeight: 1.7 }} />
          )}
        </div>

        {step === 3 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {[["Hardlopen", true], ["Kunst", true], ["Reizen", true], ["Lezen", false], ["Wijn", false], ["Muziek", false]].map(([t, active], i) => (
              <Tag key={i} active={active}>{t}</Tag>
            ))}
          </div>
        )}

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", gap: 8 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: "13px", background: "transparent", border: `1px solid ${C.white}10`, color: C.dim, fontFamily: sans, fontSize: 11, letterSpacing: 2, cursor: "pointer" }}>← Terug</button>
          )}
          <button onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onNext()} style={{ flex: step > 0 ? 3 : 1, padding: "14px", background: a, border: "none", color: C.bg, fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>
            {step < steps.length - 1 ? "Verder →" : "Opslaan ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DISCOVER SCREEN ───────────────────────────────────────────────────────────
function DiscoverScreen({ onNext }) {
  const [idx, setIdx] = useState(0);
  const profiles = [
    { name: "Sarah", age: 42, tagline: "Dromer met beide voeten op de grond", bio: "Op zoek naar echte gesprekken. Ik hou van natuur, stille ochtenden en eerlijke mensen.", tags: ["Natuur", "Lezen", "Koken"], match: 94 },
    { name: "Linda", age: 45, tagline: "Nieuwsgierig naar het leven en naar jou", bio: "Moeder, reiziger, yogalerares. De mooiste liefde begint bij een goed gesprek.", tags: ["Yoga", "Reizen", "Theater"], match: 87 },
    { name: "Anke",  age: 39, tagline: "Avontuurlijk maar ook gewoon thuis", bio: "Werk in de zorg, hou van muziek. Iemand die net zo goed kan luisteren als praten.", tags: ["Muziek", "Wijn", "Honden"], match: 81 },
  ];
  const p = profiles[idx];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <div style={{ background: C.card, padding: "12px 24px", borderBottom: `1px solid ${C.gold}20`, flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: C.gold, fontWeight: 700 }}>NIEUWE LEDEN</div>
          <div style={{ fontFamily: serif, fontSize: 16, color: C.cream, fontWeight: 700, marginTop: 2 }}>Ontdek matches</div>
        </div>
        <div style={{ fontFamily: sans, fontSize: 11, color: C.dim }}>{idx + 1} / {profiles.length}</div>
      </div>

      <div style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, background: C.card, border: `1px solid ${C.gold}20`, padding: "22px", marginBottom: 12, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: `radial-gradient(circle, #2a0840, ${C.bg})`, border: `1px solid ${C.gold}30`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 20, color: C.gold }}>?</div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: serif, fontSize: 26, fontWeight: 900, color: C.gold, lineHeight: 1 }}>{p.match}%</div>
              <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 2, color: C.dim, fontWeight: 700 }}>MATCH</div>
            </div>
          </div>

          <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: C.cream, margin: "0 0 4px" }}>{p.name}, {p.age}</h3>
          <p style={{ fontFamily: sans, fontSize: 12, fontStyle: "italic", color: C.gold, margin: "0 0 16px" }}>{p.tagline}</p>

          <Rule />

          <p style={{ fontFamily: sans, fontSize: 13, color: C.dim, lineHeight: 1.7, flex: 1 }}>{p.bio}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16 }}>
            {p.tags.map((t, i) => <Tag key={i}>{t}</Tag>)}
          </div>

          <div style={{ marginTop: 14, padding: "8px 12px", border: `1px dashed ${C.gold}20`, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ color: C.gold, fontSize: 10 }}>♦</span>
            <span style={{ fontFamily: sans, fontSize: 10, color: C.dim, letterSpacing: 1 }}>FOTO ZICHTBAAR NA EERSTE GESPREK</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setIdx(i => Math.min(i + 1, profiles.length - 1))} style={{ flex: 1, padding: "13px", background: "transparent", border: `1px solid ${C.white}10`, color: C.dim, fontSize: 18, cursor: "pointer" }}>✕</button>
          <button onClick={onNext} style={{ flex: 3, padding: "13px", background: C.magenta, border: "none", color: C.cream, fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", boxShadow: `0 4px 20px ${C.magenta}40` }}>♥ &nbsp; Interesse</button>
          <button style={{ flex: 1, padding: "13px", background: `${C.gold}10`, border: `1px solid ${C.gold}30`, color: C.gold, fontSize: 18, cursor: "pointer" }}>★</button>
        </div>
      </div>
    </div>
  );
}

// ── MATCH SCREEN ──────────────────────────────────────────────────────────────
function MatchScreen({ onNext }) {
  const [scale, setScale] = useState(1);
  useEffect(() => { const t = setInterval(() => setScale(s => s === 1 ? 1.1 : 1), 1100); return () => clearInterval(t); }, []);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: `radial-gradient(ellipse at 50% 20%, #2a0840, ${C.bg})` }}>
      <div style={{ background: C.magenta, padding: "10px 0", textAlign: "center", borderBottom: `1px solid ${C.gold}30`, flexShrink: 0 }}>
        <span style={{ fontFamily: sans, fontSize: 8, letterSpacing: 5, color: C.gold, fontWeight: 700 }}>HET IS WEDERZIJDS</span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px" }}>
        <div style={{ fontSize: 68, marginBottom: 24, color: C.magenta, transform: `scale(${scale})`, transition: "transform 0.5s ease", filter: `drop-shadow(0 0 20px ${C.magenta}60)` }}>♥</div>

        <div style={{ width: "100%", padding: "20px", border: `1px solid ${C.gold}30`, background: C.card, textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: C.gold, marginBottom: 10, fontWeight: 700 }}>JULLIE HEBBEN EEN KLIK</div>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 900, color: C.cream, margin: "0 0 6px" }}>Jij & Sarah</h2>
          <p style={{ fontFamily: sans, fontSize: 12, color: C.dim, margin: 0 }}>Beiden tonen interesse</p>
        </div>

        {[
          { n: "I",   label: "Anoniem bellen", sub: "10 min · Nu beschikbaar", active: true,  color: C.gold    },
          { n: "II",  label: "Videobel",        sub: "Na 3 gesprekken",         active: false, color: "#7b5ea7" },
          { n: "III", label: "Afspreken",        sub: "Na videogesprek",         active: false, color: C.green   },
        ].map(s => (
          <div key={s.n} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "10px 16px", marginBottom: 6, borderLeft: `2px solid ${s.active ? s.color : s.color + "30"}`, background: s.active ? `${s.color}10` : "transparent", opacity: s.active ? 1 : 0.4 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", border: `1px solid ${s.active ? s.color : s.color + "40"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 9, fontWeight: 900, color: s.active ? s.color : C.dim, flexShrink: 0 }}>{s.n}</div>
            <div>
              <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: s.active ? C.cream : C.dim }}>{s.label}</div>
              <div style={{ fontFamily: sans, fontSize: 10, color: s.active ? s.color : C.muted }}>{s.sub}</div>
            </div>
            {s.active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: C.green }} />}
          </div>
        ))}

        <button onClick={onNext} style={{ width: "100%", marginTop: 20, padding: "14px", background: C.magenta, border: "none", color: C.cream, fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", boxShadow: `0 4px 24px ${C.magenta}40` }}>
          ☎ &nbsp; Bel Sarah nu
        </button>
      </div>
    </div>
  );
}

// ── CALL SCREEN ───────────────────────────────────────────────────────────────
function CallScreen({ onNext }) {
  const [secs, setSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [bars, setBars] = useState(Array(18).fill(4));
  useEffect(() => {
    const t = setInterval(() => { setSecs(s => s + 1); setBars(b => b.map(() => Math.floor(Math.random() * 10) + 2)); }, 1000);
    return () => clearInterval(t);
  }, []);
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <div style={{ background: C.green, padding: "8px 24px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.white }} />
        <span style={{ fontFamily: sans, fontSize: 9, letterSpacing: 3, color: "#0a1a0a", fontWeight: 700 }}>ANONIEM GESPREK ACTIEF</span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around", padding: "28px 24px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 88, height: 88, borderRadius: "50%", background: `radial-gradient(circle, #2a0840, ${C.bg})`, border: `1px solid ${C.magenta}40`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 32, color: C.magenta, margin: "0 auto 14px", boxShadow: `0 0 28px ${C.magenta}25` }}>?</div>
          <h2 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: C.cream, margin: "0 0 4px" }}>Sarah, 42</h2>
          <p style={{ fontFamily: sans, fontSize: 11, color: C.dim, margin: 0 }}>Nummers verborgen voor beiden</p>
        </div>

        <div style={{ padding: "14px 28px", border: `1px solid ${C.gold}30`, textAlign: "center", background: C.card }}>
          <div style={{ fontFamily: sans, fontSize: 34, fontWeight: 700, color: C.gold, letterSpacing: 4 }}>{fmt(secs)}</div>
          <div style={{ fontFamily: sans, fontSize: 9, color: C.dim, letterSpacing: 2, marginTop: 4 }}>{Math.max(0, 600 - secs)}S RESTEREND</div>
        </div>

        <div style={{ display: "flex", gap: 3, alignItems: "center", height: 28 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ width: 3, borderRadius: 2, height: h * 2, background: i % 2 === 0 ? C.magenta : C.gold, opacity: 0.6, transition: "height 0.2s ease" }} />
          ))}
        </div>

        <div style={{ width: "100%", padding: "14px", border: `1px solid ${C.gold}20`, background: C.card }}>
          <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: C.gold, marginBottom: 8, fontWeight: 700 }}>GESPREKSSTARTER</div>
          <p style={{ fontFamily: sans, fontSize: 12, fontStyle: "italic", color: C.dim, margin: 0, lineHeight: 1.6 }}>
            "Wat is het mooiste moment dat je ooit hebt meegemaakt op reis?"
          </p>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <button onClick={() => setMuted(m => !m)} style={{ width: 50, height: 50, borderRadius: "50%", background: muted ? `${C.magenta}20` : `${C.white}06`, border: `1px solid ${muted ? C.magenta : C.white + "15"}`, color: muted ? C.magenta : C.dim, fontSize: 16, cursor: "pointer" }}>{muted ? "✕" : "♪"}</button>
          <button onClick={onNext} style={{ width: 62, height: 62, borderRadius: "50%", background: "#c0392b", border: `1px solid ${C.gold}40`, color: C.white, fontSize: 20, cursor: "pointer", boxShadow: "0 4px 20px rgba(192,57,43,0.4)" }}>✕</button>
          <button style={{ width: 50, height: 50, borderRadius: "50%", background: `${C.white}06`, border: `1px solid ${C.white}15`, color: C.dim, fontSize: 16, cursor: "pointer" }}>◎</button>
        </div>
      </div>
    </div>
  );
}

// ── AFTER CALL ────────────────────────────────────────────────────────────────
function AfterCallScreen({ onNext }) {
  const [stars, setStars] = useState(4);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg }}>
      <div style={{ background: C.card, padding: "12px 24px", borderBottom: `1px solid ${C.gold}20`, flexShrink: 0 }}>
        <div style={{ fontFamily: sans, fontSize: 8, letterSpacing: 4, color: C.gold, fontWeight: 700 }}>GESPREK AFGEROND</div>
        <div style={{ fontFamily: serif, fontSize: 16, color: C.cream, fontWeight: 700, marginTop: 2 }}>Jouw beoordeling</div>
      </div>

      <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <h2 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: C.cream, margin: "0 0 6px" }}>Hoe was het met Sarah?</h2>
        <p style={{ fontFamily: sans, fontSize: 12, color: C.dim, margin: "0 0 24px", lineHeight: 1.6 }}>
          Jouw eerlijke terugkoppeling helpt ons betere matches te maken.
        </p>

        <Rule />

        <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "20px 0 28px" }}>
          {[1, 2, 3, 4, 5].map(i => (
            <span key={i} onClick={() => setStars(i)} style={{ fontSize: 32, cursor: "pointer", color: i <= stars ? C.gold : C.muted, transition: "all 0.2s ease", display: "inline-block", transform: i <= stars ? "scale(1.08)" : "scale(1)" }}>★</span>
          ))}
        </div>

        <div style={{ padding: "16px", border: `1px solid ${C.gold}20`, background: C.card, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontFamily: sans, fontSize: 9, letterSpacing: 2, color: C.dim, fontWeight: 700 }}>VOORTGANG NAAR VIDEO</span>
            <span style={{ fontFamily: serif, fontSize: 13, fontWeight: 700, color: C.gold }}>1 / 3</span>
          </div>
          <div style={{ height: 3, background: C.muted, marginBottom: 10 }}>
            <div style={{ width: "33%", height: "100%", background: `linear-gradient(90deg, ${C.gold}, ${C.magenta})` }} />
          </div>
          <p style={{ fontFamily: sans, fontSize: 9, color: C.dim, margin: 0, letterSpacing: 1 }}>
            NOG 2 GESPREKKEN VOORDAT VIDEO BESCHIKBAAR WORDT
          </p>
        </div>

        <div style={{ flex: 1 }} />
        <Rule color={C.magenta} />

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={onNext} style={{ flex: 1, padding: "13px", background: "transparent", border: `1px solid ${C.white}10`, color: C.dim, fontFamily: sans, fontSize: 11, letterSpacing: 1, cursor: "pointer" }}>← Terug</button>
          <button onClick={onNext} style={{ flex: 2, padding: "13px", background: C.magenta, border: "none", color: C.cream, fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>Opslaan ★</button>
        </div>
      </div>
    </div>
  );
}

// ── APP SHELL ─────────────────────────────────────────────────────────────────
const SCREENS = [
  { id: "wachtlijst", label: "Home",    C: WaitlistScreen  },
  { id: "profiel",    label: "Profiel", C: ProfileScreen   },
  { id: "ontdek",     label: "Ontdek",  C: DiscoverScreen  },
  { id: "match",      label: "Match",   C: MatchScreen     },
  { id: "bellen",     label: "Bellen",  C: CallScreen      },
  { id: "review",     label: "Review",  C: AfterCallScreen },
];

export default function App() {
  const [idx, setIdx] = useState(0);
  const { C: Screen } = SCREENS[idx];
  const next = () => setIdx(i => Math.min(i + 1, SCREENS.length - 1));

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: `radial-gradient(ellipse at 30% 10%, ${C.magenta}18, transparent 45%), radial-gradient(ellipse at 70% 90%, #2a0840 0%, transparent 50%), #040210`,
      padding: "20px 0",
    }}>
      {/* Nav tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap", justifyContent: "center" }}>
        {SCREENS.map((s, i) => (
          <button key={s.id} onClick={() => setIdx(i)} style={{
            padding: "5px 12px",
            background: i === idx ? C.magenta : "transparent",
            border: `1px solid ${i === idx ? C.gold + "60" : C.white + "10"}`,
            color: i === idx ? C.gold : C.dim,
            fontFamily: sans, fontSize: 9, fontWeight: 700,
            letterSpacing: 2, textTransform: "uppercase",
            cursor: "pointer",
          }}>{s.label}</button>
        ))}
      </div>

      {/* Phone */}
      <div style={{
        width: 375, height: 750,
        borderRadius: 38,
        border: `1px solid ${C.gold}20`,
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        background: C.bg,
        boxShadow: `0 0 60px ${C.magenta}18, 0 0 0 1px ${C.gold}08, 0 32px 64px rgba(0,0,0,0.7)`,
      }}>
        {/* Status bar */}
        <div style={{ padding: "10px 24px 6px", display: "flex", justifyContent: "space-between", fontFamily: sans, fontSize: 10, color: C.dim, flexShrink: 0 }}>
          <span>9:41</span>
          <span style={{ color: C.gold, letterSpacing: 2, fontWeight: 700 }}>♥ LHC</span>
          <span>●●●</span>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Screen onNext={next} />
        </div>
      </div>

      <p style={{ marginTop: 12, fontFamily: sans, fontSize: 9, color: C.dim, letterSpacing: 2 }}>
        LONELYHEARTSCLUB.NL · KLIK OP DE TABS
      </p>
    </div>
  );
}
