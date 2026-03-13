function RecipeCard({ recipe, onClick }) {
  return (
    <div
      onClick={() => onClick(recipe.id)}
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "10px",
        width: "200px",
        cursor: "pointer",
        textAlign: "center"
      }}
    >
      <img
        src={recipe.image}
        alt={recipe.title}
        style={{ width: "100%", borderRadius: "8px" }}
      />
      <h3 style={{ fontSize: "14px", marginTop: "8px" }}>{recipe.title}</h3>
      {recipe.vegetarian && (
        <span style={{ fontSize: "12px", color: "green" }}>🥦 Vegetarian</span>
      )}
    </div>
  )
}

export default RecipeCard