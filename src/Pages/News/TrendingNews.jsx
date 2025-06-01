import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getTrendingNews } from './newsService.js';

const categories = ["general", "technology", "business", "entertainment", "sports", "health", "science"];
const regions = [
    { code: "in", label: "India" },
    { code: "us", label: "USA" },
    { code: "gb", label: "UK" },
    { code: "au", label: "Australia" },
    { code: "ca", label: "Canada" }
];

const LIMIT = 10;

function TrendingNews() {
    const [articles, setArticles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("general");
    const [selectedRegion, setSelectedRegion] = useState("us");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    // Fetch news on category/region change
    useEffect(() => {
        setArticles([]);
        setPage(1);
        setHasMore(true);
    }, [selectedCategory, selectedRegion]);

    useEffect(() => {
        const fetchNews = async () => {
            const data = await getTrendingNews(selectedCategory, selectedRegion, page);
            setArticles((prev) => [...prev, ...data]);
            if (data.length < LIMIT) setHasMore(false);
        };
        fetchNews();
    }, [page, selectedCategory, selectedRegion]);

    const lastArticleRef = useCallback(
        (node) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [hasMore]
    );

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-purple-600">Trending News</h2>

            <div className="flex flex-wrap gap-4 mb-4">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-2 border rounded-md"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="p-2 border rounded-md"
                >
                    {regions.map((region) => (
                        <option key={region.code} value={region.code}>
                            {region.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles.map((article, index) => {
                    const isLast = index === articles.length - 1;
                    return (
                        <div
                            key={index}
                            ref={isLast ? lastArticleRef : null}
                            className="border rounded-md p-4 shadow-md bg-gray-800"
                        >
                            <h3 className="text-lg text-white font-semibold">{article.title}</h3>
                            <h3 className="text-sm text-purple-300 font-semibold">Source : {article.source.name || "Unknown"}</h3>

                            {article.image && (
                                <img
                                    src={article.image}
                                    alt=""
                                    className="my-2 w-full h-50 object-cover rounded"
                                />
                            )}
                            <p className="text-white">{article.description}</p>
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline"
                            >
                                Read more
                            </a>
                        </div>
                    );
                })}
            </div>

            {!hasMore && (
                <p className="text-center text-purple-600 font-medium mt-4">End of news, come tomorrow!</p>
            )}
        </div>
    );
}

export default TrendingNews;
