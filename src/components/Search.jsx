import React, { useState ,useEffect} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import service from "../appwrite/database.js"

const SearchBar = () => {
    const [query, setQuery] = useState(""); 
    const [showRecent, setShowRecent] = useState(false);
    const [recentSearch, setRecentSearch] = useState([]); 
    const [searchResults, setSearchResults] = useState([]);

    //const postsData = useSelector((state) => state.posts) 
    const userData = useSelector((state) => state.auth.userData)
    //console.log(userData)

    const navigate = useNavigate();

    //const posts = postsData.documents || [];

    //console.log(posts)

    useEffect(()=>{
        const delayDebounce=setTimeout(()=>{
            const fetchResults=async()=>{
                if(query.trim() === "") {
                    setSearchResults([]);
                    return;
                }
                try {

                    const results = await service.searchPosts(query.trim());
                    console.log("Search results:", results);
                    setSearchResults(results?.documents || []);
                } catch (error) {
                    console.error("Error fetching search results:", error);
                    setSearchResults([]);
                }
            }
            fetchResults();
        },300);
        return () => clearTimeout(delayDebounce);
    },[query])

    const filteredPosts = searchResults.filter((post) =>
        post.title.toLowerCase().includes(query.toLowerCase())
    );

    const handleTitleClick = async (id, searchText = query) => {
        navigate(`/post/${id}`); 
        try {
            const existing = await service.checkSearchHistory(userData.$id, id);
            if (!existing) {
                const post = searchResults.find((post) => post.$id === id);
                const postTitle = post ? post.title : searchText;
                const author = post ? post.userName : "Unknown";
                const featuredImg=post? post.featuredImg : "";
                await service.createSearchHistory(userData.$id, searchText, id, postTitle,author,featuredImg);
            }
        } catch (error) {
            console.error("Error handling title click:", error);
        }
    };

    const fetchRecentSearch = async () => {     
        try {
            const recentSearches = await service.getSearchHistory(userData.$id);
            setRecentSearch(recentSearches.documents);
        } catch (error) {
            console.error("Error fetching recent searches:", error);
        }
    };

    const deleteRecentSearch = async (id) => {
        try {
            await service.deleteSearchHistoryItem(id);
           // console.log("Deleted recent search:", id);
            fetchRecentSearch();
        } catch (error) {
            console.error("Error deleting recent search:", error);
        }
    };

    useEffect(() => {
        if (showRecent) {
            fetchRecentSearch();
        }
    }, [showRecent]);
    const handleRecentClick = async (item) => {
        setQuery(item.postTitle);
        setShowRecent(false);
        navigate(`/post/${item.postId}`); 
    }

    return (
        <div className="relative p-4 w-full max-w-md mx-auto">
        {/* Search Input */}
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowRecent(true)}
            onBlur={() => setTimeout(() => setShowRecent(false), 200)}
            placeholder="Search posts..."
            className="w-full text-white p-2 mb-2 rounded-md bg-black text-purple-400 placeholder-purple-500 border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
    
        {/* Recent Searches */}
        {showRecent && !query && recentSearch.length > 0 && (
            <div className="bg-black rounded-md shadow-inner w-full">
                <p className="px-3 py-2 text-purple-500 border-b border-purple-700">Recent Searches:</p>
                {recentSearch.map((item) => (
                    <div onMouseDown={(e) => e.preventDefault()}
                        key={item.$id}
                        className="flex justify-between items-center px-3 py-2 border-b border-purple-700 text-purple-400 hover:bg-purple-800"
                    >
                        {/* Left side: post title and author */}
                        <span onClick={() => handleRecentClick(item)} className="flex flex-col">
                            <div className="font-semibold">{item.postTitle}</div>
                            <div className="text-sm text-purple-300">
                            Author: {item.author || "Unknown"}
                            </div>
                        </span>

                        {/* Right side: image preview */}
                        <div className="ml-auto">
                            <img
                            src={service.getFilePreview(item.featuredImg)}
                            alt="Preview"
                            className="w-14 h-10 object-cover rounded" 
                            />
                        </div>
                        <button
                            onClick={() => deleteRecentSearch(item.$id)}
                            className="ml-4 text-red-400 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        )}
    
        {/* Real-Time Search Results */}
        {query && (
            <div className="bg-black rounded-md shadow-inner w-full mt-2">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <div
                    key={post.$id}
                    className="p-2 border-b border-purple-700 text-purple-400 hover:bg-purple-800 hover:text-white cursor-pointer"
                    onClick={() => handleTitleClick(post.$id)}
                    >
                    <div className="flex items-center justify-between">
                        {/* Left side: Title and Author */}
                        <div>
                        <div className="font-semibold">{post.title}</div>
                        <div className="text-sm text-purple-500">
                            Author: {post.userName || "Unknown"}
                        </div>
                        </div>

                        {/* Right side: Image Preview */}
                        <div className="ml-4">
                        <img
                            src={service.getFilePreview(post.featuredImg)}
                            alt="Preview"
                            className="w-14 h-10 object-cover rounded"
                        />
                        </div>
                    </div>
                    </div>
                    ))
                ) : (
                    <p className="p-2 text-purple-500">No posts found</p>
                )}
            </div>
        )}
    </div>
    );
};

export default SearchBar;

