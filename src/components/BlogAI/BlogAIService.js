import config from "../../config/config";
export default class AiService {
    static async sendPrompt(data) {
      try {
        const postEndpoint = `https://${config.appwriteFunctionId}.appwrite.global/api`;
        const response = await fetch(postEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error(`POST request failed with status ${response.status}`);
        }
  
        return await response.json(); 
      } catch (error) {
        console.error("Error sending prompt:", error);
        throw error;
      }
    }
    static async getNews({ category = "general", country = "in", page = 1 }) {
      try {
        const endpoint = `https://${config.appwriteFunctionId}.appwrite.global/news?category=${category}&country=${country}&page=${page}`;

        const res = await fetch(endpoint);

        if (!res.ok) throw new Error("News fetch failed");

        return await res.json();
      } catch (err) {
        console.error("News Error:", err);
        return { articles: [] }; // fail safe
      }
    }
  }
  