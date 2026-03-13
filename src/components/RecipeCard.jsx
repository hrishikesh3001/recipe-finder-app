function RecipeCard({ recipe, onClick, userIngredients }) {
  const usedCount = recipe.usedIngredientCount || 0
  const missedCount = recipe.missedIngredientCount || 0
  const totalNeeded = usedCount + missedCount
  const matchPercent = totalNeeded > 0 ? Math.round((usedCount / totalNeeded) * 100) : null

  return (
    <div
      onClick={() => onClick(recipe.id)}
      style={{
        background: "#1e1e1e",
        border: "1px solid #2a2a2a",
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s, border-color 0.2s",
        width: "220px",
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
        src={recipe.image}
        alt={recipe.title}
        style={{ width: "100%", height: "150px", objectFit: "cover" }}
      />
      <div style={{ padding: "12px" }}>
        <h3 style={{ fontSize: "14px", marginBottom: "8px", color: "#f0f0f0", lineHeight: "1.4" }}>
          {recipe.title}
        </h3>

        {totalNeeded > 0 && (
          <div style={{ marginTop: "8px" }}>
            <div style={{
              height: "4px",
              background: "#2a2a2a",
              borderRadius: "4px",
              marginBottom: "6px"
            }}>
              <div style={{
                height: "100%",
                width: `${matchPercent}%`,
                background: matchPercent === 100 ? "#4caf50" : "#ff9800",
                borderRadius: "4px"
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
              <span style={{ color: "#4caf50" }}>✅ {usedCount} have</span>
              {missedCount > 0 && (
                <span style={{ color: "#f44336" }}>❌ {missedCount} missing</span>
              )}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
          {recipe.vegetarian && (
            <span style={{ fontSize: "11px", background: "#1b3a1b", color: "#4caf50", padding: "2px 8px", borderRadius: "10px" }}>
              🥦 Veg
            </span>
          )}
          {recipe.readyInMinutes && (
            <span style={{ fontSize: "11px", background: "#2a2a2a", color: "#aaa", padding: "2px 8px", borderRadius: "10px" }}>
              ⏱️ {recipe.readyInMinutes}m
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecipeCard