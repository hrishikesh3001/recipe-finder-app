import { useState, useEffect } from "react"
import SearchBar from "../components/SearchBar"
import IngredientFilter from "../components/IngredientFilter"
import RecipeCard from "../components/RecipeCard"
import {
  searchRecipes,
  searchByIngredients,
  getIndianRecipes,
  getPopularRecipes,
} from "../services/recipeAPI"
import { useNavigate } from "react-router-dom"

function Home() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [cuisine, setCuisine] = useState("all")
  const [dietMode, setDietMode] = useState("all") // all, vegetarian, chicken
  const navigate = useNavigate()

  useEffect(() => {
    const loadDefault = async () => {
      setLoading(true)
      const results = await getPopularRecipes()
      setRecipes(results || [])
      setLoading(false)
    }
    loadDefault()
  }, [])

  const handleSearch = async (query) => {
    setLoading(true)
    setError("")
    const results = await searchRecipes(query, cuisine === "indian" ? "indian" : "")
    if (results && results.length > 0) {
      setRecipes(results)
    } else {
      setRecipes([])
      setError("No recipes found. Try a different name!")
    }
    setLoading(false)
  }

  const handleFilter = async (ingredients) => {
    setLoading(true)
    setError("")
    const results = await searchByIngredients(ingredients)
    if (results && results.length > 0) {
      setRecipes(results)
    } else {
      setRecipes([])
      setError("No recipes found with those ingredients!")
    }
    setLoading(false)
  }

  const handleCuisine = async (type) => {
    setCuisine(type)
    setLoading(true)
    setError("")
    if (type === "indian") {
      const results = await getIndianRecipes()
      setRecipes(results || [])
    } else {
      const results = await getPopularRecipes()
      setRecipes(results || [])
    }
    setLoading(false)
  }

  const handleCardClick = (id) => {
    navigate(`/recipe/${id}`)
  }

  const filteredRecipes = recipes.filter((recipe) => {
    if (dietMode === "vegetarian") return recipe.vegetarian === true
    if (dietMode === "chicken") {
      const title = recipe.title?.toLowerCase() || ""
      return title.includes("chicken") || title.includes("egg")
    }
    return true
  })

  const buttonStyle = (active, color = "#333") => ({
    padding: "8px 20px",
    marginRight: "10px",
    marginBottom: "10px",
    background: active ? color : "#eee",
    color: active ? "#fff" : "#333",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
  })

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1 style={{ marginBottom: "30px" }}>🍳 Recipe Finder</h1>

      <SearchBar onSearch={handleSearch} />

      <hr style={{ margin: "30px 0" }} />

      <IngredientFilter onFilter={handleFilter} />

      <hr style={{ margin: "30px 0" }} />

      {/* Cuisine Filter */}
      <div style={{ marginBottom: "20px" }}>
        <h3>🌍 Cuisine</h3>
        <button style={buttonStyle(cuisine === "all")} onClick={() => handleCuisine("all")}>
          🌐 All
        </button>
        <button style={buttonStyle(cuisine === "indian", "#ff6b00")} onClick={() => handleCuisine("indian")}>
          🇮🇳 Indian
        </button>
      </div>

      {/* Diet Filter */}
      <div style={{ marginBottom: "20px" }}>
        <h3>🥗 Diet</h3>
        <button style={buttonStyle(dietMode === "all")} onClick={() => setDietMode("all")}>
          🍽️ All Allowed
        </button>
        <button style={buttonStyle(dietMode === "vegetarian", "#4caf50")} onClick={() => setDietMode("vegetarian")}>
          🥦 Vegetarian Only
        </button>
        <button style={buttonStyle(dietMode === "chicken", "#ff9800")} onClick={() => setDietMode("chicken")}>
          🍗 Chicken / Eggs
        </button>
      </div>

      {loading && <p>Loading recipes...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  )
}

export default Home