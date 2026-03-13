import { useState } from "react"

function IngredientFilter({ onFilter }) {
  const [input, setInput] = useState("")
  const [ingredients, setIngredients] = useState([])

  const addIngredient = () => {
    if (input.trim() && !ingredients.includes(input.trim())) {
      const updated = [...ingredients, input.trim()]
      setIngredients(updated)
      setInput("")
      onFilter(updated)
    }
  }

  const removeIngredient = (item) => {
    const updated = ingredients.filter((i) => i !== item)
    setIngredients(updated)
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>🥕 Filter by Ingredient</h3>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. tomato, cheese, egg"
        style={{ padding: "10px", width: "300px", fontSize: "16px" }}
      />
      <button
        onClick={addIngredient}
        style={{ padding: "10px 20px", marginLeft: "10px", fontSize: "16px" }}
      >
        Add
      </button>

      <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {ingredients.map((item) => (
          <span
            key={item}
            style={{
              background: "#f0f0f0",
              padding: "5px 10px",
              borderRadius: "20px",
              fontSize: "14px",
              cursor: "pointer"
            }}
            onClick={() => removeIngredient(item)}
          >
            {item} ✕
          </span>
        ))}
      </div>
    </div>
  )
}

export default IngredientFilter