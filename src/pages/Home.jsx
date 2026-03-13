import { useState, useEffect } from "react"
import SearchBar from "../components/SearchBar"
import IngredientFilter from "../components/IngredientFilter"
import RecipeCard from "../components/RecipeCard"
import ServingsSelector from "../components/ServingsSelector"
import {
  searchRecipes,
  searchByIngredients,
  getIndianRecipes,
  getSeafoodRecipes,
} from "../services/recipeAPI"
import { useNavigate } from "react-router-dom"

const FITNESS_FILTERS = [
  { value: "all", label: "🍽️ All Goals" },
  { value: "muscle", label: "💪 Muscle Gain" },
  { value: "fatloss", label: "🔥 Fat Loss" },
  { value: "balanced", label: "⚖️ Balanced" },
]

const TIME_FILTERS = [
  { value: "all", label: "⏱️ Any Time" },
  { value: "30", label: "Under 30 mins" },
  { value: "60", label: "Under 1 hour" },
]

function Home() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [diet, setDiet] = useState("all")
  const [cuisine, setCuisine] = useState("indian")
  const [userIngredients, setUserIngredients] = useState([])
  const [mode, setMode] = useState("popular")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [servings, setServings] = useState(2)
  const [fitnessFilter, setFitnessFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")
  const navigate = useNavigate()

  useEffect(() => {
    loadDefault("indian")
  }, [])

  const loadDefault = async (cuisineType) => {
    setLoading(true)
    setError("")
    let results = []
    if (cuisineType === "seafood") {
      results = await getSeafoodRecipes()
    } else {
      results = await getIndianRecipes(diet)
    }
    setRecipes(results || [])
    setLoading(false)
  }

  const handleSearch = async (query) => {
    setLoading(true)
    setError("")
    setMode("search")
    const results = await searchRecipes(query, diet)
    if (results && results.length > 0) {
      setRecipes(results)
    } else {
      setRecipes([])
      setError("No recipes found. Try something else!")
    }
    setLoading(false)
  }

  const handleIngredients = async (ingredients) => {
    setUserIngredients(ingredients)
    if (ingredients.length === 0) {
      setMode("popular")
      loadDefault(cuisine)
      return
    }
    setLoading(true)
    setError("")
    setMode("ingredients")
    const results = await searchByIngredients(ingredients, diet)
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
    setMode("popular")
    loadDefault(value)
  }

  const handleDietChange = (value) => {
    setDiet(value)
  }

  const handleCardClick = (id) => {
    navigate(`/recipe/${id}?servings=${servings}`)
  }

  const getSectionTitle = () => {
    if (mode === "ingredients") return "🍳 Recipes matching your ingredients"
    if (mode === "search") return "🔍 Search results"
    if (cuisine === "seafood") return "🦐 Seafood Recipes"
    return "🇮🇳 Popular Indian Recipes"
  }

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#0f0f0f"
    }}>

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "fixed",
          top: "16px",
          left: sidebarOpen ? "290px" : "16px",
          zIndex: 200,
          background: "#ff9800",
          border: "none",
          borderRadius: "8px",
          padding: "8px 12px",
          cursor: "pointer",
          fontSize: "18px",
          transition: "left 0.3s ease",
          color: "#000"
        }}
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* Left Sidebar */}
      <div style={{
        width: sidebarOpen ? "280px" : "0px",
        transition: "width 0.3s ease",
        overflow: "hidden",
        flexShrink: 0,
      }}>
        <IngredientFilter
          onFilter={handleIngredients}
          onDietChange={handleDietChange}
          onCuisineChange={handleCuisineChange}
          sidebarOpen={sidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: "32px",
        marginLeft: sidebarOpen ? "0px" : "0px",
        transition: "margin 0.3s ease",
        overflowX: "hidden"
      }}>

        {/* Search Bar */}
        <div style={{ marginTop: "20px" }}>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Top Filter Bar */}
        <div style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "28px",
          padding: "16px",
          background: "#1a1a1a",
          borderRadius: "12px",
          border: "1px solid #2a2a2a"
        }}>

          {/* Fitness Goal Filter */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {FITNESS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFitnessFilter(f.value)}
                style={{
                  padding: "8px 14px",
                  background: fitnessFilter === f.value ? "#ff9800" : "#2a2a2a",
                  color: fitnessFilter === f.value ? "#000" : "#ccc",
                  border: "1px solid #333",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: fitnessFilter === f.value ? "bold" : "normal",
                  transition: "all 0.2s"
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: "1px", height: "30px", background: "#333" }} />

          {/* Time Filter */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {TIME_FILTERS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTimeFilter(t.value)}
                style={{
                  padding: "8px 14px",
                  background: timeFilter === t.value ? "#2196f3" : "#2a2a2a",
                  color: timeFilter === t.value ? "#fff" : "#ccc",
                  border: "1px solid #333",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: timeFilter === t.value ? "bold" : "normal",
                  transition: "all 0.2s"
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: "1px", height: "30px", background: "#333" }} />

          {/* Servings Selector */}
          <ServingsSelector onChange={setServings} />
        </div>

        {/* Section Title */}
        <h2 style={{
          marginBottom: "20px",
          fontSize: "18px",
          color: "#aaa"
        }}>
          {getSectionTitle()}
          {recipes.length > 0 && (
            <span style={{ fontSize: "14px", color: "#555", marginLeft: "10px" }}>
              {recipes.length} recipes
            </span>
          )}
        </h2>

        {loading && (
          <div style={{ color: "#ff9800", fontSize: "16px" }}>
            Loading recipes...
          </div>
        )}

        {error && (
          <p style={{ color: "#f44336", fontSize: "15px" }}>{error}</p>
        )}

        {!loading && recipes.length === 0 && !error && (
          <p style={{ color: "#555", fontSize: "15px" }}>
            No recipes found. Try different filters! 🥕
          </p>
        )}

        {/* Recipe Grid */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal || recipe.id}
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