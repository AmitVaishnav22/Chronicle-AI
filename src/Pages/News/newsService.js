import axios from 'axios';
import {config} from "../../config/config.js";

const API_KEY =  config.newsApiKey;
const BASE_URL = 'https://newsapi.org/v2';

const getTrendingNews = async (category = "general", country = "us", page = 1) => {
    try {
        const res = await axios.get(`${BASE_URL}/top-headlines`, {
            params: {
                country,
                category,
                apiKey: API_KEY,
                page,
                pageSize: 10,
            },
        });
        return res.data.articles;
    } catch (err) {
        console.error("Failed to fetch news:", err.response?.data || err.message);
        return [];
    }
};

export { getTrendingNews };
