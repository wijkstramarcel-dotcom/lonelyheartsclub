import { useState, useEffect } from "react";

// Google Fonts
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Lora:ital@0;1&family=DM+Sans:wght@400;500;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const T = {
  bg:       "#0f0820",
  bgCard:   "#1a1030",
  magenta:  "#e8126a",
  gold:     "#d4a843",
  cream:    "#f5ede0",
  creamDim: "#a89070",
  cyan:     "#00b8c4",
  green:    "#2ecc71",
  white:    "#ffffff",
  muted:    "#4a3a5a",
};

const F = {
  display: "'Playfair Display', Georgia, serif",
  body:    "'Lora', Georgia, serif",
  ui:      "'DM Sans', sans-serif",
};

const OrnamentDivider = ({ color = T.gold }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0" }}>
    <div style={{ flex: 1, height: 1, background: `${color}40` }} />
    <span style={{ color, fontSize: 10, letterSpacing: 3 }}>✦ ✦ ✦</span>
    <div style={{ flex: 1, height: 1, background: `${color}40` }} />
  </div>
);

const OrnateBox = ({ children, color = T.gold, style = {} }) => (
  <div style={{ border: `1px solid ${color}50`, position: "relative", ...style }}>
    {[[{top:-4,left:-4}],[{top:-4,right:-4}],[{bottom:-4,left:-4}],[{bottom:-4,right:-4}]].map((pos, i) => (
      <div key={i} style={{
        position: "absolute", width: 7, height: 7,
        border: `1px solid ${color}`, background: T.bg,
        transform: "rotate(45deg)", ...pos[0],
      }} />
    ))}
    {children}
  </div>
);

const PrimaryBtn = ({ onClick, children, color = T.magenta }) => (
  <button onClick={onClick} style={{
    width: "100%", padding: "15px 20px",
    background: color, border: `1px solid ${T.gold}60`,
    borderRadius: 2, color: T.gold,
    fontSize: 11, fontWeight: 700, fontFamily: F.ui,
    letterSpacing: 3, textTransform: "uppercase",
    cursor: "pointer", boxShadow: `0 4px 24px ${color}40`,
  }}
    onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
    onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
  >{children}</button>
);

const TopBanner = ({ label, title, color = T.magenta }) => (
  <div style={{
    background: `linear-gradient(135deg, ${color}ee, ${color}bb)`,
    padding: "10px 24px", borderBottom: `1px solid ${T.gold}40`,
    display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0,
  }}>
    <div>
      <div style={{ fontFamily: F.ui, fontSize: 8, letterSpacing: 4, color: T.gold, fontWeight: 700, marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: F.display, fontSize: 15, color: T.white, fontWeight: 700 }}>{title}</div>
    </div>
    <div style={{ fontFamily: F.display, fontSize: 18, color: `${T.gold}80` }}>♥</div>
  </div>
);

function SplashScreen({ onNext }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: `radial-gradient(ellipse at 50% 0%, #2a0840 0%, ${T.bg} 60%)`, overflow: "hidden" }}>
      <div style={{ background: T.magenta, padding: "8px 0", textAlign: "center", borderBottom: `1px solid ${T.gold}60`, flexShrink: 0 }}>
        <div style={{ fontFamily: F.ui, fontSize: 8, letterSpacing: 5, color: T.gold, fontWeight: 700 }}>★ &nbsp; LONELYHEARTSCLUB.NL &nbsp; ★</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", opacity: vis ? 1 : 0, transition: "opacity 0.8s ease" }}>
        <OrnateBox color={T.gold} style={{ width: "100%", padding: "28px 20px", background: `radial-gradient(ellipse at 50% 30%, #2a0f4a, ${T.bg})`, textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: F.ui, fontSize: 8, letterSpacing: 5, color: T.cyan, marginBottom: 10, fontWeight: 700 }}>SGT. PEPPER'S</div>
          <h1 style={{ fontFamily: F.display, fontSize: 32, fontWeight: 900, color: T.cream, margin: "0 0 4px", lineHeight: 1.1, textShadow: `2px 3px 0 ${T.magenta}80` }}>LONELY HEARTS</h1>
          <h1 style={{ fontFamily: F.display, fontSize: 32, fontWeight: 900, color: T.gold, margin: "0 0 16px", lineHeight: 1.1 }}>CLUB</h1>
          <OrnamentDivider color={T.gold} />
          <p style={{ fontFamily: F.body, fontSize: 13, fontStyle: "italic", color: T.creamDim, margin: 0, lineHeight: 1.7 }}>"De mooiste liefde begint<br />met een stem"</p>
        </OrnateBox>
        <div style={{ width: "100%", marginBottom: 28 }}>
          {[
            { n: "I",   icon: "✦", text: "Profiel zonder foto",  color: T.cyan    },
            { n: "II",  icon: "☎", text: "Anoniem bellen",       color: T.gold    },
            { n: "III", icon: "◉", text: "Videogesprek",         color: T.magenta },
            { n: "IV",  icon: "♥", text: "Echte afspraak",       color: T.green   },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", marginBottom: 6, borderLeft: `3px solid ${s.color}`, background: `${s.color}08`, opacity: vis ? 1 : 0, transition: `opacity 0.5s ease ${0.2 + i * 0.1}s` }}>
              <span style={{ fontFamily: F.display, fontWeight: 900, color: s.color, fontSize: 10, width: 22, flexShrink: 0 }}>{s.n}</span>
              <span style={{ fontSize: 14, color: s.color, width: 16 }}>{s.icon}</span>
              <span style={{ fontFamily: F.body, fontSize: 13, color: T.cream }}>{s.text}</span>
            </div>
          ))}
        </div>
        <PrimaryBtn onClick={onNext}>★ &nbsp; Word lid &nbsp; ★</PrimaryBtn>
      </div>
      <div style={{ background: "#0a0518", padding: "8px 0", borderTop: `1px solid ${T.gold}20`, textAlign: "center", flexShrink: 0 }}>
        <div style={{ fontFamily: F.ui, fontSize: 8, letterSpacing: 3, color: T.muted, fontWeight: 500 }}>EST. 2026 · NEDERLAND · GRATIS</div>
      </div>
    </div>
  );
}

function ProfileScreen({ onNext }) {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Naam",     q: "Wat is je voornaam?",         val: "Marcel",                                        type: "input" },
    { label: "Leeftijd", q: "Hoe oud ben je?",             val: "48",                                            type: "input" },
    { label: "Verhaal",  q: "Omschrijf jezelf in één zin", val: "Avontuurlijk, eerlijk, op zoek naar verbinding.", type: "area"  },
    { label: "Passies",  q: "Wat zijn je passies?",        val: "Hardlopen, schilderen, reizen.",                 type: "area"  },
  ];
  const colors = [T.cyan, T.gold, T.magenta, T.green];
  const s = steps[step]; const c = colors[step];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg }}>
      <TopBanner label="Jouw profiel" title="Vertel je verhaal" color="#1a0828" />
      <div style={{ display: "flex", padding: "14px 24px 0", gap: 6 }}>
        {steps.map((_, i) => (
          <div key={i} style={{ flex: i === step ? 3 : 1, height: 3, borderRadius: 2, background: i < step ? T.gold : i === step ? c : `${T.white}15`, transition: "all 0.3s ease" }} />
        ))}
      </div>
      <div style={{ flex: 1, padding: "16px 24px", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "10px 14px", marginBottom: 16, border: `1px dashed ${T.gold}40`, display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontFamily: F.display, fontSize: 16, color: T.gold }}>♦</span>
          <span style={{ fontFamily: F.body, fontSize: 12, fontStyle: "italic", color: T.creamDim }}>Geen foto. Jij bent meer dan een plaatje.</span>
        </div>
        <OrnateBox color={c} style={{ padding: "18px", marginBottom: 14 }}>
          <div style={{ fontFamily: F.ui, fontSize: 8, letterSpacing: 4, color: c, marginBottom: 8, fontWeight: 700 }}>{s.label.toUpperCase()}</div>
          <h3 style={{ fontFamily: F.display, fontSize: 17, color: T.cream, margin: "0 0 14px", fontWeight: 700 }}>{s.q}</h3>
          {s.type === "input" ? (
            <input defaultValue={s.val} style={{ width: "100%", background: `${c}10`, border: `1px solid ${c}40`, borderRadius: 2, color: T.cream, fontSize: 20, padding: "10px 12px", fontFamily: F.display, outline: "none", boxSizing: "border-box" }} />
          ) : (
            <textarea defaultValue={s.val} rows={3} style={{ width: "100%", background: `${c}10`, border: `1px solid ${c}40`, borderRadius: 2, color: T.cream, fontSize: 13, padding: "10px 12px", fontFamily: F.body, outline: "none", resize: "none", boxSizing: "border-box", lineHeight: 1.7 }} />
          )}
        </OrnateBox>
        {step === 3 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {[["Hardlopen", true], ["Kunst", true], ["Reizen", true], ["Lezen", false], ["Wijn", false], ["Muziek", false]].map(([tag, active], i) => (
              <span key={i} style={{ padding: "5px 12px", borderRadius: 2, border: `1px solid ${active ? T.gold : T.muted}`, background: active ? `${T.gold}15` : "transparent", color: active ? T.gold : T.muted, fontFamily: F.ui, fontSize: 11, cursor: "pointer" }}>{tag}</span>
            ))}
          </div>
        )}
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 8 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: "13px", background: "transparent", border: `1px solid ${T.white}15`, borderRadius: 2, color: T.muted, fontFamily: F.ui, fontSize: 11, letterSpacing: 2, cursor: "pointer" }}>← Terug</button>
          )}
          <div style={{ flex: step > 0 ? 3 : 1 }}>
            <PrimaryBtn onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onNext()} color={c}>
              {step < steps.length - 1 ? "Verder →" : "Opslaan ✓"}
            </PrimaryBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscoverScreen({ onNext }) {
  const [idx, setIdx] = useState(0);
  const profiles = [
    { name: "Sarah", age: 42, tagline: "Dromer met beide voeten op de grond", bio: "Op zoek naar echte gesprekken. Ik hou van natuur, stille ochtenden en eerlijke mensen.", tags: ["Natuur", "Lezen", "Koken"], match: 94 },
    { name: "Linda", age: 45, tagline: "Nieuwsgierig naar het leven en naar jou", bio: "Moeder, reiziger, yogalerares. De mooiste liefde begint bij een goed gesprek.", tags: ["Yoga", "Reizen", "Theater"], match: 87 },
    { name: "Anke",  age: 39, tagline: "Avontuurlijk maar ook gewoon thuis", bio: "Werk in de zorg, hou van muziek. Zoek iemand die net zo goed kan luisteren als praten.", tags: ["Muziek", "Wijn", "Honden"], match: 81 },
  ];
  const p = profiles[idx];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg }}>
      <TopBanner label="Nieuwe leden" title="Ontdek matches" />
      <div style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column" }}>
        <OrnateBox color={T.gold} style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", background: T.bgCard, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: `radial-gradient(circle, #2a0840, ${T.bg})`, border: `2px solid ${T.gold}60`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontSize: 22, color: T.gold }}>?</div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: F.display, fontSize: 24, fontWeight: 900, color: T.gold }}>{p.match}%</div>
              <div style={{ fontFamily: F.ui, fontSize: 8, letterSpacing: 3, color: T.muted, fontWeight: 700 }}>MATCH</div>
            </div>
          </div>
          <h3 style={{ fontFamily: F.display, fontSize: 22, fontWeight: 700, color: T.cream, margin: "0 0 4px" }}>{p.name}, {p.age}</h3>
          <p style={{ fontFamily: F.body, fontSize: 12, fontStyle: "italic", color: T.gold, margin: "0 0 14px" }}>{p.tagline}</p>
          <OrnamentDivider />
          <p style={{ fontFamily: F.body, fontSize: 13, color: T.creamDim, lineHeight: 1.7, flex: 1 }}>{p.bio}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
            {p.tags.map((tag, i) => (
              <span key={i} style={{ padding: "4px 10px", border: `1px solid ${T.gold}30`, fontFamily: F.ui, fontSize: 10, color: T.creamDim, letterSpacing: 1 }}>{tag}</span>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: "8px 12px", border: `1px dashed ${T.gold}25`, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ color: T.gold, fontSize: 11 }}>♦</span>
            <span style={{ fontFamily: F.ui, fontSize: 10, color: T.muted, letterSpacing: 1 }}>FOTO ZICHTBAAR NA EERSTE GESPREK</span>
          </div>
        </OrnateBox>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setIdx(i => Math.min(i + 1, profiles.length - 1))} style={{ flex: 1, padding: "13px", background: "transparent", border: `1px solid ${T.white}15`, borderRadius: 2, color: T.muted, fontSize: 18, cursor: "pointer" }}>✕</button>
          <div style={{ flex: 3 }}><PrimaryBtn onClick={onNext}>♥ &nbsp; Interesse</PrimaryBtn></div>
          <button style={{ flex: 1, padding: "13px", background: `${T.gold}10`, border: `1px solid ${T.gold}40`, borderRadius: 2, color: T.gold, fontSize: 18, cursor: "pointer" }}>★</button>
        </div>
      </div>
    </div>
  );
}

function MatchScreen({ onNext }) {
  const [scale, setScale] = useState(1);
  useEffect(() => { const t = setInterval(() => setScale(s => s === 1 ? 1.12 : 1), 1000); return () => clearInterval(t); }, []);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: `radial-gradient(ellipse at 50% 30%, #2a0840, ${T.bg})` }}>
      <div style={{ background: T.magenta, padding: "10px 0", borderBottom: `1px solid ${T.gold}40`, textAlign: "center", flexShrink: 0 }}>
        <div style={{ fontFamily: F.ui, fontSize: 8, letterSpacing: 5, color: T.gold, fontWeight: 700 }}>★ &nbsp; HET IS WEDERZIJDS &nbsp; ★</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ fontSize: 72, marginBottom: 20, color: T.magenta, transform: `scale(${scale})`, transition: "transform 0.5s ease", filter: `drop-shadow(0 0 24px ${T.magenta}80)` }}>♥</div>
        <OrnateBox color={T.gold} style={{ width: "100%", padding: "20px", textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: F.ui, fontSize: 8, letterSpacing: 4, color: T.gold, marginBottom: 8, fontWeight: 700 }}>JULLIE HEBBEN EEN KLIK</div>
          <h2 style={{ fontFamily: F.display, fontSize: 26, fontWeight: 900, color: T.cream, margin: "0 0 6px" }}>Jij & Sarah</h2>
          <p style={{ fontFamily: F.body, fontSize: 13, fontStyle: "italic", color: T.creamDim, margin: 0 }}>Beiden tonen interesse</p>
        </OrnateBox>
        {[
          { n: "I",   label: "Anoniem bellen", sub: "10 min · Nu beschikbaar", active: true,  color: T.cyan  },
          { n: "II",  label: "Videobel",        sub: "Na 3 gesprekken",         active: false, color: T.gold  },
          { n: "III", label: "Afspreken",        sub: "Na videogesprek",         active: false, color: T.green },
        ].map(s => (
          <div key={s.n} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "10px 16px", marginBottom: 8, borderLeft: `3px solid ${s.active ? s.color : s.color + "30"}`, background: s.active ? `${s.color}10` : "transparent", opacity: s.active ? 1 : 0.4 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${s.active ? s.color : s.color + "40"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontSize: 10, fontWeight: 900, color: s.active ? s.color : s.color + "40", flexShrink: 0 }}>{s.n}</div>
            <div>
              <div style={{ fontFamily: F.display, fontSize: 13, fontWeight: 700, color: s.active ? T.cream : T.muted }}>{s.label}</div>
              <div style={{ fontFamily: F.ui, fontSize: 9, color: s.active ? s.color : T.muted, letterSpacing: 1 }}>{s.sub}</div>
            </div>
            {s.active && <div style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: T.green }} />}
          </div>
        ))}
        <div style={{ width: "100%", marginTop: 16 }}><PrimaryBtn onClick={onNext}>☎ &nbsp; Bel Sarah nu</PrimaryBtn></div>
      </div>
    </div>
  );
}

function CallScreen({ onNext }) {
  const [secs, setSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [bars, setBars] = useState(Array(16).fill(4));
  useEffect(() => {
    const t = setInterval(() => { setSecs(s => s + 1); setBars(b => b.map(() => Math.floor(Math.random() * 12) + 2)); }, 1000);
    return () => clearInterval(t);
  }, []);
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg }}>
      <div style={{ background: T.green, padding: "8px 24px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.white }} />
        <span style={{ fontFamily: F.ui, fontSize: 9, letterSpacing: 3, color: "#0a0518", fontWeight: 700 }}>ANONIEM GESPREK ACTIEF</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around", padding: "24px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: `radial-gradient(circle, #2a0840, ${T.bg})`, border: `2px solid ${T.magenta}60`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontSize: 36, color: T.magenta, margin: "0 auto 14px", boxShadow: `0 0 32px ${T.magenta}30` }}>?</div>
          <h2 style={{ fontFamily: F.display, fontSize: 20, fontWeight: 700, color: T.cream, margin: "0 0 4px" }}>Sarah, 42</h2>
          <p style={{ fontFamily: F.body, fontSize: 11, fontStyle: "italic", color: T.muted, margin: 0 }}>Nummers verborgen voor beiden</p>
        </div>
        <OrnateBox color={T.gold} style={{ padding: "14px 28px", textAlign: "center" }}>
          <div style={{ fontFamily: F.ui, fontSize: 36, fontWeight: 700, color: T.gold, letterSpacing: 4, textShadow: `0 0 20px ${T.gold}50` }}>{fmt(secs)}</div>
          <div style={{ fontFamily: F.ui, fontSize: 9, color: T.muted, letterSpacing: 2, marginTop: 4 }}>{Math.max(0, 600 - secs)}S RESTEREND</div>
        </OrnateBox>
        <div style={{ display: "flex", gap: 3, alignItems: "center", height: 32 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ width: 3, borderRadius: 2, height: h * 2.2, background: i % 2 === 0 ? T.magenta : T.gold, opacity: 0.7, transition: "height 0.25s ease" }} />
          ))}
        </div>
        <OrnateBox color={`${T.cyan}60`} style={{ width: "100%", padding: "14px" }}>
          <div style={{ fontFamily: F.ui, fontSize: 8, letterSpacing: 4, color: T.cyan, marginBottom: 8, fontWeight: 700 }}>GESPREKSSTARTER</div>
          <p style={{ fontFamily: F.body, fontSize: 12, fontStyle: "italic", color: T.creamDim, margin: 0, lineHeight: 1.6 }}>"Wat is het mooiste moment dat je ooit hebt meegemaakt op reis?"</p>
        </OrnateBox>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <button onClick={() => setMuted(m => !m)} style={{ width: 52, height: 52, borderRadius: "50%", background: muted ? `${T.magenta}20` : `${T.white}08`, border: `1px solid ${muted ? T.magenta : T.white + "20"}`, color: muted ? T.magenta : T.creamDim, fontSize: 18, cursor: "pointer" }}>{muted ? "✕" : "♪"}</button>
          <button onClick={onNext} style={{ width: 64, height: 64, borderRadius: "50%", background: "#c0392b", border: `2px solid ${T.gold}60`, color: T.white, fontSize: 20, cursor: "pointer", boxShadow: "0 4px 20px rgba(192,57,43,0.5)" }}>✕</button>
          <button style={{ width: 52, height: 52, borderRadius: "50%", background: `${T.white}08`, border: `1px solid ${T.white}20`, color: T.creamDim, fontSize: 18, cursor: "pointer" }}>◎</button>
        </div>
      </div>
    </div>
  );
}

function AfterCallScreen({ onNext }) {
  const [stars, setStars] = useState(4);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg }}>
      <TopBanner label="Gesprek afgerond" title="Jouw beoordeling" color="#1a0828" />
      <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column" }}>
        <h2 style={{ fontFamily: F.display, fontSize: 22, fontWeight: 700, color: T.cream, margin: "0 0 6px" }}>Hoe was het met Sarah?</h2>
        <p style={{ fontFamily: F.body, fontSize: 13, fontStyle: "italic", color: T.creamDim, margin: "0 0 20px", lineHeight: 1.6 }}>Jouw eerlijke terugkoppeling helpt ons betere matches te maken.</p>
        <OrnamentDivider />
        <div style={{ display: "flex", gap: 12, justifyContent: "center", margin: "20px 0 28px" }}>
          {[1, 2, 3, 4, 5].map(i => (
            <span key={i} onClick={() => setStars(i)} style={{ fontSize: 34, cursor: "pointer", color: i <= stars ? T.gold : T.muted, transition: "all 0.2s ease", filter: i <= stars ? `drop-shadow(0 0 8px ${T.gold}80)` : "none", display: "inline-block", transform: i <= stars ? "scale(1.1)" : "scale(1)" }}>★</span>
          ))}
        </div>
        <OrnateBox color={T.cyan} style={{ padding: "16px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontFamily: F.ui, fontSize: 9, letterSpacing: 2, color: T.creamDim, fontWeight: 700 }}>NAAR VIDEOGESPREK</span>
            <span style={{ fontFamily: F.display, fontSize: 13, fontWeight: 700, color: T.cyan }}>1 / 3</span>
          </div>
          <div style={{ height: 4, background: `${T.white}10`, borderRadius: 2, marginBottom: 10 }}>
            <div style={{ width: "33%", height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${T.cyan}, ${T.gold})` }} />
          </div>
          <p style={{ fontFamily: F.ui, fontSize: 9, color: T.muted, margin: 0, letterSpacing: 1 }}>NOG 2 GESPREKKEN VOORDAT VIDEO BESCHIKBAAR WORDT</p>
        </OrnateBox>
        <div style={{ flex: 1 }} />
        <OrnamentDivider color={T.magenta} />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={onNext} style={{ flex: 1, padding: "13px", background: "transparent", border: `1px solid ${T.white}15`, borderRadius: 2, color: T.muted, fontFamily: F.ui, fontSize: 11, letterSpacing: 2, cursor: "pointer" }}>← Terug</button>
          <div style={{ flex: 2 }}><PrimaryBtn onClick={onNext}>Opslaan ★</PrimaryBtn></div>
        </div>
      </div>
    </div>
  );
}

const SCREENS = [
  { id: "start",   label: "Start",   C: SplashScreen    },
  { id: "profiel", label: "Profiel", C: ProfileScreen   },
  { id: "ontdek",  label: "Ontdek",  C: DiscoverScreen  },
  { id: "match",   label: "Match",   C: MatchScreen     },
  { id: "bellen",  label: "Bellen",  C: CallScreen      },
  { id: "review",  label: "Review",  C: AfterCallScreen },
];

export default function App() {
  const [idx, setIdx] = useState(0);
  const { C: Screen } = SCREENS[idx];
  const next = () => setIdx(i => Math.min(i + 1, SCREENS.length - 1));
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `radial-gradient(ellipse at 30% 20%, ${T.magenta}15, transparent 50%), radial-gradient(ellipse at 70% 80%, #2a0840 0%, transparent 50%), #070512`, padding: "20px 0" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap", justifyContent: "center" }}>
        {SCREENS.map((s, i) => (
          <button key={s.id} onClick={() => setIdx(i)} style={{ padding: "5px 12px", borderRadius: 2, background: i === idx ? T.magenta : "transparent", border: `1px solid ${i === idx ? T.gold + "80" : T.white + "15"}`, color: i === idx ? T.gold : T.muted, fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>{s.label}</button>
        ))}
      </div>
      <div style={{ width: 375, height: 750, borderRadius: 40, border: `1px solid ${T.gold}30`, overflow: "hidden", display: "flex", flexDirection: "column", background: T.bg, boxShadow: `0 0 80px ${T.magenta}20, 0 0 0 1px ${T.gold}10, 0 40px 80px rgba(0,0,0,0.6)` }}>
        <div style={{ padding: "10px 24px 6px", display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: T.muted, flexShrink: 0 }}>
          <span>9:41</span>
          <span style={{ color: T.gold, letterSpacing: 2, fontWeight: 700 }}>♥ LHC</span>
          <span>●●●</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Screen onNext={next} />
        </div>
      </div>
      <p style={{ marginTop: 14, fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: T.muted, letterSpacing: 2 }}>LONELYHEARTSCLUB.NL · KLIK OP DE TABS</p>
    </div>
  );
}
