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

  if (loading) return <p style={{ padding: "40px" }}>Loading recipe...</p>

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: "800px", margin: "0 auto" }}>
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px", padding: "8px 16px", cursor: "pointer" }}
      >
        ← Back
      </button>

      <h1>{recipe.title}</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
        {recipe.vegetarian && <span style={{ background: "#e8f5e9", padding: "4px 10px", borderRadius: "20px", fontSize: "13px" }}>🥦 Vegetarian</span>}
        {recipe.vegan && <span style={{ background: "#e8f5e9", padding: "4px 10px", borderRadius: "20px", fontSize: "13px" }}>🌱 Vegan</span>}
        <span style={{ background: "#fff3e0", padding: "4px 10px", borderRadius: "20px", fontSize: "13px" }}>⏱️ {recipe.readyInMinutes} mins</span>
        <span style={{ background: "#e3f2fd", padding: "4px 10px", borderRadius: "20px", fontSize: "13px" }}>👥 {recipe.servings} servings</span>
      </div>

      <img
        src={recipe.image}
        alt={recipe.title}
        style={{ width: "100%", maxWidth: "400px", borderRadius: "12px", margin: "20px 0" }}
      />

      <h2>🧂 Ingredients</h2>
      <ul>
        {recipe.extendedIngredients?.map((ing) => (
          <li key={ing.id}>{ing.original}</li>
        ))}
      </ul>

      <h2>📋 Instructions</h2>
      <div
        style={{ lineHeight: "1.8" }}
        dangerouslySetInnerHTML={{ __html: recipe.instructions || "No instructions available." }}
      />

      <h2>💡 Fun Fact</h2>
      <p style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px", lineHeight: "1.8" }}>
        {fact}
      </p>
    </div>
  )
}

export default RecipeDetails