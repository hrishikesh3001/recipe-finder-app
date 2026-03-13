import axios from "axios";

export const getRecipeFact = async (recipeName) => {
  try {
    // Clean up recipe name for Wikipedia search
    const cleanName = recipeName
      .replace(/\(.*?\)/g, "")
      .trim()
      .replace(/ /g, "_");

    const res = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${cleanName}`
    );

    if (res.data.extract && res.data.extract.length > 50) {
      return res.data.extract;
    }

    // Fallback: search Wikipedia
    const search = await axios.get(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${recipeName}&limit=1&format=json&origin=*`
    );

    if (search.data[1].length > 0) {
      const title = search.data[1][0].replace(/ /g, "_");
      const page = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`
      );
      return page.data.extract || getFallbackFact(recipeName);
    }

    return getFallbackFact(recipeName);
  } catch {
    return getFallbackFact(recipeName);
  }
};

const getFallbackFact = (recipeName) => {
  const facts = [
    `${recipeName} is a beloved dish enjoyed across many cultures and generations.`,
    `The origins of ${recipeName} can be traced back through centuries of culinary tradition.`,
    `${recipeName} is known for its unique blend of flavors that make it a favorite comfort food.`,
    `Chefs around the world have their own special twist on ${recipeName}, making it truly versatile.`,
  ];
  return facts[Math.floor(Math.random() * facts.length)];
};