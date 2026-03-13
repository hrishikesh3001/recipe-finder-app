import axios from "axios"

const USDA_URL = "https://api.nal.usda.gov/fdc/v1"
const KEY = import.meta.env.VITE_USDA_KEY

const nutritionCache = {}

const getNutritionForIngredient = async (ingredientName) => {
  const name = ingredientName.toLowerCase().trim()
  if (nutritionCache[name]) return nutritionCache[name]

  try {
    const res = await axios.get(`${USDA_URL}/foods/search`, {
      params: {
        api_key: KEY,
        query: name,
        pageSize: 1,
        dataType: "SR Legacy,Foundation"
      }
    })

    const food = res.data.foods?.[0]
    if (!food) return null

    const nutrients = food.foodNutrients || []

    const get = (name) => {
      const n = nutrients.find((n) => n.nutrientName?.toLowerCase().includes(name))
      return Math.round(n?.value || 0)
    }

    const result = {
      calories: get("energy"),
      protein: get("protein"),
      carbs: get("carbohydrate"),
      fat: get("total lipid"),
    }

    nutritionCache[name] = result
    return result
  } catch {
    return null
  }
}

export const getRecipeNutrition = async (ingredients) => {
  if (!ingredients || ingredients.length === 0) return null

  const results = await Promise.all(
    ingredients.slice(0, 8).map((ing) =>
      getNutritionForIngredient(ing.name)
    )
  )

  const total = results.reduce(
    (acc, n) => {
      if (!n) return acc
      return {
        calories: acc.calories + Math.round(n.calories * 0.15),
        protein: acc.protein + Math.round(n.protein * 0.15),
        carbs: acc.carbs + Math.round(n.carbs * 0.15),
        fat: acc.fat + Math.round(n.fat * 0.15),
      }
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  return total
}

export const getFitnessTag = (nutrition) => {
  if (!nutrition) return null
  const { protein, calories, fat } = nutrition

  if (protein >= 15 && calories <= 500) {
    return { label: "💪 Muscle Gain", color: "#4caf50", bg: "#1b3a1b", value: "muscle" }
  }
  if (calories <= 300 && fat <= 8) {
    return { label: "🔥 Fat Loss", color: "#ff9800", bg: "#3a2a0a", value: "fatloss" }
  }
  if (protein >= 8 && calories <= 500) {
    return { label: "⚖️ Balanced", color: "#2196f3", bg: "#0a2a3a", value: "balanced" }
  }
  return { label: "🍽️ Comfort Food", color: "#9c27b0", bg: "#2a0a3a", value: "comfort" }
}