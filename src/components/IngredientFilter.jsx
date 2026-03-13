import { useState } from "react"

const INGREDIENT_CATEGORIES = {
  "🥦 Vegetables": [
    "tomato", "onion", "garlic", "potato", "spinach", "carrot",
    "capsicum", "cucumber", "broccoli", "cauliflower", "peas",
    "corn", "mushroom", "eggplant", "zucchini", "cabbage",
    "lettuce", "celery", "beetroot", "radish", "green beans"
  ],
  "🧀 Dairy & Eggs": [
    "milk", "cheese", "butter", "eggs", "yogurt", "cream",
    "paneer", "ghee", "curd", "condensed milk", "cream cheese",
    "sour cream", "mozzarella", "parmesan", "whipping cream"
  ],
  "🌾 Grains": [
    "rice", "pasta", "flour", "bread", "oats", "noodles",
    "semolina", "quinoa", "barley", "wheat", "cornmeal",
    "basmati rice", "whole wheat flour", "bread crumbs", "poha"
  ],
  "🌶️ Spices": [
    "cumin", "turmeric", "chilli", "coriander", "garam masala",
    "cardamom", "cinnamon", "pepper", "mustard seeds", "bay leaf",
    "cloves", "nutmeg", "paprika", "oregano", "basil",
    "thyme", "saffron", "fennel seeds", "asafoetida", "curry powder"
  ],
  "🍗 Meat & Seafood": [
    "chicken", "fish", "prawns", "shrimp", "crab",
    "salmon", "tuna", "sardines", "mackerel", "lobster"
  ]
}

const ALL_INGREDIENTS = Object.values(INGREDIENT_CATEGORIES).flat()

function IngredientFilter({ onFilter, onDietChange, onCuisineChange, sidebarOpen }) {
  const [input, setInput] = useState("")
  const [ingredients, setIngredients] = useState([])
  const [diet, setDiet] = useState("all")
  const [cuisine, setCuisine] = useState("indian")
  const [activeCategory, setActiveCategory] = useState(null)
  const [suggestions, setSuggestions] = useState([])

  const addIngredient = (item) => {
    const trimmed = item.trim().toLowerCase()
    if (trimmed && !ingredients.includes(trimmed)) {
      const updated = [...ingredients, trimmed]
      setIngredients(updated)
      onFilter(updated)
    }
    setInput("")
    setSuggestions([])
  }

  const removeIngredient = (item) => {
    const updated = ingredients.filter((i) => i !== item)
    setIngredients(updated)
    onFilter(updated)
  }

  const handleInput = (e) => {
    const val = e.target.value
    setInput(val)
    if (val.trim().length > 0) {
      const filtered = ALL_INGREDIENTS.filter(
        (i) => i.includes(val.toLowerCase()) && !ingredients.includes(i)
      )
      setSuggestions(filtered.slice(0, 6))
    } else {
      setSuggestions([])
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) addIngredient(input)
  }

  const handleDiet = (value) => {
    setDiet(value)
    onDietChange(value)
  }

  const handleCuisine = (value) => {
    setCuisine(value)
    onCuisineChange(value)
  }

  if (!sidebarOpen) return null

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
      overflowY: "auto",
      zIndex: 100,
    }}>
      <h1 style={{ fontSize: "20px", color: "#ff9800", fontWeight: "bold" }}>
        🍳 Recipe Finder
      </h1>

      {/* Ingredient Search */}
      <div>
        <h3 style={{ marginBottom: "10px", fontSize: "13px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px" }}>
          Your Ingredients
        </h3>

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Search ingredient..."
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
              onClick={() => input.trim() && addIngredient(input)}
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

          {/* Dropdown Suggestions */}
          {suggestions.length > 0 && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#2a2a2a",
              border: "1px solid #444",
              borderRadius: "8px",
              zIndex: 200,
              marginTop: "4px",
              overflow: "hidden"
            }}>
              {suggestions.map((s) => (
                <div
                  key={s}
                  onClick={() => addIngredient(s)}
                  style={{
                    padding: "10px 14px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#f0f0f0",
                    borderBottom: "1px solid #333"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#3a3a3a"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div style={{ display: "flex", gap: "6px", marginTop: "12px", flexWrap: "wrap" }}>
          {Object.keys(INGREDIENT_CATEGORIES).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              style={{
                padding: "4px 10px",
                background: activeCategory === cat ? "#ff9800" : "#2a2a2a",
                color: activeCategory === cat ? "#000" : "#aaa",
                border: "1px solid #333",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "12px"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Category Ingredients Grid */}
        {activeCategory && (
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginTop: "10px",
            maxHeight: "150px",
            overflowY: "auto"
          }}>
            {INGREDIENT_CATEGORIES[activeCategory]
              .filter((i) => !ingredients.includes(i))
              .map((item) => (
                <span
                  key={item}
                  onClick={() => addIngredient(item)}
                  style={{
                    background: "#2a2a2a",
                    border: "1px solid #444",
                    color: "#ccc",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#ff9800"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "#444"}
                >
                  + {item}
                </span>
              ))}
          </div>
        )}

        {/* Selected Ingredient Tags */}
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

      {/* Cuisine Filter */}
      <div>
        <h3 style={{ marginBottom: "10px", fontSize: "13px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px" }}>
          Cuisine
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { value: "indian", label: "🇮🇳 Indian" },
            { value: "seafood", label: "🦐 Seafood" },
            { value: "all", label: "🌐 All" },
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

      {/* Diet Filter */}
      <div>
        <h3 style={{ marginBottom: "10px", fontSize: "13px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px" }}>
          Diet
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { value: "all", label: "🍽️ All Allowed" },
            { value: "vegetarian", label: "🥦 Vegetarian Only" },
            { value: "chicken", label: "🍗 Chicken & Eggs" },
            { value: "seafood", label: "🦐 Seafood Only" },
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