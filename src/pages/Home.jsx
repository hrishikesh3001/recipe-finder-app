import { useState, useEffect } from "react"
import { searchYoutubeVideo } from "../services/youtubeAPI"
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
  const [youtubeResults, setYoutubeResults] = useState([])
  const [ytLoading, setYtLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadDefault("indian")
  }, [])

  const loadDefault = async (cuisineType) => {
    setLoading(true)
    setError("")
    setYoutubeResults([])
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
    setYoutubeResults([])
    const results = await searchRecipes(query, diet)
    if (results && results.length > 0) {
      setRecipes(results)
    } else {
      setRecipes([])
      setError(`No recipes found in our app for "${query}"`)
      setYtLoading(true)
      const videos = await Promise.all([
        searchYoutubeVideo(`${query} indian recipe`),
        searchYoutubeVideo(`${query} recipe easy`),
        searchYoutubeVideo(`${query} recipe homemade`),
      ])
      setYoutubeResults(videos.filter(Boolean))
      setYtLoading(false)
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
    setYoutubeResults([])
    const results = await searchByIngredients(ingredients, diet)
    if (results && results.length > 0) {
      setRecipes(results)
    } else {
      setRecipes([])
      setError("No recipes found with those ingredients!")
      setYtLoading(true)
      const query = ingredients.join(" ")
      const videos = await Promise.all([
        searchYoutubeVideo(`${query} indian recipe`),
        searchYoutubeVideo(`${query} recipe easy`),
        searchYoutubeVideo(`${query} homemade recipe`),
      ])
      setYoutubeResults(videos.filter(Boolean))
      setYtLoading(false)
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
    return "🍽️ Popular Recipes"
  }

  const filteredRecipes = recipes.filter((recipe) => {
    if (diet === "vegetarian") {
      const ingredients = []
      for (let i = 1; i <= 20; i++) {
        const ing = recipe[`strIngredient${i}`]?.toLowerCase() || ""
        if (ing) ingredients.push(ing)
      }
      const hasNonVeg = ingredients.some((i) =>
        ["chicken", "fish", "prawn", "shrimp", "crab", "egg"].some(n => i.includes(n))
      )
      if (hasNonVeg) return false
    }
    if (diet === "chicken") {
      const ingredients = []
      for (let i = 1; i <= 20; i++) {
        const ing = recipe[`strIngredient${i}`]?.toLowerCase() || ""
        if (ing) ingredients.push(ing)
      }
      return ingredients.some((i) => i.includes("chicken") || i.includes("egg"))
    }
    if (diet === "seafood") {
      const ingredients = []
      for (let i = 1; i <= 20; i++) {
        const ing = recipe[`strIngredient${i}`]?.toLowerCase() || ""
        if (ing) ingredients.push(ing)
      }
      return ingredients.some((i) =>
        ["fish", "prawn", "shrimp", "crab", "salmon", "tuna"].some(n => i.includes(n))
      )
    }
    return true
  })

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f0f0f" }}>

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
        transition: "margin 0.3s ease",
        overflowX: "hidden"
      }}>

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

          <div style={{ width: "1px", height: "30px", background: "#333" }} />

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

          <div style={{ width: "1px", height: "30px", background: "#333" }} />

          <ServingsSelector onChange={setServings} />
        </div>

        {/* Section Title */}
        <h2 style={{ marginBottom: "20px", fontSize: "18px", color: "#aaa" }}>
          {getSectionTitle()}
          {filteredRecipes.length > 0 && (
            <span style={{ fontSize: "14px", color: "#555", marginLeft: "10px" }}>
              {filteredRecipes.length} recipes
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

        {/* YouTube Fallback */}
        {ytLoading && (
          <p style={{ color: "#ff9800", marginTop: "16px" }}>
            🔍 Searching YouTube for videos...
          </p>
        )}

        {youtubeResults.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h2 style={{ color: "#ff9800", marginBottom: "16px", fontSize: "18px" }}>
              📺 Watch on YouTube instead:
            </h2>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {youtubeResults.map((video) => (
                  <a
                  key={video.videoId}
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: "none",
                    width: "280px",
                    background: "#1e1e1e",
                    border: "1px solid #2a2a2a",
                    borderRadius: "12px",
                    overflow: "hidden",
                    transition: "border-color 0.2s",
                    display: "block"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#ff0000"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "#2a2a2a"}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    style={{ width: "100%", height: "157px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "12px" }}>
                    <p style={{
                      color: "#f0f0f0",
                      fontSize: "13px",
                      lineHeight: "1.4",
                      marginBottom: "6px"
                    }}>
                      {video.title}
                    </p>
                    <p style={{ color: "#aaa", fontSize: "12px" }}>
                      📺 {video.channel}
                    </p>
                    <div style={{
                      marginTop: "10px",
                      display: "inline-block",
                      background: "#ff0000",
                      color: "#fff",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}>
                      Watch on YouTube ▶️
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {!loading && filteredRecipes.length === 0 && !error && (
          <p style={{ color: "#555", fontSize: "15px" }}>
            No recipes found. Try different filters! 🥕
          </p>
        )}

        {/* Recipe Grid */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
          {filteredRecipes.map((recipe) => (
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