import { useState } from "react";
import { hasSupabaseConfig, supabase } from "../lib/supabase.js";

const C = {
  hotPink: "#e8126a", magenta: "#c0116a", cyan: "#00c8d4",
  yellow: "#ffd700", purple: "#7b2d8b", green: "#00a651",
  cream: "#fff8e7", darkBg: "#1a0828", white: "#ffffff",
};

export default function AuthScreen({ onDemo }) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("input"); // input | sent | error
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!hasSupabaseConfig || !supabase) {
      setError("Supabase is nog niet gekoppeld. Start de demo of vul .env.local.");
      return;
    }

    if (!email.includes("@")) {
      setError("Vul een geldig e-mailadres in.");
      return;
    }
    setError("");
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.href },
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      setStep("sent");
    }
  };

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      background: `
        radial-gradient(ellipse at 20% 80%, ${C.purple}60 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, ${C.hotPink}50 0%, transparent 50%),
        radial-gradient(ellipse at 50% 50%, #2a0840 0%, ${C.darkBg} 100%)
      `,
      alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <img src="/lhc-seal.svg" alt="" style={{
        width: 76,
        height: 76,
        marginBottom: 16,
        filter: `drop-shadow(0 0 22px ${C.hotPink})`,
      }} />

      <h1 style={{
        fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 900,
        color: C.yellow, margin: "0 0 4px", textAlign: "center",
        textShadow: `2px 2px 0 ${C.hotPink}`,
      }}>LONELY HEARTS CLUB</h1>

      <p style={{
        fontSize: 12, color: `${C.cream}80`, fontStyle: "italic",
        fontFamily: "Georgia, serif", marginBottom: 32, textAlign: "center",
      }}>Inloggen met je e-mailadres</p>

      {!hasSupabaseConfig ? (
        <div style={{
          border: `2px solid ${C.yellow}`,
          borderRadius: 4, padding: "18px",
          textAlign: "center", background: `${C.yellow}10`,
          width: "100%", boxSizing: "border-box",
        }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>✦</div>
          <p style={{ fontSize: 13, color: C.cream, fontFamily: "Georgia, serif", margin: "0 0 16px", lineHeight: 1.6 }}>
            Live login staat klaar zodra Supabase keys zijn ingevuld.
          </p>
          <button onClick={onDemo} style={{
            width: "100%", padding: "13px",
            background: `linear-gradient(135deg, ${C.hotPink}, ${C.magenta})`,
            border: `2px solid ${C.yellow}`,
            borderRadius: 2, color: C.yellow,
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "Georgia, serif", letterSpacing: 2,
          }}>
            ★ OPEN DEMO ★
          </button>
          {error && (
            <p style={{ fontSize: 11, color: C.hotPink, fontFamily: "sans-serif", margin: "12px 0 0" }}>{error}</p>
          )}
        </div>
      ) : step === "sent" ? (
        <div style={{
          border: `2px solid ${C.green}`,
          borderRadius: 4, padding: "20px",
          textAlign: "center", background: `${C.green}10`,
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📬</div>
          <p style={{ fontSize: 14, color: C.cream, fontFamily: "Georgia, serif", margin: 0, lineHeight: 1.6 }}>
            Check je inbox! We hebben een inloglink gestuurd naar<br />
            <strong style={{ color: C.yellow }}>{email}</strong>
          </p>
          <button onClick={() => setStep("input")} style={{
            marginTop: 16, background: "transparent",
            border: `1px solid ${C.white}30`,
            borderRadius: 2, color: `${C.white}60`,
            fontSize: 12, cursor: "pointer", padding: "6px 14px",
            fontFamily: "Georgia, serif",
          }}>Ander e-mailadres</button>
        </div>
      ) : (
        <>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="jouw@email.nl"
            style={{
              width: "100%", background: `${C.white}08`,
              border: `2px solid ${error ? C.hotPink : C.yellow}50`,
              borderRadius: 2, color: C.cream, fontSize: 16,
              padding: "12px 14px", fontFamily: "Georgia, serif",
              outline: "none", boxSizing: "border-box", marginBottom: 12,
            }}
          />

          {error && (
            <p style={{
              fontSize: 11, color: C.hotPink, fontFamily: "sans-serif",
              marginBottom: 12, margin: "0 0 12px",
            }}>{error}</p>
          )}

          <button onClick={handleSubmit} disabled={loading} style={{
            width: "100%", padding: "14px",
            background: `linear-gradient(135deg, ${C.hotPink}, ${C.magenta})`,
            border: `2px solid ${C.yellow}`,
            borderRadius: 2, color: C.yellow,
            fontSize: 13, fontWeight: 700, cursor: loading ? "default" : "pointer",
            fontFamily: "Georgia, serif",
            letterSpacing: 2, textTransform: "uppercase",
            boxShadow: `0 4px 20px ${C.hotPink}60`,
            opacity: loading ? 0.75 : 1,
          }}>
            {loading ? "VERSTUREN…" : "★ STUUR INLOGLINK ★"}
          </button>

          <button onClick={onDemo} style={{
            width: "100%", padding: "11px",
            marginTop: 10,
            background: `${C.cyan}12`,
            border: `1px solid ${C.cyan}60`,
            borderRadius: 2,
            color: C.cyan,
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "Georgia, serif",
            letterSpacing: 1,
          }}>
            Bekijk eerst de demo
          </button>

          <p style={{
            fontSize: 10, color: `${C.cream}40`, textAlign: "center",
            fontFamily: "sans-serif", marginTop: 20, lineHeight: 1.6,
          }}>
            Geen wachtwoord nodig. We sturen je een magische link.<br />
            Jouw privacy staat voorop — geen foto's vereist.
          </p>
        </>
      )}
    </div>
  );
}
