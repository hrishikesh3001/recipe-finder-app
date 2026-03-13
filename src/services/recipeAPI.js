import axios from "axios";

const BASE_URL = "https://api.spoonacular.com/recipes";
const KEY = import.meta.env.VITE_SPOONACULAR_KEY;

const ALLOWED_DIETS = "vegetarian";
const EXCLUDED_INGREDIENTS = "beef,pork,lamb,veal,bacon,ham,sausage,pepperoni,mutton";

export const searchRecipes = async (query, cuisine = "") => {
  const res = await axios.get(`${BASE_URL}/complexSearch`, {
    params: {
      apiKey: KEY,
      query,
      cuisine,
      excludeIngredients: EXCLUDED_INGREDIENTS,
      number: 20,
      addRecipeInformation: true,
    },
  });
  return res.data.results;
};

export const getPopularRecipes = async () => {
  const res = await axios.get(`${BASE_URL}/complexSearch`, {
    params: {
      apiKey: KEY,
      cuisine: "indian",
      excludeIngredients: EXCLUDED_INGREDIENTS,
      number: 20,
      sort: "popularity",
      addRecipeInformation: true,
    },
  });
  return res.data.results;
};

export const getIndianRecipes = async () => {
  const res = await axios.get(`${BASE_URL}/complexSearch`, {
    params: {
      apiKey: KEY,
      cuisine: "indian",
      excludeIngredients: EXCLUDED_INGREDIENTS,
      number: 20,
      addRecipeInformation: true,
    },
  });
  return res.data.results;
};

export const searchByIngredients = async (ingredients) => {
  const res = await axios.get(`${BASE_URL}/findByIngredients`, {
    params: {
      apiKey: KEY,
      ingredients: ingredients.join(","),
      number: 20,
      ignorePantry: true,
    },
  });
  return res.data;
};

export const getRecipeById = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}/information`, {
    params: {
      apiKey: KEY,
    },
  });
  return res.data;
};