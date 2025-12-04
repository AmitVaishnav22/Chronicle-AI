import axios from "axios";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { category, country, page } = req.query;

  try {
    const response = await axios.get("https://gnews.io/api/v4/top-headlines", {
      params: {
        country: country || "us",
        category: category || "general",
        page: page || 1,
        pageSize: 10,
        token: process.env.NEWS_API_KEY,  
      },
    });
    console.log("Fetched news successfully", response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("ERROR fetching news", error.message);
    return res.status(500).json({ error: "Failed to fetch news" });
  }
}
