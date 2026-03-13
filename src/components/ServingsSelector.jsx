import { useState } from "react"

function ServingsSelector({ onChange }) {
  const [servings, setServings] = useState(2)
  const [animate, setAnimate] = useState(null)

  const updateServings = (val) => {
    const newVal = Math.min(12, Math.max(1, val))
    setServings(newVal)
    setAnimate(val > servings ? "add" : "remove")
    setTimeout(() => setAnimate(null), 300)
    onChange(newVal)
  }

  const renderPeople = () => {
    if (servings <= 4) {
      return Array.from({ length: servings }).map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: i === servings - 1 && animate === "add" ? "28px" : "22px",
            transition: "font-size 0.3s ease",
            display: "inline-block",
          }}
        >
          👤
        </span>
      ))
    }

    return (
      <div style={{ position: "relative", display: "inline-block" }}>
        <span style={{ fontSize: "28px" }}>👤</span>
        <span style={{
          position: "absolute",
          top: "-8px",
          right: "-10px",
          background: "#ff9800",
          color: "#000",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          fontSize: "11px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {servings}
        </span>
      </div>
    )
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
      background: "#1e1e1e",
      padding: "12px 20px",
      borderRadius: "12px",
      border: "1px solid #2a2a2a",
      minWidth: "160px"
    }}>
      <span style={{ fontSize: "12px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px" }}>
        Servings
      </span>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        <button
          onClick={() => updateServings(servings - 1)}
          disabled={servings === 1}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            border: "none",
            background: servings === 1 ? "#2a2a2a" : "#ff9800",
            color: servings === 1 ? "#555" : "#000",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: servings === 1 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s"
          }}
        >
          −
        </button>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
          minWidth: "80px",
          justifyContent: "center",
          minHeight: "36px"
        }}>
          {renderPeople()}
        </div>

        <button
          onClick={() => updateServings(servings + 1)}
          disabled={servings === 12}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            border: "none",
            background: servings === 12 ? "#2a2a2a" : "#ff9800",
            color: servings === 12 ? "#555" : "#000",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: servings === 12 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s"
          }}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default ServingsSelector