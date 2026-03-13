import { useState } from "react"

function IngredientFilter({ onFilter, onDietChange, onCuisineChange }) {
  const [input, setInput] = useState("")
  const [ingredients, setIngredients] = useState([])
  const [diet, setDiet] = useState("all")
  const [cuisine, setCuisine] = useState("all")

  const addIngredient = () => {
    const trimmed = input.trim().toLowerCase()
    if (trimmed && !ingredients.includes(trimmed)) {
      const updated = [...ingredients, trimmed]
      setIngredients(updated)
      setInput("")
      onFilter(updated)
    }
  }

  const removeIngredient = (item) => {
    const updated = ingredients.filter((i) => i !== item)
    setIngredients(updated)
    onFilter(updated)
  }

  const handleDiet = (value) => {
    setDiet(value)
    onDietChange(value)
  }

  const handleCuisine = (value) => {
    setCuisine(value)
    onCuisineChange(value)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addIngredient()
  }

  return (
    <div style={{
      width: "280px",
      minHeight: "100vh",
      background: "#1a1a1a",
      padding: "24px 16px",
      borderRight: "1px solid #2a2a2a",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      position: "fixed",
      top: 0,
      left: 0,
      overflowY: "auto"
    }}>
      <h1 style={{ fontSize: "22px", color: "#ff9800", fontWeight: "bold" }}>
        🍳 Recipe Finder
      </h1>

      <div>
        <h3 style={{ marginBottom: "10px", fontSize: "14px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px" }}>
          Your Ingredients
        </h3>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. tomato, egg..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #333",
              background: "#2a2a2a",
              color: "#f0f0f0",
              fontSize: "14px",
              outline: "none"
            }}
          />
          <button
            onClick={addIngredient}
            style={{
              padding: "10px 14px",
              background: "#ff9800",
              border: "none",
              borderRadius: "8px",
              color: "#000",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            +
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
          {ingredients.map((item) => (
            <span
              key={item}
              onClick={() => removeIngredient(item)}
              style={{
                background: "#2a2a2a",
                border: "1px solid #ff9800",
                color: "#ff9800",
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              {item} <span style={{ fontSize: "10px" }}>✕</span>
            </span>
          ))}
          {ingredients.length === 0 && (
            <p style={{ fontSize: "12px", color: "#555" }}>
              Add ingredients to find recipes
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: "10px", fontSize: "14px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px" }}>
          Cuisine
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { value: "all", label: "🌐 All Cuisines" },
            { value: "indian", label: "🇮🇳 Indian" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleCuisine(option.value)}
              style={{
                padding: "10px",
                background: cuisine === option.value ? "#ff9800" : "#2a2a2a",
                color: cuisine === option.value ? "#000" : "#f0f0f0",
                border: "1px solid #333",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: cuisine === option.value ? "bold" : "normal"
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: "10px", fontSize: "14px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px" }}>
          Diet
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { value: "all", label: "🍽️ All Allowed" },
            { value: "vegetarian", label: "🥦 Vegetarian Only" },
            { value: "chicken", label: "🍗 Chicken & Eggs" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleDiet(option.value)}
              style={{
                padding: "10px",
                background: diet === option.value ? "#4caf50" : "#2a2a2a",
                color: diet === option.value ? "#000" : "#f0f0f0",
                border: "1px solid #333",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: diet === option.value ? "bold" : "normal"
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default IngredientFilter