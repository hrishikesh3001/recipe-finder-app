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
  const [diet, setDiet] = useState("all")
  const [userIngredients, setUserIngredients] = useState([])
  const [mode, setMode] = useState("popular")
  const navigate = useNavigate()

  useEffect(() => {
    loadPopular()
  }, [])

  const loadPopular = async () => {
    setLoading(true)
    setError("")
    const results = await getPopularRecipes()
    setRecipes(results || [])
    setLoading(false)
  }

  const handleSearch = async (query) => {
    setLoading(true)
    setError("")
    setMode("search")
    const results = await searchRecipes(query, cuisine === "indian" ? "indian" : "")
    if (results && results.length > 0) {
      setRecipes(results)
    } else {
      setRecipes([])
      setError("No recipes found. Try a different name!")
    }
    setLoading(false)
  }

  const handleIngredients = async (ingredients) => {
    setUserIngredients(ingredients)
    if (ingredients.length === 0) {
      setMode("popular")
      loadPopular()
      return
    }
    setLoading(true)
    setError("")
    setMode("ingredients")
    const results = await searchByIngredients(ingredients)
    if (results && results.length > 0) {
      setRecipes(results)
    } else {
      setRecipes([])
      setError("No recipes found with those ingredients!")
    }
    setLoading(false)
  }

  const handleCuisineChange = async (value) => {
    setCuisine(value)
    setLoading(true)
    setError("")
    if (value === "indian") {
      const results = await getIndianRecipes()
      setRecipes(results || [])
    } else {
      await loadPopular()
      return
    }
    setLoading(false)
  }

  const handleDietChange = (value) => {
    setDiet(value)
  }

  const handleCardClick = (id) => {
    navigate(`/recipe/${id}`)
  }

  const filteredRecipes = recipes.filter((recipe) => {
    if (diet === "vegetarian") return recipe.vegetarian === true
    if (diet === "chicken") {
      const title = recipe.title?.toLowerCase() || ""
      return title.includes("chicken") || title.includes("egg")
    }
    return true
  })

  const getSectionTitle = () => {
    if (mode === "ingredients") return "🍳 Recipes with your ingredients"
    if (mode === "search") return "🔍 Search results"
    return cuisine === "indian" ? "🇮🇳 Popular Indian Recipes" : "⭐ Popular Recipes"
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f0f0f" }}>

      <IngredientFilter
        onFilter={handleIngredients}
        onDietChange={handleDietChange}
        onCuisineChange={handleCuisineChange}
      />

      <div style={{ marginLeft: "280px", flex: 1, padding: "32px" }}>
        <SearchBar onSearch={handleSearch} />

        <h2 style={{ marginBottom: "20px", fontSize: "18px", color: "#aaa" }}>
          {getSectionTitle()}
        </h2>

        {loading && (
          <div style={{ color: "#ff9800", fontSize: "16px" }}>
            Loading recipes...
          </div>
        )}

        {error && (
          <p style={{ color: "#f44336", fontSize: "15px" }}>{error}</p>
        )}

        {!loading && filteredRecipes.length === 0 && !error && (
          <p style={{ color: "#555", fontSize: "15px" }}>
            Add ingredients on the left to find recipes 🥕
          </p>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={handleCardClick}
              userIngredients={userIngredients}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home