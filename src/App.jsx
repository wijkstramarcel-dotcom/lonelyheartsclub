import { useState, useEffect } from "react";

// ─── SGT. PEPPER PALETTE ────────────────────────────────────────────────────
const C = {
  hotPink:   "#e8126a",
  magenta:   "#c0116a",
  cyan:      "#00c8d4",
  yellow:    "#ffd700",
  purple:    "#7b2d8b",
  green:     "#00a651",
  orange:    "#ff6b00",
  cream:     "#fff8e7",
  darkBg:    "#1a0828",
  white:     "#ffffff",
  floral:    "#f5e6d0",
};

// ─── HELPERS ────────────────────────────────────────────────────────────────
const Badge = ({ color, text, small }) => (
  <span style={{
    display: "inline-block",
    padding: small ? "3px 8px" : "5px 12px",
    border: `2px solid ${color}`,
    borderRadius: 4,
    color, fontSize: small ? 9 : 11,
    fontFamily: "'Georgia', serif",
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    background: `${color}18`,
  }}>{text}</span>
);

const Divider = ({ color = C.yellow }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 0" }}>
    <div style={{ flex: 1, height: 1, background: color, opacity: 0.4 }} />
    <span style={{ color, fontSize: 14, opacity: 0.8 }}>✦</span>
    <div style={{ flex: 1, height: 1, background: color, opacity: 0.4 }} />
  </div>
);

// Ornate decorative border
const Border = ({ color, children, style = {} }) => (
  <div style={{
    border: `3px solid ${color}`,
    borderRadius: 2,
    boxShadow: `inset 0 0 0 1px ${color}40, 0 0 0 1px ${color}40`,
    position: "relative",
    ...style,
  }}>
    {["top-left","top-right","bottom-left","bottom-right"].map(pos => (
      <div key={pos} style={{
        position: "absolute",
        width: 12, height: 12,
        border: `2px solid ${color}`,
        ...(pos.includes("top") ? { top: -6 } : { bottom: -6 }),
        ...(pos.includes("left") ? { left: -6 } : { right: -6 }),
        background: C.darkBg,
        transform: "rotate(45deg)",
      }} />
    ))}
    {children}
  </div>
);

// Flower cluster decoration
const Flowers = ({ top, left, size = 20, color }) => (
  <div style={{ position: "absolute", top, left, fontSize: size, opacity: 0.35, pointerEvents: "none", color }}>
    🌸
  </div>
);

// ─── SCREENS ────────────────────────────────────────────────────────────────

function SplashScreen({ onNext }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 80); }, []);

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      background: `
        radial-gradient(ellipse at 20% 80%, ${C.purple}60 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, ${C.hotPink}50 0%, transparent 50%),
        radial-gradient(ellipse at 50% 50%, #2a0840 0%, ${C.darkBg} 100%)
      `,
      overflow: "hidden",
      position: "relative",
    }}>

      {/* Floating florals */}
      {[[10,8,22,C.yellow],[45,160,16,C.cyan],[290,80,18,C.hotPink],
        [20,280,14,C.green],[310,240,20,C.yellow],[150,340,16,C.purple],
        [60,400,12,C.cyan],[280,380,18,C.orange],[10,480,16,C.hotPink],
        [320,500,14,C.green]].map(([t,l,s,c],i) => (
        <Flowers key={i} top={t} left={l} size={s} color={c} />
      ))}

      {/* Stars scattered */}
      {[[30,150],[80,300],[200,40],[240,320],[160,200],[60,520]].map(([t,l],i) => (
        <div key={i} style={{
          position: "absolute", top: t, left: l,
          color: C.yellow, fontSize: 10, opacity: 0.3, pointerEvents: "none",
        }}>★</div>
      ))}

      {/* Header band banner */}
      <div style={{
        background: `linear-gradient(135deg, ${C.hotPink}, ${C.magenta})`,
        padding: "10px 0", textAlign: "center",
        borderBottom: `3px solid ${C.yellow}`,
      }}>
        <div style={{
          fontSize: 9, letterSpacing: 5, color: C.yellow,
          textTransform: "uppercase", fontFamily: "sans-serif", fontWeight: 700,
        }}>★ PRESENTING ★</div>
      </div>

      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "16px 24px 0",
        opacity: show ? 1 : 0, transition: "opacity 0.7s ease",
      }}>

        {/* Main title — drum head style */}
        <Border color={C.yellow} style={{ width: "100%", padding: "16px 12px", marginBottom: 16 }}>
          <div style={{
            background: `radial-gradient(ellipse, #3a0f5a, ${C.darkBg})`,
            borderRadius: 2, padding: "16px 8px", textAlign: "center",
          }}>
            <div style={{
              fontSize: 9, letterSpacing: 4, color: C.cyan,
              textTransform: "uppercase", marginBottom: 6, fontFamily: "sans-serif",
            }}>SGT. PEPPER'S</div>
            <h1 style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: 22, fontWeight: 900,
              color: C.white, margin: "0 0 2px",
              textShadow: `2px 2px 0 ${C.hotPink}, 4px 4px 0 ${C.purple}`,
              lineHeight: 1.1, textAlign: "center", letterSpacing: 1,
            }}>
              LONELY HEARTS
            </h1>
            <h1 style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: 22, fontWeight: 900,
              color: C.yellow, margin: "0 0 6px",
              textShadow: `2px 2px 0 ${C.orange}`,
              lineHeight: 1.1, textAlign: "center", letterSpacing: 1,
            }}>
              CLUB
            </h1>
            <div style={{
              fontSize: 28, margin: "4px 0",
            }}>♥</div>
            <div style={{
              display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap",
            }}>
              <Badge color={C.cyan} text=".nl" small />
              <Badge color={C.yellow} text="Gratis" small />
              <Badge color={C.green} text="Nl" small />
            </div>
          </div>
        </Border>

        {/* Flower row */}
        <div style={{
          display: "flex", justifyContent: "center",
          gap: 4, fontSize: 18, margin: "2px 0 16px", letterSpacing: 2,
        }}>
          {"🌸🌺🌻🌸🌺🌻🌸".split("").map((f, i) => (
            <span key={i}>{f}</span>
          ))}
        </div>

        {/* Steps in military-ticket style */}
        <div style={{ width: "100%", marginBottom: 16 }}>
          {[
            { n: "I", color: C.cyan, icon: "✦", text: "Profiel zonder foto" },
            { n: "II", color: C.yellow, icon: "☎", text: "Anoniem bellen" },
            { n: "III", color: C.hotPink, icon: "◉", text: "Videogesprek" },
            { n: "IV", color: C.green, icon: "♥", text: "Echte afspraak" },
          ].map((s) => (
            <div key={s.n} style={{
              display: "flex", alignItems: "center", gap: 10,
              marginBottom: 6, padding: "8px 12px",
              background: `${s.color}12`,
              border: `1px solid ${s.color}40`,
              borderLeft: `4px solid ${s.color}`,
              borderRadius: 2,
            }}>
              <span style={{
                fontFamily: "Georgia, serif", fontWeight: 900,
                color: s.color, fontSize: 11, width: 18, flexShrink: 0,
              }}>{s.n}</span>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <span style={{
                fontSize: 13, color: C.cream, fontFamily: "Georgia, serif",
              }}>{s.text}</span>
            </div>
          ))}
        </div>

        <Divider color={C.yellow} />

        <p style={{
          fontSize: 12, color: `${C.cream}99`, textAlign: "center",
          fontStyle: "italic", fontFamily: "Georgia, serif",
          lineHeight: 1.6, marginBottom: 16,
        }}>
          "De mooiste liefde begint met een stem"
        </p>

        <button onClick={onNext} style={{
          width: "100%", padding: "14px",
          background: `linear-gradient(135deg, ${C.hotPink}, ${C.magenta})`,
          border: `2px solid ${C.yellow}`,
          borderRadius: 2, color: C.yellow,
          fontSize: 13, fontWeight: 700, cursor: "pointer",
          fontFamily: "Georgia, serif",
          letterSpacing: 2, textTransform: "uppercase",
          boxShadow: `0 4px 20px ${C.hotPink}60`,
          transition: "transform 0.15s",
        }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          ★ WORD LID ★
        </button>
      </div>

      {/* Bottom ticker */}
      <div style={{
        background: C.purple, padding: "7px 0",
        borderTop: `2px solid ${C.cyan}`,
        textAlign: "center",
        marginTop: 12,
      }}>
        <div style={{
          fontSize: 9, letterSpacing: 3, color: C.cyan,
          fontFamily: "sans-serif", fontWeight: 700,
        }}>
          LONELYHEARTSCLUB.NL · EST. 2026
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ onNext }) {
  const [step, setStep] = useState(0);
  const steps = ["Naam", "Leeftijd", "Verhaal", "Passies"];
  const colors = [C.cyan, C.yellow, C.hotPink, C.green];
  const vals = ["Marcel", "48", "Avontuurlijk, eerlijk, op zoek naar echte verbinding.", "Hardlopen, schilderen, geschiedenis & reizen."];

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      background: `linear-gradient(180deg, #1a0828 0%, #0f0518 100%)`,
      padding: "16px 20px 20px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Decorative corner flowers */}
      <div style={{ position: "absolute", top: 8, right: 8, fontSize: 22, opacity: 0.2 }}>🌺</div>
      <div style={{ position: "absolute", bottom: 60, left: 8, fontSize: 18, opacity: 0.15 }}>🌸</div>

      {/* Band banner header */}
      <div style={{
        background: `linear-gradient(135deg, ${C.purple}, ${C.magenta})`,
        border: `2px solid ${C.yellow}`,
        borderRadius: 2, padding: "8px 12px", marginBottom: 14,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: C.yellow, fontFamily: "sans-serif", fontWeight: 700 }}>JE PROFIEL</div>
          <div style={{ fontSize: 13, color: C.white, fontFamily: "Georgia, serif", fontWeight: 700 }}>Vertel je verhaal</div>
        </div>
        <div style={{
          background: `${C.hotPink}30`,
          border: `1px solid ${C.hotPink}`,
          borderRadius: 20, padding: "3px 10px",
          fontSize: 10, color: C.hotPink, fontFamily: "sans-serif",
        }}>
          {step + 1}/{steps.length}
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, justifyContent: "center" }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            width: i === step ? 28 : 8, height: 8, borderRadius: 4,
            background: i <= step ? colors[i] : `${C.white}20`,
            transition: "all 0.3s ease",
            cursor: "pointer",
          }} onClick={() => setStep(i)} />
        ))}
      </div>

      {/* No photo notice */}
      <div style={{
        background: `${C.yellow}12`,
        border: `2px dashed ${C.yellow}50`,
        borderRadius: 2, padding: "8px 12px",
        marginBottom: 16, display: "flex", gap: 8, alignItems: "center",
      }}>
        <span style={{ fontSize: 16 }}>🎭</span>
        <span style={{ fontSize: 11, color: `${C.yellow}cc`, fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          Geen foto. Jij bent meer dan een plaatje.
        </span>
      </div>

      {/* Question card */}
      <Border color={colors[step]} style={{ marginBottom: 16, padding: "14px" }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: colors[step], marginBottom: 8, fontFamily: "sans-serif", fontWeight: 700 }}>
          {steps[step].toUpperCase()}
        </div>
        <h3 style={{
          fontSize: 16, color: C.white, fontFamily: "Georgia, serif",
          margin: "0 0 14px", fontWeight: 700,
        }}>
          {["Wat is je voornaam?", "Hoe oud ben je?",
            "Omschrijf jezelf in één zin",
            "Wat zijn je passies?"][step]}
        </h3>

        {step < 2 ? (
          <input defaultValue={vals[step]} style={{
            width: "100%", background: `${colors[step]}10`,
            border: `1px solid ${colors[step]}60`,
            borderRadius: 2, color: C.cream, fontSize: 18,
            padding: "10px 12px", fontFamily: "Georgia, serif",
            outline: "none", boxSizing: "border-box",
          }} />
        ) : (
          <textarea defaultValue={vals[step]} rows={3} style={{
            width: "100%", background: `${colors[step]}10`,
            border: `1px solid ${colors[step]}60`,
            borderRadius: 2, color: C.cream, fontSize: 13,
            padding: "10px 12px", fontFamily: "Georgia, serif",
            outline: "none", resize: "none", boxSizing: "border-box", lineHeight: 1.6,
          }} />
        )}
      </Border>

      {step === 3 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {[["🏃 Hardlopen", C.cyan, true], ["🎨 Kunst", C.yellow, true],
            ["✈️ Reizen", C.hotPink, true], ["📚 Lezen", C.white, false],
            ["🍷 Wijn", C.purple, false], ["🎵 Muziek", C.green, false]
          ].map(([tag, col, active], i) => (
            <div key={i} style={{
              padding: "4px 10px", borderRadius: 2,
              border: `1.5px solid ${active ? col : col + "40"}`,
              background: active ? `${col}20` : "transparent",
              color: active ? col : `${col}60`,
              fontSize: 11, cursor: "pointer", fontFamily: "Georgia, serif",
            }}>{tag}</div>
          ))}
        </div>
      )}

      <div style={{ flex: 1 }} />

      <div style={{ display: "flex", gap: 8 }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{
            flex: 1, padding: "12px",
            background: "transparent",
            border: `2px solid ${C.white}30`,
            borderRadius: 2, color: `${C.white}70`,
            fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif",
          }}>← Terug</button>
        )}
        <button
          onClick={() => step < 3 ? setStep(s => s + 1) : onNext()}
          style={{
            flex: 3, padding: "13px",
            background: `linear-gradient(135deg, ${colors[step]}, ${colors[(step + 1) % 4]})`,
            border: "none", borderRadius: 2, color: C.darkBg,
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "Georgia, serif", letterSpacing: 1,
            boxShadow: `0 4px 16px ${colors[step]}50`,
          }}
        >
          {step < 3 ? "Volgende ★" : "Opslaan & verder ♥"}
        </button>
      </div>
    </div>
  );
}

function DiscoverScreen({ onNext }) {
  const [idx, setIdx] = useState(0);
  const profiles = [
    { name: "Sarah", age: 42, tagline: "Dromer met beide voeten op de grond", bio: "Op zoek naar echte gesprekken en echte verbinding. Ik hou van natuur, stille ochtenden en eerlijke mensen.", tags: ["🌿 Natuur", "📖 Lezen", "🍳 Koken"], match: 94, color: C.cyan },
    { name: "Linda", age: 45, tagline: "Nieuwsgierig naar het leven en naar jou", bio: "Moeder, reiziger, yogalerares. Geloof dat de mooiste liefde begint bij een goed gesprek.", tags: ["🧘 Yoga", "✈️ Reizen", "🎭 Theater"], match: 87, color: C.hotPink },
    { name: "Anke", age: 39, tagline: "Avontuurlijk maar ook gewoon thuis", bio: "Werk in de zorg, hou van muziek en koken. Zoek iemand die net zo goed kan luisteren als praten.", tags: ["🎵 Muziek", "🍷 Wijn", "🐕 Honden"], match: 81, color: C.yellow },
  ];
  const p = profiles[idx];

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      background: `linear-gradient(180deg, #1a0828, #0f0518)`,
      padding: "0 0 16px",
      position: "relative",
    }}>

      {/* Top banner */}
      <div style={{
        background: `linear-gradient(135deg, ${C.purple}, ${C.hotPink})`,
        padding: "10px 20px",
        borderBottom: `2px solid ${C.yellow}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: C.yellow, fontFamily: "sans-serif", fontWeight: 700 }}>NIEUWE LEDEN</div>
          <div style={{ fontSize: 14, color: C.white, fontFamily: "Georgia, serif", fontWeight: 700 }}>Ontdek matches</div>
        </div>
        <div style={{ fontSize: 20, opacity: 0.8 }}>🌺</div>
      </div>

      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Card */}
        <Border color={p.color} style={{ flex: 1, padding: "16px", marginBottom: 14, display: "flex", flexDirection: "column" }}>

          {/* Match badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: `radial-gradient(circle, ${p.color}40, ${C.darkBg})`,
              border: `2px solid ${p.color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26,
            }}>?</div>
            <div style={{
              background: `${p.color}20`,
              border: `2px solid ${p.color}`,
              borderRadius: 2, padding: "4px 10px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: p.color, fontFamily: "Georgia, serif" }}>{p.match}%</div>
              <div style={{ fontSize: 8, letterSpacing: 2, color: `${p.color}aa`, fontFamily: "sans-serif" }}>MATCH</div>
            </div>
          </div>

          <h3 style={{ fontSize: 20, color: C.white, margin: "0 0 2px", fontFamily: "Georgia, serif", fontWeight: 700 }}>
            {p.name}, {p.age}
          </h3>
          <p style={{ fontSize: 12, color: p.color, fontStyle: "italic", margin: "0 0 10px", fontFamily: "Georgia, serif" }}>{p.tagline}</p>

          <Divider color={p.color} />

          <p style={{ fontSize: 13, color: `${C.cream}bb`, lineHeight: 1.6, fontFamily: "Georgia, serif", flex: 1 }}>{p.bio}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {p.tags.map((tag, i) => (
              <span key={i} style={{
                padding: "3px 10px",
                border: `1px solid ${p.color}50`,
                background: `${p.color}10`,
                borderRadius: 2, fontSize: 11,
                color: `${p.color}cc`, fontFamily: "Georgia, serif",
              }}>{tag}</span>
            ))}
          </div>

          <div style={{
            marginTop: 12, padding: "8px 10px",
            background: `${C.yellow}10`,
            border: `1px dashed ${C.yellow}40`,
            borderRadius: 2, fontSize: 10,
            color: `${C.yellow}99`, fontFamily: "sans-serif",
            display: "flex", gap: 6,
          }}>
            <span>🔒</span>
            <span>Foto zichtbaar na eerste gesprek</span>
          </div>
        </Border>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setIdx(i => Math.min(i + 1, profiles.length - 1))} style={{
            flex: 1, padding: "12px",
            background: "transparent",
            border: `2px solid ${C.white}30`,
            borderRadius: 2, color: `${C.white}60`,
            fontSize: 18, cursor: "pointer",
          }}>✕</button>
          <button onClick={onNext} style={{
            flex: 3, padding: "12px",
            background: `linear-gradient(135deg, ${p.color}, ${C.magenta})`,
            border: `2px solid ${C.yellow}`,
            borderRadius: 2, color: C.yellow,
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "Georgia, serif", letterSpacing: 1,
            boxShadow: `0 4px 16px ${p.color}50`,
          }}>♥ INTERESSE</button>
          <button style={{
            flex: 1, padding: "12px",
            background: `${C.yellow}15`,
            border: `2px solid ${C.yellow}60`,
            borderRadius: 2, color: C.yellow,
            fontSize: 18, cursor: "pointer",
          }}>★</button>
        </div>
      </div>
    </div>
  );
}

function MatchScreen({ onNext }) {
  const [beat, setBeat] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setBeat(b => b === 1 ? 1.15 : 1), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      background: `radial-gradient(ellipse at 50% 30%, #4a0f5e, #1a0828)`,
      padding: "0",
      overflow: "hidden",
    }}>
      {/* Confetti-style top */}
      <div style={{
        background: `linear-gradient(135deg, ${C.hotPink}, ${C.purple})`,
        padding: "14px 20px",
        borderBottom: `3px solid ${C.yellow}`,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: C.yellow, fontFamily: "sans-serif", fontWeight: 700 }}>
          ★ HET IS WEDERZIJDS ★
        </div>
      </div>

      {/* Flower row */}
      <div style={{ textAlign: "center", fontSize: 16, padding: "8px 0", letterSpacing: 3, opacity: 0.6 }}>
        🌸🌺🌻🌺🌸
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
        <div style={{
          fontSize: 80, transform: `scale(${beat})`,
          transition: "transform 0.4s ease", marginBottom: 16,
          filter: `drop-shadow(0 0 20px ${C.hotPink})`,
        }}>♥</div>

        <Border color={C.yellow} style={{ width: "100%", padding: "16px", marginBottom: 20, textAlign: "center" }}>
          <h2 style={{
            fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 900,
            color: C.yellow, margin: "0 0 6px",
            textShadow: `1px 1px 0 ${C.orange}`,
          }}>JIJ & SARAH</h2>
          <p style={{ fontSize: 13, color: `${C.cream}aa`, fontStyle: "italic", margin: 0, fontFamily: "Georgia, serif" }}>
            Beiden tonen interesse
          </p>
        </Border>

        {/* Journey steps */}
        {[
          { n: "I", label: "Anoniem bellen", sub: "10 min · Nu beschikbaar", color: C.cyan, done: false, active: true },
          { n: "II", label: "Videobel", sub: "Na 3 gesprekken", color: C.yellow, done: false, active: false },
          { n: "III", label: "Afspreken", sub: "Na videogesprek", color: C.green, done: false, active: false },
        ].map(s => (
          <div key={s.n} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px", marginBottom: 8,
            background: s.active ? `${s.color}15` : `${C.white}05`,
            border: `2px solid ${s.active ? s.color : s.color + "30"}`,
            borderRadius: 2, opacity: s.active ? 1 : 0.55,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: s.active ? s.color : `${s.color}20`,
              border: `2px solid ${s.color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: s.active ? C.darkBg : s.color,
              fontSize: 11, fontWeight: 900, fontFamily: "Georgia, serif",
            }}>{s.n}</div>
            <div>
              <div style={{ fontSize: 13, color: C.white, fontFamily: "Georgia, serif", fontWeight: 700 }}>{s.label}</div>
              <div style={{ fontSize: 10, color: `${s.color}99`, fontFamily: "sans-serif" }}>{s.sub}</div>
            </div>
            {s.active && <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: C.green }} />}
          </div>
        ))}
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <button onClick={onNext} style={{
          width: "100%", padding: "14px",
          background: `linear-gradient(135deg, ${C.hotPink}, ${C.purple})`,
          border: `2px solid ${C.yellow}`,
          borderRadius: 2, color: C.yellow,
          fontSize: 13, fontWeight: 700, cursor: "pointer",
          fontFamily: "Georgia, serif", letterSpacing: 2,
          boxShadow: `0 6px 24px ${C.hotPink}60`,
        }}>
          ☎ BEL SARAH NU
        </button>
      </div>
    </div>
  );
}

function CallScreen({ onNext }) {
  const [secs, setSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [wave, setWave] = useState([3,5,8,5,3,7,4,6,3,8,5,3,7,4]);
  useEffect(() => {
    const t = setInterval(() => {
      setSecs(s => s + 1);
      setWave(w => w.map(() => Math.floor(Math.random() * 10) + 2));
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      background: `radial-gradient(ellipse at 50% 20%, #2a0840, #0f0518)`,
    }}>
      {/* Active banner */}
      <div style={{
        background: C.green, padding: "8px 20px",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.white, animation: "none" }} />
        <span style={{ fontSize: 10, letterSpacing: 3, color: C.darkBg, fontFamily: "sans-serif", fontWeight: 700 }}>
          ANONIEM GESPREK ACTIEF
        </span>
      </div>

      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "space-around",
        padding: "20px 24px",
      }}>
        {/* Avatar */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%", margin: "0 auto 14px",
            background: `radial-gradient(circle, ${C.hotPink}40, ${C.darkBg})`,
            border: `3px solid ${C.hotPink}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 42,
            boxShadow: `0 0 30px ${C.hotPink}40`,
          }}>?</div>
          <h2 style={{ fontSize: 22, color: C.white, fontFamily: "Georgia, serif", fontWeight: 700, margin: "0 0 4px" }}>Sarah, 42</h2>
          <p style={{ fontSize: 11, color: `${C.cream}70`, fontStyle: "italic", margin: 0, fontFamily: "Georgia, serif" }}>
            Nummers verborgen voor beiden
          </p>
        </div>

        {/* Timer */}
        <Border color={C.yellow} style={{ padding: "12px 24px", textAlign: "center" }}>
          <div style={{
            fontSize: 34, color: C.yellow, fontFamily: "monospace",
            fontWeight: 700, letterSpacing: 3,
            textShadow: `0 0 20px ${C.yellow}60`,
          }}>{fmt(secs)}</div>
          <div style={{ fontSize: 10, color: `${C.yellow}80`, fontFamily: "sans-serif", letterSpacing: 2 }}>
            {Math.max(0, 600 - secs)}S RESTEREND
          </div>
        </Border>

        {/* Waveform */}
        <div style={{ display: "flex", gap: 3, alignItems: "center", height: 30 }}>
          {wave.map((h, i) => (
            <div key={i} style={{
              width: 3, height: h * 2.5, borderRadius: 2,
              background: i % 3 === 0 ? C.cyan : i % 3 === 1 ? C.hotPink : C.yellow,
              transition: "height 0.3s ease",
              opacity: 0.8,
            }} />
          ))}
        </div>

        {/* Conversation starter */}
        <div style={{
          width: "100%",
          background: `${C.purple}30`,
          border: `2px solid ${C.purple}`,
          borderRadius: 2, padding: "14px",
        }}>
          <div style={{ fontSize: 9, letterSpacing: 3, color: C.cyan, fontFamily: "sans-serif", marginBottom: 6, fontWeight: 700 }}>
            GESPREKSSTARTER
          </div>
          <p style={{ fontSize: 13, color: C.cream, fontStyle: "italic", margin: 0, fontFamily: "Georgia, serif", lineHeight: 1.6 }}>
            "Wat is het mooiste moment dat je ooit hebt meegemaakt op reis?"
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button onClick={() => setMuted(m => !m)} style={{
            width: 52, height: 52, borderRadius: "50%",
            background: muted ? `${C.hotPink}30` : `${C.white}10`,
            border: `2px solid ${muted ? C.hotPink : C.white + "30"}`,
            fontSize: 20, cursor: "pointer",
          }}>{muted ? "🔇" : "🎙️"}</button>

          <button onClick={onNext} style={{
            width: 68, height: 68, borderRadius: "50%",
            background: `radial-gradient(circle, #e74c3c, #c0392b)`,
            border: `3px solid ${C.yellow}`,
            fontSize: 22, cursor: "pointer",
            boxShadow: "0 6px 20px rgba(231,76,60,0.5)",
          }}>✕</button>

          <button style={{
            width: 52, height: 52, borderRadius: "50%",
            background: `${C.white}10`,
            border: `2px solid ${C.white}30`,
            fontSize: 20, cursor: "pointer",
          }}>🔊</button>
        </div>
      </div>
    </div>
  );
}

function AfterCallScreen({ onNext }) {
  const [stars, setStars] = useState(4);

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      background: `linear-gradient(180deg, #1a0828, #0f0518)`,
      padding: "0",
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${C.purple}, ${C.hotPink})`,
        padding: "10px 20px",
        borderBottom: `2px solid ${C.yellow}`,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: C.yellow, fontFamily: "sans-serif", fontWeight: 700 }}>
          ★ GESPREK AFGEROND ★
        </div>
      </div>

      <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column" }}>
        <h2 style={{
          fontSize: 20, fontFamily: "Georgia, serif", fontWeight: 700,
          color: C.white, marginBottom: 6,
        }}>Hoe was het met Sarah?</h2>
        <p style={{ fontSize: 13, color: `${C.cream}80`, fontStyle: "italic", fontFamily: "Georgia, serif", marginBottom: 20, lineHeight: 1.6 }}>
          Jouw beoordeling helpt ons betere matches te vinden.
        </p>

        {/* Stars */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {[1,2,3,4,5].map(i => (
            <span key={i} onClick={() => setStars(i)} style={{
              fontSize: 36, cursor: "pointer",
              color: i <= stars ? C.yellow : `${C.white}20`,
              transition: "color 0.2s",
              filter: i <= stars ? `drop-shadow(0 0 6px ${C.yellow})` : "none",
            }}>★</span>
          ))}
        </div>

        {/* Progress bar */}
        <Border color={C.cyan} style={{ padding: "14px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 11, fontFamily: "sans-serif" }}>
            <span style={{ color: `${C.cream}99` }}>Naar videogesprek</span>
            <span style={{ color: C.cyan, fontWeight: 700 }}>1 / 3</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: `${C.white}10`, marginBottom: 8 }}>
            <div style={{
              width: "33%", height: "100%", borderRadius: 4,
              background: `linear-gradient(90deg, ${C.cyan}, ${C.yellow})`,
            }} />
          </div>
          <div style={{ fontSize: 10, color: `${C.cyan}80`, fontFamily: "sans-serif" }}>
            Nog 2 gesprekken voordat video beschikbaar wordt
          </div>
        </Border>

        <div style={{ flex: 1 }} />

        {/* Flower decoration */}
        <div style={{ textAlign: "center", fontSize: 18, opacity: 0.4, letterSpacing: 4, marginBottom: 16 }}>
          🌸 🌺 🌸
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onNext} style={{
            flex: 1, padding: "12px",
            background: "transparent",
            border: `2px solid ${C.white}25`,
            borderRadius: 2, color: `${C.white}60`,
            fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif",
          }}>← Terug</button>
          <button onClick={onNext} style={{
            flex: 3, padding: "12px",
            background: `linear-gradient(135deg, ${C.hotPink}, ${C.purple})`,
            border: `2px solid ${C.yellow}`,
            borderRadius: 2, color: C.yellow,
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            fontFamily: "Georgia, serif", letterSpacing: 1,
            boxShadow: `0 4px 16px ${C.hotPink}50`,
          }}>OPSLAAN ★</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

const SCREENS = [
  { id: "start", label: "Start", C: SplashScreen },
  { id: "profiel", label: "Profiel", C: ProfileScreen },
  { id: "ontdek", label: "Ontdek", C: DiscoverScreen },
  { id: "match", label: "Match!", C: MatchScreen },
  { id: "bellen", label: "Bellen", C: CallScreen },
  { id: "review", label: "Review", C: AfterCallScreen },
];

export default function App() {
  const [idx, setIdx] = useState(0);
  const { C: Screen } = SCREENS[idx];
  const next = () => setIdx(i => Math.min(i + 1, SCREENS.length - 1));

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: `radial-gradient(ellipse at 30% 20%, ${C.hotPink}20, transparent 50%), radial-gradient(ellipse at 70% 80%, ${C.purple}20, transparent 50%), #0a0010`,
      fontFamily: "Georgia, serif",
      padding: "20px 0",
    }}>

      {/* Nav */}
      <div style={{ display: "flex", gap: 5, marginBottom: 16, flexWrap: "wrap", justifyContent: "center" }}>
        {SCREENS.map((s, i) => (
          <button key={s.id} onClick={() => setIdx(i)} style={{
            padding: "5px 12px", borderRadius: 2, fontSize: 11,
            background: i === idx ? C.hotPink : "transparent",
            border: `1.5px solid ${i === idx ? C.yellow : C.white + "25"}`,
            color: i === idx ? C.yellow : `${C.white}60`,
            cursor: "pointer", fontFamily: "sans-serif", fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase",
          }}>{s.label}</button>
        ))}
      </div>

      {/* Phone */}
      <div style={{
        width: 375, height: 750,
        borderRadius: 36,
        border: `2px solid ${C.yellow}50`,
        overflow: "hidden",
        boxShadow: `0 0 60px ${C.hotPink}30, 0 0 120px ${C.purple}20, 0 40px 80px rgba(0,0,0,0.5)`,
        display: "flex", flexDirection: "column",
        background: C.darkBg,
      }}>
        {/* Status bar */}
        <div style={{
          padding: "10px 20px 6px",
          display: "flex", justifyContent: "space-between",
          fontSize: 10, color: `${C.white}60`, fontFamily: "sans-serif",
          flexShrink: 0, background: C.darkBg,
        }}>
          <span>9:41</span>
          <span style={{ color: C.yellow, fontWeight: 700, letterSpacing: 2 }}>♥ LHC</span>
          <span>●●●</span>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Screen onNext={next} />
        </div>
      </div>

      <p style={{ marginTop: 14, fontSize: 11, color: `${C.white}40`, fontFamily: "sans-serif" }}>
        lonelyheartsclub.nl — klik op de tabs om te navigeren
      </p>
    </div>
  );
}

