# 🍽️ Recipe Finder

A cinematic, dark-mode recipe discovery app focused on Indian cuisine. Find recipes by ingredient or name, watch Indian YouTube tutorials, and track nutrition — all in one place.

---

## ✨ Features

- 🎬 **Cinematic intro animation** — Netflix-style opening screen with letter-drop effects
- 🥕 **Search by ingredients** — enter what's in your kitchen and find matching recipes
- 🔍 **Search by recipe name** — instantly look up any dish
- 🇮🇳 **Indian recipes by default** — 6 random Indian dishes loaded on every visit
- 🦐 **Seafood mode** — dedicated seafood recipe browsing
- 📊 **Nutrition tracking** — calories, protein, carbs and fat via USDA FoodData Central
- 💪 **Fitness goal filters** — Muscle Gain, Fat Loss, Balanced
- 🥗 **Diet filters** — Vegetarian, Chicken & Eggs, Seafood, All
- ▶️ **Indian YouTube tutorials** — videos from creators like YourFoodLab and Ranveer Brar (English/Hindi only)
- 📺 **YouTube fallback** — if a recipe isn't in the database, shows YouTube videos instead
- 💡 **Fun facts** — Wikipedia-sourced facts for every recipe
- 👥 **Servings selector** — scales nutrition values from 1–12 servings
- ☰ **Collapsible sidebar** — ingredient filter panel with category tabs

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Routing | React Router DOM |
| HTTP | Axios |
| Recipes | TheMealDB API (free, no key needed) |
| Nutrition | USDA FoodData Central API |
| Videos | YouTube Data API v3 |
| Fun Facts | Wikipedia REST API |
| Styling | Inline styles + CSS animations |

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/hrishikesh3001/recipe-finder-app.git
cd recipe-finder-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:
```env
VITE_USDA_KEY=your_usda_api_key
VITE_YOUTUBE_KEY=your_youtube_api_key
```

#### Getting API keys

- **USDA FoodData Central** — free key at [fdc.nal.usda.gov](https://fdc.nal.usda.gov/api-guide.html)
- **YouTube Data API v3** — free key via [Google Cloud Console](https://console.cloud.google.com/) → enable YouTube Data API v3

### 4. Run the app
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure
```
src/
├── components/
│   ├── SearchBar.jsx
│   ├── IngredientFilter.jsx
│   ├── RecipeCard.jsx
│   └── ServingsSelector.jsx
├── pages/
│   ├── Intro.jsx
│   ├── Home.jsx
│   └── RecipeDetails.jsx
└── services/
    ├── recipeAPI.js       # TheMealDB
    ├── nutritionAPI.js    # USDA FoodData Central
    ├── youtubeAPI.js      # YouTube Data API v3
    └── factAPI.js         # Wikipedia REST API
```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_USDA_KEY` | USDA FoodData Central API key |
| `VITE_YOUTUBE_KEY` | YouTube Data API v3 key |

> TheMealDB and Wikipedia require no API key.

---

## 📌 Notes

- YouTube results are filtered to Indian creators (YourFoodLab, Ranveer Brar, Hebbar's Kitchen etc.) and English/Hindi content only
- The app filters out beef, pork, lamb and mutton by default to keep recipes suitable for an Indian audience
- Nutrition data is estimated based on individual ingredients via the USDA database

---

## 🙌 Credits

- [TheMealDB](https://www.themealdb.com/) — recipe data
- [USDA FoodData Central](https://fdc.nal.usda.gov/) — nutrition data
- [YouTube Data API](https://developers.google.com/youtube/v3) — video tutorials
- [Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page) — fun facts
