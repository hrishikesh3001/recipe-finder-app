import axios from "axios"

const YT_URL = "https://www.googleapis.com/youtube/v3"
const KEY = import.meta.env.VITE_YOUTUBE_KEY

// Preferred Indian food YouTube channels
const INDIAN_CHANNELS = [
  "yourfoodlab",
  "ranveer brar",
  "kabita's kitchen",
  "hebbars kitchen",
  "chef kunal kapur",
  "bong eats",
  "sanjeev kapoor",
  "cook with parul",
  "nishamadhulika",
]

// Blocked keywords — filter out Pakistani, Arabic, Urdu content
const BLOCKED = [
  "pakistan", "pakistani", "urdu", "arabic", "arab",
  "bangladeshi", "sri lankan", "پاکستان", "عربي", "اردو",
]

const isBlocked = (item) => {
  const text = [
    item.snippet.title,
    item.snippet.channelTitle,
    item.snippet.description,
  ].join(" ").toLowerCase()
  return BLOCKED.some((kw) => text.includes(kw))
}

const isPreferredChannel = (item) => {
  const channel = item.snippet.channelTitle.toLowerCase()
  return INDIAN_CHANNELS.some((name) => channel.includes(name))
}

export const searchYoutubeVideo = async (query) => {
  try {
    // Try with a preferred channel name appended first for better results
    const preferredChannel = INDIAN_CHANNELS[Math.floor(Math.random() * 4)] // rotate top 4
    const res = await axios.get(`${YT_URL}/search`, {
      params: {
        key: KEY,
        q: `${query} recipe ${preferredChannel}`,
        part: "snippet",
        type: "video",
        maxResults: 10,
        order: "relevance",
        publishedAfter: "2021-01-01T00:00:00Z",
        relevanceLanguage: "en",
        regionCode: "IN",
        safeSearch: "strict",
      },
    })

    const videos = res.data.items || []
    if (videos.length === 0) return null

    // Filter out blocked content
    const clean = videos.filter((v) => !isBlocked(v))

    // Prefer known Indian channels, fall back to first clean result
    const best = clean.find(isPreferredChannel) || clean[0] || videos[0]

    return {
      videoId: best.id.videoId,
      title: best.snippet.title,
      channel: best.snippet.channelTitle,
      thumbnail: best.snippet.thumbnails?.high?.url,
      url: `https://www.youtube.com/watch?v=${best.id.videoId}`,
    }
  } catch (err) {
    console.error("YouTube search failed:", err)
    return null
  }
}