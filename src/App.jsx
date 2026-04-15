import { useState, useEffect } from "react";

const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const C = {
  bg: "#F8F3EC",
  bgAlt: "#F2E9DD",
  bgDark: "#161311",
  card: "rgba(255,255,255,0.72)",
  cardStrong: "#FFFDF9",
  terra: "#B84E2A",
  terraDeep: "#8F3418",
  bronze: "#9B7A2F",
  gold: "#C9A24A",
  text: "#1E1915",
  textMid: "#5E5147",
  textDim: "#8E8075",
  border: "rgba(30,25,21,0.12)",
  green: "#2D6A4F",
  white: "#FFFFFF",
};

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'Inter', sans-serif";

const panel = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.72))",
  backdropFilter: "blur(18px)",
  border: `1px solid ${C.border}`,
  boxShadow: "0 18px 60px rgba(30,25,21,0.08)",
};

const softShadow = "0 12px 30px rgba(30,25,21,0.08)";

function LHCLogo({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 440 440" role="img">
      <title>Lonely Hearts Club</title>
      <defs>
        <radialGradient id="rg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#D66B41" />
          <stop offset="100%" stopColor="#A94222" />
        </radialGradient>
      </defs>
      <circle cx="220" cy="220" r="218" fill="url(#rg)" />
      <circle cx="220" cy="220" r="203" fill="none" stroke="#FAF7F2" strokeWidth="2.5" />
      <circle cx="220" cy="220" r="188" fill="#FAF7F2" />
      <circle cx="220" cy="220" r="173" fill="none" stroke="#C4522A" strokeWidth="1.5" />
      <g fill="#FAF7F2">
        <circle cx="220" cy="5" r="4" /><circle cx="220" cy="435" r="4" />
        <circle cx="5" cy="220" r="4" /><circle cx="435" cy="220" r="4" />
        <circle cx="67" cy="67" r="3" /><circle cx="373" cy="67" r="3" />
        <circle cx="67" cy="373" r="3" /><circle cx="373" cy="373" r="3" />
      </g>
      <path d="M220,84 C217,78 208,78 208,87 C208,96 220,106 220,106 C220,106 232,96 232,87 C232,78 223,78 220,84 Z" fill="#C4522A" />
      <text x="220" y="126" textAnchor="middle" fontFamily={sans} fontSize="13" fontWeight="700" fill="#C4522A" letterSpacing="7">THE</text>
      <line x1="168" y1="134" x2="272" y2="134" stroke="#C4522A" strokeWidth="0.8" opacity="0.45" />
      <text x="220" y="181" textAnchor="middle" fontFamily={serif} fontSize="46" fontWeight="700" fill="#1C1814" letterSpacing="1">LONELY</text>
      <text x="220" y="234" textAnchor="middle" fontFamily={serif} fontSize="46" fontWeight="700" fill="#C4522A" letterSpacing="1">HEARTS</text>
      <text x="220" y="287" textAnchor="middle" fontFamily={serif} fontSize="46" fontWeight="700" fill="#1C1814" letterSpacing="1">CLUB</text>
      <text x="220" y="340" textAnchor="middle" fontFamily={sans} fontSize="11" fontWeight="600" fill="#8B6914" letterSpacing="3">DATEN ZONDER FOTO'S</text>
    </svg>
  );
}

const Rule = ({ color = C.border }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
    <div style={{ flex: 1, height: 1, background: color }} />
    <span style={{ color: C.textDim, fontSize: 8, letterSpacing: 4 }}>✦</span>
    <div style={{ flex: 1, height: 1, background: color }} />
  </div>
);

const PrimaryBtn = ({ onClick, children, style = {} }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%",
      padding: "14px 20px",
      background: `linear-gradient(180deg, ${C.terra}, ${C.terraDeep})`,
      border: "none",
      borderRadius: 999,
      color: C.white,
      fontSize: 12,
      fontFamily: sans,
      fontWeight: 700,
      letterSpacing: 2,
      textTransform: "uppercase",
      cursor: "pointer",
      boxShadow: "0 10px 24px rgba(184, 78, 42, 0.25)",
      transition: "transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease",
      ...style,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-1px)";
      e.currentTarget.style.boxShadow = "0 14px 28px rgba(184, 78, 42, 0.32)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0px)";
      e.currentTarget.style.boxShadow = "0 10px 24px rgba(184, 78, 42, 0.25)";
    }}
  >
    {children}
  </button>
);
