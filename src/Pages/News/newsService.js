import AiService from '../../components/BlogAI/BlogAIService.js';
 
const getTrendingNews = async (category = "general", country = "in", page = 1) => {
    try {
        const res = await AiService.getNews({ category, country, page });
        //console.log("Response Data:", res);
        return res.articles;
    } catch (err) {
        console.error("Failed to fetch news:", err.response?.data || err.message);
        return [];
    }
};

export { getTrendingNews };
