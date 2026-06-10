import { useState, useEffect, useRef } from "react";
import { hasSupabaseConfig, supabase } from "./lib/supabase.js";
import { startCall, hangUp, mute, initTwilioDevice } from "./lib/twilio.js";
import AuthScreen from "./screens/AuthScreen.jsx";

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

const ALL_TAGS = [
  ["🏃 Hardlopen", C.cyan],   ["🎨 Kunst", C.yellow],
  ["✈️ Reizen", C.hotPink],   ["📚 Lezen", C.white],
  ["🍷 Wijn", C.purple],      ["🎵 Muziek", C.green],
  ["🍳 Koken", C.orange],     ["🐕 Honden", C.cyan],
  ["🧘 Yoga", C.magenta],
];

const PROFILE_COLORS = [C.cyan, C.hotPink, C.yellow, C.green, C.purple, C.orange];
const colorFor = (id) => PROFILE_COLORS[parseInt(id?.slice(-1), 16) % PROFILE_COLORS.length] ?? C.cyan;

const DEMO_USER = {
  id: "demo-user",
  email: "demo@lonelyheartsclub.nl",
};

const DEMO_PROFILES = [
  {
    id: "demo-profile-1",
    naam: "Sarah",
    leeftijd: 39,
    passies: "Jazz, hardlopen en lange avonden koken",
    verhaal: "Ik ben nieuwsgierig, zacht voor mensen en nogal fanatiek als er een goede playlist op staat.",
    tags: ["🏃 Hardlopen", "🎵 Muziek", "🍳 Koken"],
  },
  {
    id: "demo-profile-2",
    naam: "Linda",
    leeftijd: 44,
    passies: "Kunst, reizen en boeken die blijven hangen",
    verhaal: "Ik zoek iemand die durft te luisteren, kan lachen om het leven en graag nieuwe plekken ontdekt.",
    tags: ["🎨 Kunst", "✈️ Reizen", "📚 Lezen"],
  },
  {
    id: "demo-profile-3",
    naam: "Anke",
    leeftijd: 41,
    passies: "Yoga, wijn en wandelen zonder haast",
    verhaal: "Rustig van buiten, levendig van binnen. Ik hou van goede gesprekken en kleine plannen die spontaan groot worden.",
    tags: ["🧘 Yoga", "🍷 Wijn", "🐕 Honden"],
  },
  {
    id: "demo-profile-4",
    naam: "Nora",
    leeftijd: 47,
    passies: "Piano, musea en zondagochtendkoffie",
    verhaal: "Ik ben op mijn best bij mensen die eerlijk, warm en een beetje eigenwijs zijn.",
    tags: ["🎵 Muziek", "🎨 Kunst", "📚 Lezen"],
  },
];

const DEMO_MATCHES = [
  { id: "demo-match-1", user_a: DEMO_USER.id, user_b: "demo-profile-1", created_at: new Date().toISOString() },
  { id: "demo-match-2", user_a: DEMO_USER.id, user_b: "demo-profile-2", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "demo-match-3", user_a: DEMO_USER.id, user_b: "demo-profile-3", created_at: new Date(Date.now() - 172800000).toISOString() },
];

const DEMO_MESSAGES = {
  "demo-match-1": [
    { id: "m1", match_id: "demo-match-1", sender_id: "demo-profile-1", content: "Leuk dat we gematcht zijn. Hardlopen of jazz als eerste onderwerp?", created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: "m2", match_id: "demo-match-1", sender_id: DEMO_USER.id, content: "Jazz tijdens het hardlopen klinkt als een goed compromis.", created_at: new Date(Date.now() - 3000000).toISOString() },
  ],
  "demo-match-2": [
    { id: "m3", match_id: "demo-match-2", sender_id: "demo-profile-2", content: "Ik zag dat reizen ook bij jou past. Wat was je laatste fijne plek?", created_at: new Date(Date.now() - 90000000).toISOString() },
  ],
  "demo-match-3": [],
};

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage may be unavailable in privacy-restricted browser modes.
  }
};

// ─── SPLASH SCREEN ──────────────────────────────────────────────────────────
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
      overflow: "hidden", position: "relative",
    }}>
      {[[10,8,22,C.yellow],[45,160,16,C.cyan],[290,80,18,C.hotPink],
        [20,280,14,C.green],[310,240,20,C.yellow],[150,340,16,C.purple]].map(([t,l,s,c],i) => (
        <div key={i} style={{ position: "absolute", top: t, left: l, fontSize: s, opacity: 0.35, pointerEvents: "none" }}>🌸</div>
      ))}

      <div style={{
        background: `linear-gradient(135deg, ${C.hotPink}, ${C.magenta})`,
        padding: "10px 0", textAlign: "center",
        borderBottom: `3px solid ${C.yellow}`,
      }}>
        <div style={{ fontSize: 9, letterSpacing: 5, color: C.yellow, textTransform: "uppercase", fontFamily: "sans-serif", fontWeight: 700 }}>★ PRESENTING ★</div>
      </div>

      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "16px 24px 0",
        opacity: show ? 1 : 0, transition: "opacity 0.7s ease",
      }}>
        <Border color={C.yellow} style={{ width: "100%", padding: "16px 12px", marginBottom: 16 }}>
          <div style={{ background: `radial-gradient(ellipse, #3a0f5a, ${C.darkBg})`, borderRadius: 2, padding: "16px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: C.cyan, textTransform: "uppercase", marginBottom: 6, fontFamily: "sans-serif" }}>SGT. PEPPER'S</div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 900, color: C.white, margin: "0 0 2px", textShadow: `2px 2px 0 ${C.hotPink}, 4px 4px 0 ${C.purple}`, lineHeight: 1.1, letterSpacing: 1 }}>LONELY HEARTS</h1>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 900, color: C.yellow, margin: "0 0 6px", textShadow: `2px 2px 0 ${C.orange}`, lineHeight: 1.1, letterSpacing: 1 }}>CLUB</h1>
            <img src="/lhc-seal.svg" alt="" style={{
              width: 58,
              height: 58,
              display: "block",
              margin: "8px auto 10px",
              filter: `drop-shadow(0 0 16px ${C.hotPink}80)`,
            }} />
            <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
              <Badge color={C.cyan} text=".nl" small />
              <Badge color={C.yellow} text="Gratis" small />
              <Badge color={C.green} text="Nl" small />
            </div>
          </div>
        </Border>

        <div style={{ display: "flex", justifyContent: "center", gap: 4, fontSize: 18, margin: "2px 0 16px", letterSpacing: 2 }}>
          {Array.from("🌸🌺🌻🌸🌺🌻🌸").map((f, i) => <span key={i}>{f}</span>)}
        </div>

        <div style={{ width: "100%", marginBottom: 16 }}>
          {[
            { n: "I",   color: C.cyan,    icon: "✦", text: "Profiel zonder foto" },
            { n: "II",  color: C.yellow,  icon: "☎", text: "Anoniem bellen" },
            { n: "III", color: C.hotPink, icon: "◉", text: "Videogesprek" },
            { n: "IV",  color: C.green,   icon: "♥", text: "Echte afspraak" },
          ].map((s) => (
            <div key={s.n} style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 6, padding: "8px 12px",
              background: `${s.color}12`, border: `1px solid ${s.color}40`, borderLeft: `4px solid ${s.color}`, borderRadius: 2,
            }}>
              <span style={{ fontFamily: "Georgia, serif", fontWeight: 900, color: s.color, fontSize: 11, width: 18, flexShrink: 0 }}>{s.n}</span>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <span style={{ fontSize: 13, color: C.cream, fontFamily: "Georgia, serif" }}>{s.text}</span>
            </div>
          ))}
        </div>

        <Divider color={C.yellow} />
        <p style={{ fontSize: 12, color: `${C.cream}99`, textAlign: "center", fontStyle: "italic", fontFamily: "Georgia, serif", lineHeight: 1.6, marginBottom: 16 }}>
          "De mooiste liefde begint met een stem"
        </p>

        <button onClick={onNext} style={{
          width: "100%", padding: "14px",
          background: `linear-gradient(135deg, ${C.hotPink}, ${C.magenta})`,
          border: `2px solid ${C.yellow}`, borderRadius: 2, color: C.yellow,
          fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif",
          letterSpacing: 2, textTransform: "uppercase", boxShadow: `0 4px 20px ${C.hotPink}60`,
        }}>★ WORD LID ★</button>
      </div>

      <div style={{ background: C.purple, padding: "7px 0", borderTop: `2px solid ${C.cyan}`, textAlign: "center", marginTop: 12 }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: C.cyan, fontFamily: "sans-serif", fontWeight: 700 }}>LONELYHEARTSCLUB.NL · EST. 2026</div>
      </div>
    </div>
  );
}

// ─── PROFILE SCREEN ──────────────────────────────────────────────────────────
function ProfileScreen({ user, onNext }) {
  const [step, setStep] = useState(0);
  const [naam, setNaam] = useState("");
  const [leeftijd, setLeeftijd] = useState("");
  const [verhaal, setVerhaal] = useState("");
  const [passies, setPassies] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Laad bestaand profiel
  useEffect(() => {
    if (!user) return;

    if (!hasSupabaseConfig || !supabase) {
      const data = readJson(`lhc-profile:${user.id}`, null);
      if (!data) return;
      setNaam(data.naam ?? "");
      setLeeftijd(data.leeftijd?.toString() ?? "");
      setVerhaal(data.verhaal ?? "");
      setPassies(data.passies ?? "");
      setActiveTags(
        (data.tags ?? []).map(t => ALL_TAGS.findIndex(([tag]) => tag === t)).filter(i => i >= 0)
      );
      return;
    }

    supabase.from("profiles").select("*").eq("id", user.id).single()
      .then(({ data }) => {
        if (!data) return;
        setNaam(data.naam ?? data.voornaam ?? "");
        setLeeftijd(data.leeftijd?.toString() ?? "");
        setVerhaal(data.verhaal ?? "");
        setPassies(Array.isArray(data.passies) ? data.passies.join(", ") : data.passies ?? "");
        setActiveTags(
          ([...(data.tags ?? []), ...(Array.isArray(data.passies) ? data.passies : [])])
            .map(t => ALL_TAGS.findIndex(([tag]) => tag === t))
            .filter(i => i >= 0)
        );
      });
  }, [user]);

  const toggleTag = (i) => {
    setFormError("");
    setActiveTags(prev => prev.includes(i) ? prev.filter(t => t !== i) : [...prev, i]);
  };

  const stepError = (() => {
    if (step === 0 && naam.trim().length < 2) return "Vul minimaal je voornaam in.";
    if (step === 1) {
      const age = Number(leeftijd);
      if (!Number.isFinite(age) || age < 18 || age > 120) return "Je moet 18+ zijn om mee te doen.";
    }
    if (step === 2 && verhaal.trim().length < 12) return "Geef minstens één echte zin over jezelf.";
    if (step === 3 && !passies.trim() && activeTags.length === 0) return "Kies een interesse of schrijf je passies op.";
    return "";
  })();

  const canContinue = !stepError && !saving;

  const saveProfile = async () => {
    if (stepError) {
      setFormError(stepError);
      return;
    }

    setSaving(true);
    setFormError("");
    const payload = {
      id: user.id,
      naam,
      voornaam: naam,
      leeftijd: parseInt(leeftijd) || null,
      verhaal,
      passies,
      tags: activeTags.map(i => ALL_TAGS[i][0]),
    };

    if (!hasSupabaseConfig || !supabase) {
      writeJson(`lhc-profile:${user.id}`, payload);
      setSaving(false);
      onNext();
      return;
    }

    const { error } = await supabase.from("profiles").upsert({
      ...payload,
    });
    setSaving(false);
    if (error) {
      setFormError("Opslaan lukte niet. Probeer het nog een keer.");
      return;
    }
    onNext();
  };

  const steps = ["Naam", "Leeftijd", "Verhaal", "Passies"];
  const colors = [C.cyan, C.yellow, C.hotPink, C.green];

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      background: `linear-gradient(180deg, #1a0828 0%, #0f0518 100%)`,
      padding: "16px 20px 20px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 8, right: 8, fontSize: 22, opacity: 0.2 }}>🌺</div>

      <div style={{
        background: `linear-gradient(135deg, ${C.purple}, ${C.magenta})`,
        border: `2px solid ${C.yellow}`, borderRadius: 2, padding: "8px 12px", marginBottom: 14,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: C.yellow, fontFamily: "sans-serif", fontWeight: 700 }}>JE PROFIEL</div>
          <div style={{ fontSize: 13, color: C.white, fontFamily: "Georgia, serif", fontWeight: 700 }}>Vertel je verhaal</div>
        </div>
        <div style={{ background: `${C.hotPink}30`, border: `1px solid ${C.hotPink}`, borderRadius: 20, padding: "3px 10px", fontSize: 10, color: C.hotPink, fontFamily: "sans-serif" }}>
          {step + 1}/{steps.length}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 20, justifyContent: "center" }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            width: i === step ? 28 : 8, height: 8, borderRadius: 4,
            background: i <= step ? colors[i] : `${C.white}20`,
            transition: "all 0.3s ease", cursor: "pointer",
          }} onClick={() => setStep(i)} />
        ))}
      </div>

      <div style={{ background: `${C.yellow}12`, border: `2px dashed ${C.yellow}50`, borderRadius: 2, padding: "8px 12px", marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 16 }}>🎭</span>
        <span style={{ fontSize: 11, color: `${C.yellow}cc`, fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          Geen foto. Jij bent meer dan een plaatje.
        </span>
      </div>

      <Border color={colors[step]} style={{ marginBottom: 16, padding: "14px" }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: colors[step], marginBottom: 8, fontFamily: "sans-serif", fontWeight: 700 }}>
          {steps[step].toUpperCase()}
        </div>
        <h3 style={{ fontSize: 16, color: C.white, fontFamily: "Georgia, serif", margin: "0 0 14px", fontWeight: 700 }}>
          {["Wat is je voornaam?", "Hoe oud ben je?", "Omschrijf jezelf in één zin", "Wat zijn je passies?"][step]}
        </h3>

        {step < 2 ? (
          <input
            value={step === 0 ? naam : leeftijd}
            onChange={e => {
              setFormError("");
              step === 0 ? setNaam(e.target.value) : setLeeftijd(e.target.value);
            }}
            type={step === 1 ? "number" : "text"}
            min={step === 1 ? 18 : undefined}
            placeholder={step === 0 ? "Jouw voornaam…" : "Jouw leeftijd…"}
            style={{
              width: "100%", background: `${colors[step]}10`, border: `1px solid ${colors[step]}60`,
              borderRadius: 2, color: C.cream, fontSize: 18, padding: "10px 12px",
              fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box",
            }} />
        ) : (
          <textarea
            value={step === 2 ? verhaal : passies}
            onChange={e => {
              setFormError("");
              step === 2 ? setVerhaal(e.target.value) : setPassies(e.target.value);
            }}
            placeholder={step === 2 ? "Vertel iets over jezelf…" : "Bijv. hardlopen, muziek, reizen…"}
            rows={3}
            style={{
              width: "100%", background: `${colors[step]}10`, border: `1px solid ${colors[step]}60`,
              borderRadius: 2, color: C.cream, fontSize: 13, padding: "10px 12px",
              fontFamily: "Georgia, serif", outline: "none", resize: "none", boxSizing: "border-box", lineHeight: 1.6,
            }} />
        )}
      </Border>

      {step === 3 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {ALL_TAGS.map(([tag, col], i) => (
            <div key={i} onClick={() => toggleTag(i)} style={{
              padding: "4px 10px", borderRadius: 2,
              border: `1.5px solid ${activeTags.includes(i) ? col : col + "40"}`,
              background: activeTags.includes(i) ? `${col}20` : "transparent",
              color: activeTags.includes(i) ? col : `${col}60`,
              fontSize: 11, cursor: "pointer", fontFamily: "Georgia, serif", transition: "all 0.2s",
            }}>{tag}</div>
          ))}
        </div>
      )}

      {(formError || stepError) && (
        <div style={{
          marginBottom: 12,
          padding: "8px 10px",
          border: `1px solid ${(formError || stepError) === formError ? C.hotPink : C.yellow}55`,
          background: `${(formError || stepError) === formError ? C.hotPink : C.yellow}10`,
          color: formError ? C.hotPink : `${C.yellow}cc`,
          fontSize: 11,
          lineHeight: 1.4,
          fontFamily: "sans-serif",
        }}>
          {formError || stepError}
        </div>
      )}

      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", gap: 8 }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{
            flex: 1, padding: "12px", background: "transparent",
            border: `2px solid ${C.white}30`, borderRadius: 2, color: `${C.white}70`,
            fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif",
          }}>← Terug</button>
        )}
        <button
          onClick={() => step < 3 ? setStep(s => s + 1) : saveProfile()}
          disabled={!canContinue}
          style={{
            flex: 3, padding: "13px",
            background: `linear-gradient(135deg, ${colors[step]}, ${colors[(step + 1) % 4]})`,
            border: "none", borderRadius: 2, color: C.darkBg,
            fontSize: 13, fontWeight: 700, cursor: canContinue ? "pointer" : "default",
            fontFamily: "Georgia, serif", letterSpacing: 1,
            boxShadow: `0 4px 16px ${colors[step]}50`,
            opacity: canContinue ? 1 : 0.5,
          }}
        >
          {saving ? "Opslaan…" : step < 3 ? "Volgende ★" : "Opslaan & verder ♥"}
        </button>
      </div>
    </div>
  );
}

// ─── DISCOVER SCREEN ─────────────────────────────────────────────────────────
function DiscoverScreen({ user, onMatch }) {
  const [profiles, setProfiles] = useState([]);
  const [idx, setIdx] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, [user]);

  const loadProfiles = async () => {
    setLoading(true);
    if (!hasSupabaseConfig || !supabase) {
      setProfiles(DEMO_PROFILES);
      setIdx(0);
      setLoading(false);
      return;
    }

    // Haal alle profielen op behalve de eigen gebruiker
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .neq("id", user.id)
      .or("naam.not.is.null,voornaam.not.is.null")
      .limit(20);
    setProfiles(error ? DEMO_PROFILES : data ?? []);
    setIdx(0);
    setLoading(false);
  };

  const handlePass = () => {
    setSwipeDir("left");
    setTimeout(() => {
      setSwipeDir(null);
      setIdx(i => i + 1);
    }, 300);
  };

  const handleInterest = async () => {
    const target = profiles[idx];
    if (!target) return;

    if (!hasSupabaseConfig || !supabase) {
      const demoMatch = {
        id: `demo-instant-${target.id}`,
        user_a: user.id,
        user_b: target.id,
        created_at: new Date().toISOString(),
      };
      onMatch(demoMatch, target);
      return;
    }

    // Sla interesse op in database
    const { error: interestError } = await supabase
      .from("interests")
      .upsert({ from_user: user.id, to_user: target.id });

    if (interestError) {
      onMatch({
        id: `local-${user.id}-${target.id}`,
        user_a: user.id,
        user_b: target.id,
        created_at: new Date().toISOString(),
      }, target);
      return;
    }

    // Kijk of het wederzijds is (trigger doet dit ook, maar voor directe UI-feedback)
    const { data: mutual } = await supabase
      .from("interests")
      .select("id")
      .eq("from_user", target.id)
      .eq("to_user", user.id)
      .single();

    if (mutual) {
      // Match! Haal match op
      const { data: match } = await supabase
        .from("matches")
        .select("*")
        .or(`and(user_a.eq.${user.id},user_b.eq.${target.id}),and(user_a.eq.${target.id},user_b.eq.${user.id})`)
        .single();
      onMatch(match ?? {
        id: `pending-${user.id}-${target.id}`,
        user_a: user.id,
        user_b: target.id,
        created_at: new Date().toISOString(),
      }, target);
    } else {
      setSwipeDir("right");
      setTimeout(() => { setSwipeDir(null); setIdx(i => i + 1); }, 300);
    }
  };

  if (loading) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(180deg, #1a0828, #0f0518)` }}>
      <div style={{ fontSize: 32, animation: "none" }}>🌸</div>
    </div>
  );

  if (profiles.length === 0 || idx >= profiles.length) return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(180deg, #1a0828, #0f0518)`, padding: 24 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🌻</div>
      <p style={{ color: C.cream, fontFamily: "Georgia, serif", textAlign: "center", fontSize: 16, fontStyle: "italic" }}>
        Je hebt alle leden gezien.<br />Kom later terug voor nieuwe profielen!
      </p>
      <button onClick={loadProfiles} style={{
        marginTop: 20, padding: "10px 20px", background: `${C.hotPink}20`,
        border: `2px solid ${C.hotPink}`, borderRadius: 2, color: C.hotPink,
        fontFamily: "Georgia, serif", cursor: "pointer", fontSize: 13,
      }}>Vernieuwen</button>
    </div>
  );

  const p = profiles[idx];
  const pColor = colorFor(p.id);
  const matchScore = Math.min(99, 60 + (p.tags ?? []).filter(t =>
    ALL_TAGS.some(([tag]) => tag === t)
  ).length * 8);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: `linear-gradient(180deg, #1a0828, #0f0518)`, padding: "0 0 16px", position: "relative" }}>
      <div style={{
        background: `linear-gradient(135deg, ${C.purple}, ${C.hotPink})`, padding: "10px 20px",
        borderBottom: `2px solid ${C.yellow}`, display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: C.yellow, fontFamily: "sans-serif", fontWeight: 700 }}>NIEUWE LEDEN</div>
          <div style={{ fontSize: 14, color: C.white, fontFamily: "Georgia, serif", fontWeight: 700 }}>Ontdek matches</div>
        </div>
        <div style={{ fontSize: 10, color: `${C.white}50`, fontFamily: "sans-serif" }}>{idx + 1} / {profiles.length}</div>
      </div>

      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <Border color={pColor} style={{
          flex: 1, padding: "16px", marginBottom: 14, display: "flex", flexDirection: "column",
          transform: swipeDir ? `translateX(${swipeDir === "left" ? "-120%" : "120%"}) rotate(${swipeDir === "left" ? "-8deg" : "8deg"})` : "translateX(0)",
          transition: swipeDir ? "transform 0.3s ease" : "none",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: `radial-gradient(circle, ${pColor}40, ${C.darkBg})`,
              border: `2px solid ${pColor}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
            }}>?</div>
            <div style={{ background: `${pColor}20`, border: `2px solid ${pColor}`, borderRadius: 2, padding: "4px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: pColor, fontFamily: "Georgia, serif" }}>{matchScore}%</div>
              <div style={{ fontSize: 8, letterSpacing: 2, color: `${pColor}aa`, fontFamily: "sans-serif" }}>MATCH</div>
            </div>
          </div>

          <h3 style={{ fontSize: 20, color: C.white, margin: "0 0 2px", fontFamily: "Georgia, serif", fontWeight: 700 }}>
            {p.naam ?? p.voornaam}, {p.leeftijd}
          </h3>
          <p style={{ fontSize: 12, color: pColor, fontStyle: "italic", margin: "0 0 10px", fontFamily: "Georgia, serif" }}>
            {Array.isArray(p.passies) ? p.passies.join(", ") : p.passies}
          </p>

          <Divider color={pColor} />
          <p style={{ fontSize: 13, color: `${C.cream}bb`, lineHeight: 1.6, fontFamily: "Georgia, serif", flex: 1 }}>{p.verhaal}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {([...(p.tags ?? []), ...(Array.isArray(p.passies) ? p.passies : [])]).map((tag, i) => (
              <span key={i} style={{ padding: "3px 10px", border: `1px solid ${pColor}50`, background: `${pColor}10`, borderRadius: 2, fontSize: 11, color: `${pColor}cc`, fontFamily: "Georgia, serif" }}>{tag}</span>
            ))}
          </div>

          <div style={{ marginTop: 12, padding: "8px 10px", background: `${C.yellow}10`, border: `1px dashed ${C.yellow}40`, borderRadius: 2, fontSize: 10, color: `${C.yellow}99`, fontFamily: "sans-serif", display: "flex", gap: 6 }}>
            <span>🔒</span><span>Foto zichtbaar na eerste gesprek</span>
          </div>
        </Border>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handlePass} style={{ flex: 1, padding: "12px", background: "transparent", border: `2px solid ${C.white}30`, borderRadius: 2, color: `${C.white}60`, fontSize: 18, cursor: "pointer" }}>✕</button>
          <button onClick={handleInterest} style={{ flex: 3, padding: "12px", background: `linear-gradient(135deg, ${pColor}, ${C.magenta})`, border: `2px solid ${C.yellow}`, borderRadius: 2, color: C.yellow, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif", letterSpacing: 1, boxShadow: `0 4px 16px ${pColor}50` }}>♥ INTERESSE</button>
          <button style={{ flex: 1, padding: "12px", background: `${C.yellow}15`, border: `2px solid ${C.yellow}60`, borderRadius: 2, color: C.yellow, fontSize: 18, cursor: "pointer" }}>★</button>
        </div>
      </div>
    </div>
  );
}

// ─── MATCH SCREEN ────────────────────────────────────────────────────────────
function MatchScreen({ match, matchedUser, onCall, onLater }) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setScale(s => s === 1 ? 1.15 : 1), 900);
    return () => clearInterval(t);
  }, []);

  const pColor = colorFor(matchedUser?.id);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: `radial-gradient(ellipse at 50% 30%, #4a0f5e, #1a0828)`, overflow: "hidden" }}>
      <div style={{ background: `linear-gradient(135deg, ${C.hotPink}, ${C.purple})`, padding: "14px 20px", borderBottom: `3px solid ${C.yellow}`, textAlign: "center" }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: C.yellow, fontFamily: "sans-serif", fontWeight: 700 }}>★ HET IS WEDERZIJDS ★</div>
      </div>

      <div style={{ textAlign: "center", fontSize: 16, padding: "8px 0", letterSpacing: 3, opacity: 0.6 }}>🌸🌺🌻🌺🌸</div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
        <div style={{ fontSize: 80, transform: `scale(${scale})`, transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)", marginBottom: 16, filter: `drop-shadow(0 0 20px ${C.hotPink})` }}>♥</div>

        <Border color={C.yellow} style={{ width: "100%", padding: "16px", marginBottom: 20, textAlign: "center" }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 900, color: C.yellow, margin: "0 0 6px", textShadow: `1px 1px 0 ${C.orange}` }}>
            JIJ & {(matchedUser?.naam ?? "???").toUpperCase()}
          </h2>
          <p style={{ fontSize: 13, color: `${C.cream}aa`, fontStyle: "italic", margin: 0, fontFamily: "Georgia, serif" }}>Beiden tonen interesse</p>
        </Border>

        {[
          { n: "I",   label: "Anoniem bellen",  sub: "10 min · Nu beschikbaar", color: C.cyan,   active: true },
          { n: "II",  label: "Videobel",         sub: "Na 3 gesprekken",         color: C.yellow, active: false },
          { n: "III", label: "Afspreken",         sub: "Na videogesprek",         color: C.green,  active: false },
        ].map(s => (
          <div key={s.n} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px", marginBottom: 8,
            background: s.active ? `${s.color}15` : `${C.white}05`,
            border: `2px solid ${s.active ? s.color : s.color + "30"}`,
            borderRadius: 2, opacity: s.active ? 1 : 0.55,
          }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: s.active ? s.color : `${s.color}20`, border: `2px solid ${s.color}`, display: "flex", alignItems: "center", justifyContent: "center", color: s.active ? C.darkBg : s.color, fontSize: 11, fontWeight: 900, fontFamily: "Georgia, serif" }}>{s.n}</div>
            <div>
              <div style={{ fontSize: 13, color: C.white, fontFamily: "Georgia, serif", fontWeight: 700 }}>{s.label}</div>
              <div style={{ fontSize: 10, color: `${s.color}99`, fontFamily: "sans-serif" }}>{s.sub}</div>
            </div>
            {s.active && <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: C.green }} />}
          </div>
        ))}
      </div>

      <div style={{ padding: "0 20px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={onCall} style={{
          width: "100%", padding: "14px",
          background: `linear-gradient(135deg, ${C.hotPink}, ${C.purple})`,
          border: `2px solid ${C.yellow}`, borderRadius: 2, color: C.yellow,
          fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif",
          letterSpacing: 2, boxShadow: `0 6px 24px ${C.hotPink}60`,
        }}>
          ☎ BEL {(matchedUser?.naam ?? "NU").toUpperCase()} NU
        </button>
        <button onClick={onLater} style={{
          width: "100%", padding: "10px", background: "transparent",
          border: `1px solid ${C.white}20`, borderRadius: 2, color: `${C.white}50`,
          fontSize: 11, cursor: "pointer", fontFamily: "Georgia, serif",
        }}>Later bellen →</button>
      </div>
    </div>
  );
}

// ─── CALL SCREEN ─────────────────────────────────────────────────────────────
function CallScreen({ match, matchedUser, user, onEnd }) {
  const [secs, setSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [wave, setWave] = useState([3,5,8,5,3,7,4,6,3,8,5,3,7,4]);
  const [callState, setCallState] = useState("connecting"); // connecting | active | ended
  const callRef = useRef(null);

  useEffect(() => {
    let timer;
    const beginCall = async () => {
      try {
        const targetId = match?.user_a === user.id
          ? match.user_b
          : match?.user_b === user.id
            ? match.user_a
            : matchedUser?.id;
        if (!targetId) throw new Error("Geen match beschikbaar om te bellen");
        callRef.current = await startCall(targetId, {
          onAccepted: () => setCallState("active"),
          onDisconnected: () => { setCallState("ended"); clearInterval(timer); onEnd(); },
        });
        setCallState("active");
      } catch (err) {
        console.error("Belfout:", err);
        setCallState("ended");
      }
    };

    beginCall();
    timer = setInterval(() => {
      setSecs(s => s + 1);
      setWave(w => w.map(() => Math.floor(Math.random() * 10) + 2));
    }, 1000);

    return () => { clearInterval(timer); };
  }, []);

  const handleMute = () => {
    const next = !muted;
    setMuted(next);
    mute(next);
  };

  const handleHangUp = () => {
    hangUp();
    onEnd();
  };

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: `radial-gradient(ellipse at 50% 20%, #2a0840, #0f0518)` }}>
      <div style={{ background: callState === "connecting" ? C.orange : C.green, padding: "8px 20px", display: "flex", alignItems: "center", gap: 8, transition: "background 0.5s" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.white }} />
        <span style={{ fontSize: 10, letterSpacing: 3, color: C.darkBg, fontFamily: "sans-serif", fontWeight: 700 }}>
          {callState === "connecting" ? "VERBINDEN…" : "ANONIEM GESPREK ACTIEF"}
        </span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around", padding: "20px 24px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", margin: "0 auto 14px", background: `radial-gradient(circle, ${C.hotPink}40, ${C.darkBg})`, border: `3px solid ${C.hotPink}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, boxShadow: `0 0 30px ${C.hotPink}40` }}>?</div>
          <h2 style={{ fontSize: 22, color: C.white, fontFamily: "Georgia, serif", fontWeight: 700, margin: "0 0 4px" }}>{matchedUser?.naam}, {matchedUser?.leeftijd}</h2>
          <p style={{ fontSize: 11, color: `${C.cream}70`, fontStyle: "italic", margin: 0, fontFamily: "Georgia, serif" }}>Nummers verborgen voor beiden</p>
        </div>

        <Border color={C.yellow} style={{ padding: "12px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 34, color: C.yellow, fontFamily: "monospace", fontWeight: 700, letterSpacing: 3, textShadow: `0 0 20px ${C.yellow}60` }}>{fmt(secs)}</div>
          <div style={{ fontSize: 10, color: `${C.yellow}80`, fontFamily: "sans-serif", letterSpacing: 2 }}>{Math.max(0, 600 - secs)}S RESTEREND</div>
        </Border>

        <div style={{ display: "flex", gap: 3, alignItems: "center", height: 30 }}>
          {wave.map((h, i) => (
            <div key={i} style={{ width: 3, height: h * 2.5, borderRadius: 2, background: i % 3 === 0 ? C.cyan : i % 3 === 1 ? C.hotPink : C.yellow, transition: "height 0.3s ease", opacity: callState === "active" ? 0.8 : 0.2 }} />
          ))}
        </div>

        <div style={{ width: "100%", background: `${C.purple}30`, border: `2px solid ${C.purple}`, borderRadius: 2, padding: "14px" }}>
          <div style={{ fontSize: 9, letterSpacing: 3, color: C.cyan, fontFamily: "sans-serif", marginBottom: 6, fontWeight: 700 }}>GESPREKSSTARTER</div>
          <p style={{ fontSize: 13, color: C.cream, fontStyle: "italic", margin: 0, fontFamily: "Georgia, serif", lineHeight: 1.6 }}>
            "Wat is het mooiste moment dat je ooit hebt meegemaakt op reis?"
          </p>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button onClick={handleMute} style={{ width: 52, height: 52, borderRadius: "50%", background: muted ? `${C.hotPink}30` : `${C.white}10`, border: `2px solid ${muted ? C.hotPink : C.white + "30"}`, fontSize: 20, cursor: "pointer" }}>{muted ? "🔇" : "🎙️"}</button>
          <button onClick={handleHangUp} style={{ width: 68, height: 68, borderRadius: "50%", background: `radial-gradient(circle, #e74c3c, #c0392b)`, border: `3px solid ${C.yellow}`, fontSize: 22, cursor: "pointer", boxShadow: "0 6px 20px rgba(231,76,60,0.5)" }}>✕</button>
          <button style={{ width: 52, height: 52, borderRadius: "50%", background: `${C.white}10`, border: `2px solid ${C.white}30`, fontSize: 20, cursor: "pointer" }}>🔊</button>
        </div>
      </div>
    </div>
  );
}

// ─── AFTER CALL SCREEN ───────────────────────────────────────────────────────
function AfterCallScreen({ matchedUser, onPrev, onDone }) {
  const [stars, setStars] = useState(0);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: `linear-gradient(180deg, #1a0828, #0f0518)` }}>
      <div style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.hotPink})`, padding: "10px 20px", borderBottom: `2px solid ${C.yellow}`, textAlign: "center" }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: C.yellow, fontFamily: "sans-serif", fontWeight: 700 }}>★ GESPREK AFGEROND ★</div>
      </div>

      <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column" }}>
        <h2 style={{ fontSize: 20, fontFamily: "Georgia, serif", fontWeight: 700, color: C.white, marginBottom: 6 }}>
          Hoe was het met {matchedUser?.naam}?
        </h2>
        <p style={{ fontSize: 13, color: `${C.cream}80`, fontStyle: "italic", fontFamily: "Georgia, serif", marginBottom: 20, lineHeight: 1.6 }}>
          Jouw beoordeling helpt ons betere matches te vinden.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {[1,2,3,4,5].map(i => (
            <span key={i} onClick={() => setStars(i)} style={{
              fontSize: 36, cursor: "pointer",
              color: i <= stars ? C.yellow : `${C.white}20`,
              transition: "color 0.2s, transform 0.15s",
              filter: i <= stars ? `drop-shadow(0 0 6px ${C.yellow})` : "none",
              display: "inline-block",
              transform: i <= stars ? "scale(1.1)" : "scale(1)",
            }}>★</span>
          ))}
        </div>

        <Border color={C.cyan} style={{ padding: "14px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 11, fontFamily: "sans-serif" }}>
            <span style={{ color: `${C.cream}99` }}>Naar videogesprek</span>
            <span style={{ color: C.cyan, fontWeight: 700 }}>1 / 3</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: `${C.white}10`, marginBottom: 8 }}>
            <div style={{ width: "33%", height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${C.cyan}, ${C.yellow})` }} />
          </div>
          <div style={{ fontSize: 10, color: `${C.cyan}80`, fontFamily: "sans-serif" }}>Nog 2 gesprekken voordat video beschikbaar wordt</div>
        </Border>

        <div style={{ flex: 1 }} />
        <div style={{ textAlign: "center", fontSize: 18, opacity: 0.4, letterSpacing: 4, marginBottom: 16 }}>🌸 🌺 🌸</div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onPrev} style={{ flex: 1, padding: "12px", background: "transparent", border: `2px solid ${C.white}25`, borderRadius: 2, color: `${C.white}60`, fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif" }}>← Terug</button>
          <button onClick={onDone} style={{ flex: 3, padding: "12px", background: `linear-gradient(135deg, ${C.hotPink}, ${C.purple})`, border: `2px solid ${C.yellow}`, borderRadius: 2, color: C.yellow, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif", letterSpacing: 1, boxShadow: `0 4px 16px ${C.hotPink}50` }}>OPSLAAN ★</button>
        </div>
      </div>
    </div>
  );
}

// ─── INBOX SCREEN ────────────────────────────────────────────────────────────
function InboxScreen({ user }) {
  const [conversations, setConversations] = useState([]);
  const [activeMatchId, setActiveMatchId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, [user]);

  useEffect(() => {
    if (!activeMatchId) return;
    loadMessages(activeMatchId);

    if (!hasSupabaseConfig || !supabase) return;

    // Realtime subscription voor nieuwe berichten
    const channel = supabase
      .channel(`messages:${activeMatchId}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "messages",
        filter: `match_id=eq.${activeMatchId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [activeMatchId]);

  const loadConversations = async () => {
    setLoading(true);
    if (!hasSupabaseConfig || !supabase) {
      const demoConversations = DEMO_MATCHES.map((match) => {
        const other = DEMO_PROFILES.find(p => p.id === match.user_b);
        const messages = readJson(`lhc-messages:${match.id}`, DEMO_MESSAGES[match.id] ?? []);
        return {
          ...match,
          other,
          lastMsg: messages.at(-1) ?? null,
        };
      });
      setConversations(demoConversations);
      setLoading(false);
      return;
    }

    const { data: matches } = await supabase
      .from("matches")
      .select(`
        id, created_at,
        user_a, user_b,
        profile_a:profiles!matches_user_a_fkey(id, naam, leeftijd, tags),
        profile_b:profiles!matches_user_b_fkey(id, naam, leeftijd, tags)
      `)
      .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);

    if (!matches) { setLoading(false); return; }

    // Laad het laatste bericht per match
    const enriched = await Promise.all(matches.map(async (m) => {
      const other = m.user_a === user.id ? m.profile_b : m.profile_a;
      const { data: lastMsg } = await supabase
        .from("messages")
        .select("content, created_at")
        .eq("match_id", m.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      return { ...m, other, lastMsg };
    }));

    setConversations(enriched);
    setLoading(false);
  };

  const loadMessages = async (matchId) => {
    if (!hasSupabaseConfig || !supabase) {
      setMessages(readJson(`lhc-messages:${matchId}`, DEMO_MESSAGES[matchId] ?? []));
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*, sender:profiles!messages_sender_id_fkey(naam)")
      .eq("match_id", matchId)
      .order("created_at");
    if (error) {
      setMessages(readJson(`lhc-messages:${matchId}`, DEMO_MESSAGES[matchId] ?? []));
      return;
    }
    setMessages(data ?? []);
  };

  const sendMessage = async () => {
    if (!msg.trim() || !activeMatchId) return;
    const content = msg.trim();
    setMsg("");

    if (!hasSupabaseConfig || !supabase) {
      const newMessage = {
        id: `demo-message-${Date.now()}`,
        match_id: activeMatchId,
        sender_id: user.id,
        content,
        created_at: new Date().toISOString(),
      };
      const nextMessages = [...messages, newMessage];
      setMessages(nextMessages);
      writeJson(`lhc-messages:${activeMatchId}`, nextMessages);
      setConversations(prev => prev.map(conv =>
        conv.id === activeMatchId ? { ...conv, lastMsg: newMessage } : conv
      ));
      return;
    }

    const { error } = await supabase
      .from("messages")
      .insert({ match_id: activeMatchId, sender_id: user.id, content });

    if (error) {
      const newMessage = {
        id: `local-message-${Date.now()}`,
        match_id: activeMatchId,
        sender_id: user.id,
        content,
        created_at: new Date().toISOString(),
      };
      const nextMessages = [...messages, newMessage];
      setMessages(nextMessages);
      writeJson(`lhc-messages:${activeMatchId}`, nextMessages);
      setConversations(prev => prev.map(conv =>
        conv.id === activeMatchId ? { ...conv, lastMsg: newMessage } : conv
      ));
    }
  };

  const activeConv = conversations.find(c => c.id === activeMatchId);

  if (activeMatchId && activeConv) {
    const pColor = colorFor(activeConv.other?.id);
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: `linear-gradient(180deg, #1a0828, #0f0518)` }}>
        <div style={{ background: `linear-gradient(135deg, ${pColor}40, ${C.darkBg})`, padding: "10px 16px", borderBottom: `2px solid ${pColor}`, display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setActiveMatchId(null)} style={{ background: "transparent", border: "none", color: `${C.white}70`, fontSize: 18, cursor: "pointer", padding: 0 }}>←</button>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${pColor}30`, border: `2px solid ${pColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>?</div>
          <div>
            <div style={{ fontSize: 14, color: C.white, fontFamily: "Georgia, serif", fontWeight: 700 }}>{activeConv.other?.naam}, {activeConv.other?.leeftijd}</div>
            <div style={{ fontSize: 9, color: `${pColor}aa`, fontFamily: "sans-serif", letterSpacing: 1 }}>Match</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <button style={{ background: `${C.green}20`, border: `1px solid ${C.green}`, borderRadius: 20, padding: "4px 10px", fontSize: 10, color: C.green, cursor: "pointer", fontFamily: "sans-serif" }}>☎ Bel</button>
          </div>
        </div>

        <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.sender_id === user.id ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "75%", padding: "10px 14px",
                borderRadius: m.sender_id === user.id ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: m.sender_id === user.id ? `linear-gradient(135deg, ${C.hotPink}, ${C.magenta})` : `${pColor}20`,
                border: m.sender_id === user.id ? "none" : `1px solid ${pColor}40`,
                color: C.cream, fontSize: 13, fontFamily: "Georgia, serif", lineHeight: 1.5,
              }}>{m.content}</div>
            </div>
          ))}
          {messages.length === 0 && (
            <p style={{ textAlign: "center", color: `${C.cream}40`, fontStyle: "italic", fontFamily: "Georgia, serif", marginTop: 40 }}>
              Nog geen berichten. Stuur een eerste berichtje! 🌸
            </p>
          )}
        </div>

        <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.white}15`, display: "flex", gap: 8, alignItems: "center" }}>
          <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Schrijf een berichtje…" style={{ flex: 1, background: `${C.white}08`, border: `1px solid ${C.white}20`, borderRadius: 20, padding: "10px 16px", color: C.cream, fontSize: 13, fontFamily: "Georgia, serif", outline: "none" }} />
          <button onClick={sendMessage} style={{ width: 40, height: 40, borderRadius: "50%", background: msg.trim() ? `linear-gradient(135deg, ${C.hotPink}, ${C.magenta})` : `${C.white}10`, border: "none", color: C.white, fontSize: 16, cursor: "pointer" }}>→</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: `linear-gradient(180deg, #1a0828, #0f0518)` }}>
      <div style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.hotPink})`, padding: "10px 20px", borderBottom: `2px solid ${C.yellow}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: C.yellow, fontFamily: "sans-serif", fontWeight: 700 }}>BERICHTEN</div>
          <div style={{ fontSize: 14, color: C.white, fontFamily: "Georgia, serif", fontWeight: 700 }}>Jouw gesprekken</div>
        </div>
        {conversations.length > 0 && (
          <div style={{ background: `${C.hotPink}30`, border: `1px solid ${C.hotPink}`, borderRadius: 10, padding: "2px 8px", fontSize: 10, color: C.hotPink, fontFamily: "sans-serif" }}>
            {conversations.length} match{conversations.length !== 1 ? "es" : ""}
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: `${C.white}40`, fontFamily: "Georgia, serif", fontStyle: "italic" }}>Laden…</div>
        ) : conversations.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌸</div>
            <p style={{ color: `${C.cream}50`, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 14 }}>
              Nog geen matches. Ga naar Ontdek en toon interesse!
            </p>
          </div>
        ) : (
          conversations.map((c, i) => {
            const pColor = colorFor(c.other?.id);
            return (
              <div key={i} onClick={() => setActiveMatchId(c.id)} style={{ padding: "14px 16px", borderBottom: `1px solid ${C.white}08`, display: "flex", gap: 12, alignItems: "center", cursor: "pointer", transition: "background 0.2s" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", flexShrink: 0, background: `${pColor}25`, border: `2px solid ${pColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>?</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 14, color: C.white, fontFamily: "Georgia, serif" }}>{c.other?.naam}, {c.other?.leeftijd}</span>
                    <span style={{ fontSize: 10, color: `${C.white}40`, fontFamily: "sans-serif" }}>
                      {c.lastMsg ? new Date(c.lastMsg.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" }) : "Nieuw"}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: `${C.white}50`, fontFamily: "Georgia, serif", fontStyle: "italic", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    {c.lastMsg?.content ?? "Nog geen berichten — stuur een berichtje! ✨"}
                  </div>
                </div>
                <div style={{ color: `${C.white}30`, fontSize: 16 }}>›</div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.white}10`, textAlign: "center" }}>
        <p style={{ fontSize: 11, color: `${C.cream}40`, fontStyle: "italic", fontFamily: "Georgia, serif", margin: 0 }}>
          Foto's worden zichtbaar na 3 gesprekken ♥
        </p>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

const NAV_TABS = [
  { id: "ontdek",  label: "Ontdek",    icon: "🌺" },
  { id: "inbox",   label: "Berichten", icon: "♥" },
  { id: "profiel", label: "Profiel",   icon: "✦" },
];

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = laden, null = uitgelogd
  const [screen, setScreen] = useState("splash");    // splash | profiel | discover | match | call | review
  const [activeTab, setActiveTab] = useState("ontdek");
  const [activeMatch, setActiveMatch] = useState(null);
  const [matchedUser, setMatchedUser] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(1);
  const [prevScreen, setPrevScreen] = useState(null);

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) {
      setSession({ user: DEMO_USER, demo: true });
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user && hasSupabaseConfig) {
      initTwilioDevice().catch(console.warn);
    }
  }, [session]);

  const navigate = (to, dir = 1) => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setPrevScreen(screen);
      setScreen(to);
      setAnimating(false);
    }, 250);
  };

  const handleMatch = (match, user) => {
    setActiveMatch(match);
    setMatchedUser(user);
    navigate("match");
  };

  const showBottomNav = session && !["splash", "profiel-setup", "match", "call"].includes(screen);

  const renderContent = () => {
    if (session === undefined) return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: C.darkBg }}>
        <div style={{ fontSize: 40, opacity: 0.3 }}>♥</div>
      </div>
    );

    if (!session) return <AuthScreen onDemo={() => setSession({ user: DEMO_USER, demo: true })} />;

    if (showBottomNav) {
      if (activeTab === "inbox")   return <InboxScreen user={session.user} />;
      if (activeTab === "profiel") return <ProfileScreen user={session.user} onNext={() => setActiveTab("ontdek")} />;
    }

    switch (screen) {
      case "splash":        return <SplashScreen onNext={() => navigate("profiel-setup")} />;
      case "profiel-setup": return <ProfileScreen user={session.user} onNext={() => navigate("discover")} />;
      case "discover":      return <DiscoverScreen user={session.user} onMatch={handleMatch} />;
      case "match":         return <MatchScreen match={activeMatch} matchedUser={matchedUser} onCall={() => navigate("call")} onLater={() => navigate("discover")} />;
      case "call":          return <CallScreen match={activeMatch} matchedUser={matchedUser} user={session.user} onEnd={() => navigate("review")} />;
      case "review":        return <AfterCallScreen matchedUser={matchedUser} onPrev={() => navigate("call", -1)} onDone={() => { navigate("discover"); setActiveTab("ontdek"); }} />;
      default:              return <DiscoverScreen user={session.user} onMatch={handleMatch} />;
    }
  };

  return (
    <div style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: `
        radial-gradient(ellipse at 16% 16%, ${C.cyan}24, transparent 42%),
        radial-gradient(ellipse at 84% 18%, ${C.yellow}18, transparent 38%),
        radial-gradient(ellipse at 70% 86%, ${C.green}1f, transparent 42%),
        radial-gradient(ellipse at 48% 52%, ${C.hotPink}18, transparent 58%),
        #0a0010
      `,
      fontFamily: "Georgia, serif", padding: "clamp(8px, 2.5vw, 20px) 0",
    }}>
      <div style={{
        width: "min(375px, calc(100vw - 20px))",
        height: "min(750px, calc(100dvh - 50px))",
        maxHeight: 750,
        minHeight: "min(620px, calc(100dvh - 24px))",
        borderRadius: "clamp(22px, 8vw, 36px)",
        border: `2px solid ${C.yellow}50`, overflow: "hidden",
        boxShadow: `0 0 60px ${C.hotPink}30, 0 0 120px ${C.purple}20, 0 40px 80px rgba(0,0,0,0.5)`,
        display: "flex", flexDirection: "column", background: C.darkBg,
      }}>
        {/* Status bar */}
        <div style={{ padding: "10px 20px 6px", display: "flex", justifyContent: "space-between", fontSize: 10, color: `${C.white}60`, fontFamily: "sans-serif", flexShrink: 0, background: C.darkBg }}>
          <span>9:41</span>
          <span style={{ color: C.yellow, fontWeight: 700, letterSpacing: 2 }}>♥ LHC</span>
          <span>{session?.demo ? "DEMO" : session ? "●●●" : "···"}</span>
        </div>

        {/* Scherm met slide-animatie */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            transform: animating ? `translateX(${direction * -100}%)` : "translateX(0)",
            transition: animating ? "transform 0.25s ease-in-out" : "none",
          }}>
            {renderContent()}
          </div>
        </div>

        {/* Bottom navigation */}
        {showBottomNav && (
          <div style={{ display: "flex", borderTop: `1px solid ${C.white}15`, background: `${C.darkBg}f0`, flexShrink: 0 }}>
            {NAV_TABS.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "10px 0 8px", background: "transparent", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", position: "relative" }}>
                  <div style={{ fontSize: 20, filter: isActive ? `drop-shadow(0 0 6px ${C.hotPink})` : "none", transform: isActive ? "scale(1.2)" : "scale(1)", transition: "filter 0.2s, transform 0.2s" }}>{tab.icon}</div>
                  <span style={{ fontSize: 9, letterSpacing: 1, fontFamily: "sans-serif", color: isActive ? C.yellow : `${C.white}40`, fontWeight: isActive ? 700 : 400, textTransform: "uppercase", transition: "color 0.2s" }}>{tab.label}</span>
                  {isActive && <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 20, height: 2, borderRadius: 1, background: C.yellow }} />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p style={{ marginTop: 14, fontSize: 11, color: `${C.white}40`, fontFamily: "sans-serif" }}>
        lonelyheartsclub.nl
      </p>
    </div>
  );
}
