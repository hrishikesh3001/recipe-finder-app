import axios from "axios";

// Open Food Facts API — free, unlimited, no key needed
const OFF_URL = "https://world.openfoodfacts.org/cgi/search.pl";

export const getNutrition = async (ingredientName) => {
  try {
    const res = await axios.get(OFF_URL, {
      params: {
        search_terms: ingredientName,
        search_simple: 1,
        action: "process",
        json: 1,
        page_size: 1,
      },
    })
    const product = res.data.products?.[0]
    if (!product?.nutriments) return null

    return {
      calories: Math.round(product.nutriments["energy-kcal_100g"] || 0),
      protein: Math.round(product.nutriments["proteins_100g"] || 0),
      carbs: Math.round(product.nutriments["carbohydrates_100g"] || 0),
      fat: Math.round(product.nutriments["fat_100g"] || 0),
    }
  } catch {
    return null
  }
}

// Calculate nutrition for a full recipe
export const getRecipeNutrition = async (ingredients) => {
  const results = await Promise.all(
    ingredients.slice(0, 5).map((ing) => getNutrition(ing.name))
  )

  const total = results.reduce(
    (acc, n) => {
      if (!n) return acc
      return {
        calories: acc.calories + n.calories,
        protein: acc.protein + n.protein,
        carbs: acc.carbs + n.carbs,
        fat: acc.fat + n.fat,
      }
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  return total
}

// Determine fitness goal tag based on nutrition
export const getFitnessTag = (nutrition) => {
  if (!nutrition) return null
  const { protein, calories, fat } = nutrition

  if (protein >= 20 && calories <= 500) {
    return { label: "💪 Muscle Gain", color: "#4caf50", bg: "#1b3a1b" }
  }
  if (calories <= 350 && fat <= 10) {
    return { label: "🔥 Fat Loss", color: "#ff9800", bg: "#3a2a0a" }
  }
  if (protein >= 10 && calories <= 600) {
    return { label: "⚖️ Balanced", color: "#2196f3", bg: "#0a2a3a" }
  }
  return { label: "🍽️ Comfort Food", color: "#9c27b0", bg: "#2a0a3a" }
}