import { useEffect, useState } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { getRecipeById, getIngredientsList } from "../services/recipeAPI"
import { getRecipeFact } from "../services/factAPI"
import { getRecipeNutrition, getFitnessTag } from "../services/nutritionAPI"

function RecipeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const servings = parseInt(searchParams.get("servings") || "2")

  const [recipe, setRecipe] = useState(null)
  const [fact, setFact] = useState("")
  const [nutrition, setNutrition] = useState(null)
  const [fitnessTag, setFitnessTag] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRecipeById(id)
      setRecipe(data)

      const [recipeFact, nutritionData] = await Promise.all([
        getRecipeFact(data.strMeal),
        getRecipeNutrition(getIngredientsList(data))
      ])

      setFact(recipeFact)
      setNutrition(nutritionData)
      setFitnessTag(getFitnessTag(nutritionData))
      setLoading(false)
    }
    fetchData()
  }, [id])

  if (loading) return (
    <div style={{
      padding: "40px",
      color: "#ff9800",
      fontFamily: "Segoe UI",
      background: "#0f0f0f",
      minHeight: "100vh"
    }}>
      Loading recipe...
    </div>
  )

  const ingredients = getIngredientsList(recipe)
  const scaledIngredients = ingredients.map((ing) => ({
    ...ing,
    measure: ing.measure
  }))

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

        {/* Title */}
        <h1 style={{
          fontSize: "28px",
          marginBottom: "12px",
          color: "#ff9800"
        }}>
          {recipe.strMeal}
        </h1>

        {/* Tags Row */}
        <div style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap"
        }}>
          {recipe.strCategory && (
            <span style={{
              background: "#2a2a2a",
              color: "#aaa",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "13px"
            }}>
              🍽️ {recipe.strCategory}
            </span>
          )}
          {recipe.strArea && (
            <span style={{
              background: "#2a2a2a",
              color: "#aaa",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "13px"
            }}>
              🌍 {recipe.strArea}
            </span>
          )}
          <span style={{
            background: "#2a2a2a",
            color: "#aaa",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "13px"
          }}>
            👥 {servings} servings
          </span>
          {fitnessTag && (
            <span style={{
              background: fitnessTag.bg,
              color: fitnessTag.color,
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "bold"
            }}>
              {fitnessTag.label}
            </span>
          )}
        </div>

        {/* Image */}
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          style={{
            width: "100%",
            maxWidth: "500px",
            borderRadius: "16px",
            marginBottom: "30px"
          }}
        />

        {/* Nutrition Card */}
        {nutrition && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
            marginBottom: "30px"
          }}>
            {[
              { label: "Calories", value: `${nutrition.calories * servings} kcal`, color: "#ff9800" },
              { label: "Protein", value: `${nutrition.protein * servings}g`, color: "#4caf50" },
              { label: "Carbs", value: `${nutrition.carbs * servings}g`, color: "#2196f3" },
              { label: "Fat", value: `${nutrition.fat * servings}g`, color: "#f44336" },
            ].map((n) => (
              <div
                key={n.label}
                style={{
                  background: "#1e1e1e",
                  border: `1px solid ${n.color}33`,
                  borderRadius: "10px",
                  padding: "14px",
                  textAlign: "center"
                }}
              >
                <div style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: n.color
                }}>
                  {n.value}
                </div>
                <div style={{ fontSize: "12px", color: "#aaa", marginTop: "4px" }}>
                  {n.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ingredients */}
        <h2 style={{ color: "#ff9800", marginBottom: "12px" }}>🧂 Ingredients</h2>
        <ul style={{
          paddingLeft: "20px",
          lineHeight: "2",
          marginBottom: "30px"
        }}>
          {scaledIngredients.map((ing, i) => (
            <li key={i} style={{ color: "#ccc" }}>
              {ing.measure} {ing.name}
            </li>
          ))}
        </ul>

        {/* Instructions */}
        <h2 style={{ color: "#ff9800", marginBottom: "12px" }}>📋 Instructions</h2>
        <div style={{
          lineHeight: "1.9",
          color: "#ccc",
          marginBottom: "30px",
          whiteSpace: "pre-line"
        }}>
          {recipe.strInstructions || "No instructions available."}
        </div>

        {/* Fun Fact */}
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

        {/* YouTube Link */}
        {recipe.strYoutube && (
          <div style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#ff9800", marginBottom: "12px" }}>▶️ Video Tutorial</h2>
  
            <a href={recipe.strYoutube}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                background: "#ff0000",
                color: "#fff",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "14px"
              }}
            >
              Watch on YouTube 🎥
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipeDetails