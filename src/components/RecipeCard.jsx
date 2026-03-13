function RecipeCard({ recipe, onClick, userIngredients }) {
  const usedCount = recipe.usedIngredientCount || 0
  const missedCount = recipe.missedIngredientCount || 0
  const totalNeeded = usedCount + missedCount
  const matchPercent = totalNeeded > 0
    ? Math.round((usedCount / totalNeeded) * 100)
    : null

  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`strIngredient${i}`]
    if (ing && ing.trim()) ingredients.push(ing.trim().toLowerCase())
  }

  const userHas = userIngredients?.filter((u) =>
    ingredients.some((ing) => ing.includes(u) || u.includes(ing))
  ) || []

  const missing = ingredients.filter((ing) =>
    !userIngredients?.some((u) => ing.includes(u) || u.includes(ing))
  )

  const matchPct = ingredients.length > 0 && userIngredients?.length > 0
    ? Math.round((userHas.length / ingredients.length) * 100)
    : null

  return (
    <div
      onClick={() => {
        console.log("Card clicked!", recipe)
        onClick(recipe.idMeal || recipe.id)
    }}
      style={{
        background: "#1e1e1e",
        border: "1px solid #2a2a2a",
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s, border-color 0.2s",
        width: "220px",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)"
        e.currentTarget.style.borderColor = "#ff9800"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.borderColor = "#2a2a2a"
      }}
    >
      <img
        src={recipe.strMealThumb || recipe.image}
        alt={recipe.strMeal || recipe.title}
        style={{ width: "100%", height: "150px", objectFit: "cover" }}
      />
      <div style={{ padding: "12px" }}>
        <h3 style={{
          fontSize: "14px",
          marginBottom: "8px",
          color: "#f0f0f0",
          lineHeight: "1.4"
        }}>
          {recipe.strMeal || recipe.title}
        </h3>

        {/* Match Progress Bar */}
        {matchPct !== null && (
          <div style={{ marginTop: "8px" }}>
            <div style={{
              height: "4px",
              background: "#2a2a2a",
              borderRadius: "4px",
              marginBottom: "6px"
            }}>
              <div style={{
                height: "100%",
                width: `${matchPct}%`,
                background: matchPct === 100 ? "#4caf50" : "#ff9800",
                borderRadius: "4px",
                transition: "width 0.3s ease"
              }} />
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px"
            }}>
              <span style={{ color: "#4caf50" }}>✅ {userHas.length} have</span>
              {missing.length > 0 && (
                <span style={{ color: "#f44336" }}>❌ {missing.length} missing</span>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        <div style={{
          display: "flex",
          gap: "6px",
          marginTop: "8px",
          flexWrap: "wrap"
        }}>
          {recipe.strCategory && (
            <span style={{
              fontSize: "11px",
              background: "#2a2a2a",
              color: "#aaa",
              padding: "2px 8px",
              borderRadius: "10px"
            }}>
              {recipe.strCategory}
            </span>
          )}
          {recipe.strArea && (
            <span style={{
              fontSize: "11px",
              background: "#2a2a2a",
              color: "#aaa",
              padding: "2px 8px",
              borderRadius: "10px"
            }}>
              🌍 {recipe.strArea}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecipeCard