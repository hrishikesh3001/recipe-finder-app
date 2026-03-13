import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const injectStyles = () => {
  if (document.getElementById("intro-styles")) return
  const style = document.createElement("style")
  style.id = "intro-styles"
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Raleway:wght@200;300;400;600&display=swap');

    @keyframes glow-pulse {
      0%, 100% { text-shadow: 0 0 20px #ff9800aa, 0 0 60px #ff980055; }
      50%       { text-shadow: 0 0 40px #ff9800ff, 0 0 100px #ff980088; }
    }
    @keyframes letter-drop {
      0%   { opacity: 0; transform: translateY(-40px) rotateX(90deg); }
      60%  { transform: translateY(4px) rotateX(-5deg); }
      100% { opacity: 1; transform: translateY(0) rotateX(0deg); }
    }
    @keyframes line-expand {
      0%   { width: 0; opacity: 0; }
      100% { width: 120px; opacity: 1; }
    }
    @keyframes fade-up-out {
      0%   { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-30px); }
    }
    @keyframes page-fade-in {
      0%   { opacity: 0; }
      100% { opacity: 1; }
    }
    @keyframes card-rise {
      0%   { opacity: 0; transform: translateY(40px) scale(0.95); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes scanline {
      0%   { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    .letter {
      display: inline-block;
      opacity: 0;
      animation: letter-drop 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .option-card:hover {
      border-color: #ff9800 !important;
      background: rgba(255, 152, 0, 0.06) !important;
    }
    .option-card:hover .card-arrow {
      transform: translateX(6px);
    }
  `
  document.head.appendChild(style)
}

const TITLE = "Recipe Finder"

export default function Intro() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState("intro")
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showLine, setShowLine] = useState(false)

  useEffect(() => {
    injectStyles()
    const t1 = setTimeout(() => setShowSubtitle(true), 1400)
    const t2 = setTimeout(() => setShowLine(true), 1600)
    const t3 = setTimeout(() => setPhase("transition"), 3500)
    const t4 = setTimeout(() => setPhase("landing"), 4400)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [])

  const handleChoice = (type) => {
    navigate(`/home?mode=${type}`)
  }

  if (phase === "intro" || phase === "transition") {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#080808",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        overflow: "hidden", zIndex: 999,
        animation: phase === "transition" ? "fade-up-out 0.9s ease forwards" : "none",
      }}>

        {/* Scanline sweep */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: "2px",
          background: "linear-gradient(90deg, transparent, #ff980033, transparent)",
          animation: "scanline 3s linear infinite", pointerEvents: "none",
        }} />

        {/* Glow behind title */}
        <div style={{
          position: "absolute", width: "600px", height: "300px",
          background: "radial-gradient(ellipse, #ff980018 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Title letters */}
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(42px, 7vw, 80px)",
          fontWeight: 900, letterSpacing: "12px", color: "#f5f0e8",
          textTransform: "uppercase", animation: "glow-pulse 2s ease-in-out infinite",
          userSelect: "none", perspective: "600px",
        }}>
          {TITLE.split("").map((char, i) => (
            <span key={i} className="letter" style={{
              animationDelay: `${i * 80}ms`,
              marginRight: char === " " ? "0.4em" : "0",
            }}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>

        {/* Line */}
        <div style={{
          marginTop: "16px", height: "1px",
          background: "linear-gradient(90deg, transparent, #ff9800, transparent)",
          width: showLine ? "120px" : "0px", opacity: showLine ? 1 : 0,
          transition: "width 0.6s ease, opacity 0.6s ease",
        }} />

        {/* Subtitle */}
        <div style={{
          marginTop: "14px", fontFamily: "'Raleway', sans-serif",
          fontWeight: 300, fontSize: "clamp(11px, 1.4vw, 14px)",
          letterSpacing: "6px", color: "#ff9800cc", textTransform: "uppercase",
          opacity: showSubtitle ? 1 : 0,
          transform: showSubtitle ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.8s ease, transform 0.8s ease", userSelect: "none",
        }}>
          Discover · Cook · Savour
        </div>

      </div>
    )
  }

  // Landing phase
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#080808",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      overflow: "hidden", animation: "page-fade-in 0.8s ease forwards", zIndex: 999,
    }}>

      {/* Glow */}
      <div style={{
        position: "absolute", width: "700px", height: "400px",
        background: "radial-gradient(ellipse, #ff980012 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Title — smaller */}
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(22px, 3vw, 36px)",
        fontWeight: 700, letterSpacing: "8px", color: "#f5f0e8",
        textTransform: "uppercase", marginBottom: "8px", userSelect: "none",
      }}>
        Recipe Finder
      </div>

      {/* Divider */}
      <div style={{
        width: "80px", height: "1px",
        background: "linear-gradient(90deg, transparent, #ff9800, transparent)",
        marginBottom: "10px",
      }} />

      {/* Subtitle */}
      <div style={{
        fontFamily: "'Raleway', sans-serif", fontWeight: 300,
        fontSize: "12px", letterSpacing: "5px", color: "#ff9800aa",
        textTransform: "uppercase", marginBottom: "56px",
        animation: "page-fade-in 0.8s ease 0.1s both",
      }}>
        How would you like to start?
      </div>

      {/* Cards */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center", padding: "0 24px" }}>

        <div className="option-card" onClick={() => handleChoice("ingredients")} style={{
          width: "260px", padding: "36px 28px",
          background: "rgba(255,255,255,0.03)", border: "1px solid #2a2a2a",
          borderRadius: "16px", cursor: "pointer", transition: "all 0.3s ease",
          animation: "card-rise 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both",
        }}>
          <div style={{ fontSize: "36px", marginBottom: "16px" }}>🥕</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, color: "#f5f0e8", marginBottom: "10px", letterSpacing: "1px" }}>
            By Ingredients
          </div>
          <div style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 300, fontSize: "13px", color: "#888", lineHeight: "1.7", marginBottom: "24px" }}>
            Tell us what's in your kitchen and we'll find what you can cook.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Raleway', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "3px", color: "#ff9800", textTransform: "uppercase" }}>
            Explore <span className="card-arrow" style={{ transition: "transform 0.2s ease" }}>→</span>
          </div>
        </div>

        <div className="option-card" onClick={() => handleChoice("search")} style={{
          width: "260px", padding: "36px 28px",
          background: "rgba(255,255,255,0.03)", border: "1px solid #2a2a2a",
          borderRadius: "16px", cursor: "pointer", transition: "all 0.3s ease",
          animation: "card-rise 0.6s cubic-bezier(0.22,1,0.36,1) 0.35s both",
        }}>
          <div style={{ fontSize: "36px", marginBottom: "16px" }}>🔍</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, color: "#f5f0e8", marginBottom: "10px", letterSpacing: "1px" }}>
            By Recipe Name
          </div>
          <div style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 300, fontSize: "13px", color: "#888", lineHeight: "1.7", marginBottom: "24px" }}>
            Already craving something? Search for it directly and get cooking.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Raleway', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "3px", color: "#ff9800", textTransform: "uppercase" }}>
            Search <span className="card-arrow" style={{ transition: "transform 0.2s ease" }}>→</span>
          </div>
        </div>

      </div>

      {/* Skip */}
      <div onClick={() => navigate("/home")} style={{
        position: "absolute", bottom: "32px",
        fontFamily: "'Raleway', sans-serif", fontSize: "11px",
        letterSpacing: "3px", color: "#333", textTransform: "uppercase",
        cursor: "pointer", transition: "color 0.2s",
        animation: "page-fade-in 1s ease 0.5s both",
      }}
        onMouseEnter={(e) => e.target.style.color = "#666"}
        onMouseLeave={(e) => e.target.style.color = "#333"}
      >
        Skip →
      </div>

    </div>
  )
}