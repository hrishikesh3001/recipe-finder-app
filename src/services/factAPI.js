import axios from "axios";

export const getRecipeFact = async (recipeName) => {
  try {
    const cleanName = recipeName
      .replace(/\(.*?\)/g, "")
      .trim()
      .replace(/ /g, "_")

    const res = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${cleanName}`
    )
    if (res.data.extract && res.data.extract.length > 80) {
      return res.data.extract
    }

    const search = await axios.get(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${recipeName}&limit=1&format=json&origin=*`
    )
    if (search.data[1]?.length > 0) {
      const title = search.data[1][0].replace(/ /g, "_")
      const page = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`
      )
      if (page.data.extract) return page.data.extract
    }
    return getFallbackFact(recipeName)
  } catch {
    return getFallbackFact(recipeName)
  }
}

const getFallbackFact = (recipeName) => {
  const facts = [
    `${recipeName} is a beloved dish with deep roots in Indian culinary tradition.`,
    `${recipeName} has been enjoyed across generations, with each family adding their own special touch.`,
    `The rich spices in ${recipeName} reflect the diversity and depth of Indian cuisine.`,
    `${recipeName} is a staple dish that brings families together across India.`,
  ]
  return facts[Math.floor(Math.random() * facts.length)]
}