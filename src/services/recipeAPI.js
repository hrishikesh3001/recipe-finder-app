import axios from "axios";

const MEALDB = "https://www.themealdb.com/api/json/v1/1";

// Allowed categories from TheMealDB
const INDIAN_SEARCHES = [
  "chicken tikka masala", "biryani", "dal", "paneer", "curry",
  "samosa", "dosa", "idli", "butter chicken", "palak",
  "chana", "aloo", "tandoori", "korma", "vindaloo",
  "raita", "kheer", "halwa", "pulao", "uttapam",
  "paratha", "roti", "naan", "lassi", "rasam",
  "sambhar", "upma", "poha", "pav bhaji", "chole"
];

const SEAFOOD_SEARCHES = [
  "fish curry", "prawn curry", "fish fry", "prawn masala",
  "fish tikka", "crab curry", "fish biryani", "prawn biryani",
  "fish masala", "prawn fry"
];

// Diet filtering
const BANNED_NON_VEG = [
  "beef", "pork", "lamb", "veal", "bacon", "ham",
  "sausage", "pepperoni", "mutton", "turkey"
];

export const isMealAllowed = (meal, diet) => {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`]?.toLowerCase() || ""
    if (ing) ingredients.push(ing)
  }

  const hasSeafood = ingredients.some((i) =>
    ["fish", "prawn", "shrimp", "crab", "lobster", "seafood", "salmon", "tuna"].some(s => i.includes(s))
  )
  const hasChicken = ingredients.some((i) => i.includes("chicken") || i.includes("egg"))
  const hasBanned = ingredients.some((i) =>
    BANNED_NON_VEG.some((b) => i.includes(b))
  )

  if (hasBanned) return false
  if (diet === "vegetarian") return !hasChicken && !hasSeafood
  if (diet === "chicken") return hasChicken && !hasSeafood
  if (diet === "seafood") return hasSeafood
  return true // "all" — veg + chicken + seafood, no banned
}

// Fetch full details for a list of meals
export const enrichMeals = async (meals) => {
  if (!meals) return []
  const detailed = await Promise.all(
    meals.slice(0, 20).map((m) =>
      axios.get(`${MEALDB}/lookup.php?i=${m.idMeal}`)
        .then((r) => r.data.meals?.[0])
        .catch(() => null)
    )
  )
  return detailed.filter(Boolean)
}

export const getIndianRecipes = async (diet = "all") => {
  // Shuffle searches for variety every load
  const shuffled = [...INDIAN_SEARCHES]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)

  const results = await Promise.all(
    shuffled.map((q) =>
      axios.get(`${MEALDB}/search.php?s=${q}`)
        .then((r) => r.data.meals || [])
        .catch(() => [])
    )
  )

  const combined = results.flat()
  const unique = combined.filter(
    (m, i, self) => self.findIndex((x) => x.idMeal === m.idMeal) === i
  )

  const filtered = unique.filter((m) => isMealAllowed(m, diet))

  // Shuffle and return only 6 random recipes
  return filtered
    .sort(() => Math.random() - 0.5)
    .slice(0, 6)
}

export const getSeafoodRecipes = async () => {
  const shuffled = [...SEAFOOD_SEARCHES]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  const results = await Promise.all(
    shuffled.map((q) =>
      axios.get(`${MEALDB}/search.php?s=${q}`)
        .then((r) => r.data.meals || [])
        .catch(() => [])
    )
  )

  const combined = results.flat()
  const unique = combined.filter(
    (m, i, self) => self.findIndex((x) => x.idMeal === m.idMeal) === i
  )

  return unique
    .sort(() => Math.random() - 0.5)
    .slice(0, 6)
}

export const searchRecipes = async (query, diet = "all") => {
  const res = await axios.get(`${MEALDB}/search.php?s=${query}`)
  const meals = res.data.meals || []
  return meals.filter((m) => isMealAllowed(m, diet))
}

export const searchByIngredients = async (ingredients, diet = "all") => {
  const results = await Promise.all(
    ingredients.map((ing) =>
      axios.get(`${MEALDB}/filter.php?i=${ing}`)
        .then((r) => r.data.meals || [])
        .catch(() => [])
    )
  )

  // Find meals that appear in ALL ingredient searches
  const [first, ...rest] = results
  if (!first) return []

  const matched = first.filter((meal) =>
    rest.every((list) => list.some((m) => m.idMeal === meal.idMeal))
  )

  // Enrich with full details for diet filtering
  const enriched = await enrichMeals(matched.length > 0 ? matched : first)
  return enriched.filter((m) => isMealAllowed(m, diet))
}

export const getRecipeById = async (id) => {
  const res = await axios.get(`${MEALDB}/lookup.php?i=${id}`)
  return res.data.meals?.[0]
}

export const getIngredientsList = (meal) => {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ing && ing.trim()) {
      ingredients.push({ name: ing.trim(), measure: measure?.trim() || "" })
    }
  }
  return ingredients
}