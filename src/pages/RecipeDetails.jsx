import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getRecipeById } from "../services/recipeAPI"
import { getRecipeFact } from "../services/factAPI"

function RecipeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [fact, setFact] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRecipeById(id)
      setRecipe(data)
      const recipeFact = await getRecipeFact(data.title)
      setFact(recipeFact)
      setLoading(false)
    }
    fetchData()
  }, [id])

  if (loading) return (
    <div style={{ padding: "40px", color: "#ff9800", fontFamily: "Segoe UI" }}>
      Loading recipe...
    </div>
  )

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f0f",
      color: "#f0f0f0",
      fontFamily: "Segoe UI, sans-serif",
      padding: "40px",
    }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "24px",
          padding: "10px 20px",
          background: "#1e1e1e",
          border: "1px solid #333",
          borderRadius: "8px",
          color: "#f0f0f0",
          cursor: "pointer",
          fontSize: "14px"
        }}
      >
        ← Back
      </button>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "12px", color: "#ff9800" }}>
          {recipe.title}
        </h1>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          {recipe.vegetarian && (
            <span style={{ background: "#1b3a1b", color: "#4caf50", padding: "6px 14px", borderRadius: "20px", fontSize: "13px" }}>
              🥦 Vegetarian
            </span>
          )}
          {recipe.vegan && (
            <span style={{ background: "#1b3a1b", color: "#81c784", padding: "6px 14px", borderRadius: "20px", fontSize: "13px" }}>
              🌱 Vegan
            </span>
          )}
          <span style={{ background: "#2a2a2a", color: "#aaa", padding: "6px 14px", borderRadius: "20px", fontSize: "13px" }}>
            ⏱️ {recipe.readyInMinutes} mins
          </span>
          <span style={{ background: "#2a2a2a", color: "#aaa", padding: "6px 14px", borderRadius: "20px", fontSize: "13px" }}>
            👥 {recipe.servings} servings
          </span>
        </div>

        <img
          src={recipe.image}
          alt={recipe.title}
          style={{ width: "100%", maxWidth: "500px", borderRadius: "16px", marginBottom: "30px" }}
        />

        <h2 style={{ color: "#ff9800", marginBottom: "12px" }}>🧂 Ingredients</h2>
        <ul style={{ paddingLeft: "20px", lineHeight: "2", marginBottom: "30px" }}>
          {recipe.extendedIngredients?.map((ing) => (
            <li key={ing.id} style={{ color: "#ccc" }}>{ing.original}</li>
          ))}
        </ul>

        <h2 style={{ color: "#ff9800", marginBottom: "12px" }}>📋 Instructions</h2>
        <div
          style={{ lineHeight: "1.9", color: "#ccc", marginBottom: "30px" }}
          dangerouslySetInnerHTML={{ __html: recipe.instructions || "No instructions available." }}
        />

        <h2 style={{ color: "#ff9800", marginBottom: "12px" }}>💡 Fun Fact</h2>
        <div style={{
          background: "#1e1e1e",
          border: "1px solid #2a2a2a",
          borderRadius: "12px",
          padding: "20px",
          lineHeight: "1.8",
          color: "#ccc"
        }}>
          {fact}
        </div>
      </div>
    </div>
  )
}

export default RecipeDetails