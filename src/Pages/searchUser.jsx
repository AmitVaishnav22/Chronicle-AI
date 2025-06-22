import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import service from "../appwrite/database.js";

const SearchUser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestedAuthors, setSuggestedAuthors] = useState([]);
  const [loading, setLoading] = useState(false);

  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  // Fetch recent searches on load
  useEffect(() => {
    if (userData?.$id) {
      fetchRecentSearches();
    }
    fetchSuggestedAuthors();
  }, [userData]);
  // Fetch suggested authors
  const fetchSuggestedAuthors = async () => {
    try {
      const response = await service.getRandomUsers(3); // implement this in your backend/service
      setSuggestedAuthors(response.documents || []);
    } catch (error) {
      console.error("Error fetching suggested authors:", error);
    }
  };

  const fetchRecentSearches = async () => {
    try {
      const response = await service.getUserSearchHistory(userData.$id);
     // console.log("Recent Searches:", response);
      setRecentSearches(response.documents || []);
    } catch (error) {
      console.error("Error fetching recent searches:", error);
    }
  };

  // Handle user search input
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchResults = async () => {
        if (searchQuery.trim() === "") {
          setSearchResults([]);
          return;
        }
        setLoading(true);
        try {
          const results = await service.searchUsers(searchQuery.trim());
          setSearchResults(results?.documents || []);
        } catch (error) {
          console.error("Error fetching search results:", error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleUserClick = async (userId, userName, profilePicture) => {
    navigate(`/user-info/${userId}`);
    try {
      const existing = await service.checkUserSearchHistory(userId, userData.$id);
      if (!existing) {
        await service.createUserSearchHistory(userData.$id, {
          SearchedUserId: userId,
          SearchedUserName: userName,
          SearchedUserProfile: profilePicture || "",
        });
        fetchRecentSearches(); // Refresh recent searches
      }
    } catch (error) {
      console.error("Error updating search history:", error);
    }
  };

  const handleDeleteSearch = async (searchId) => {
    try {
      await service.deleteUserSearchHistoryItem(searchId);
      setRecentSearches(recentSearches.filter((item) => item.$id !== searchId));
    } catch (error) {
      console.error("Error deleting search history:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-1 py-1">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-400 text-center mb-5">Search Your Favorite Authors</h1>
        <div className="w-full mb-2">
          <input
            type="text" 
            placeholder="Type a name, e.g., 'John Doe'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 text-white text-lg bg-gray-800 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-600 transition"
          />
          {loading && <p className="text-purple-300 mt-2 text-center text-lg">Searching...</p>}
        </div>

        {/* Recent Searches */}
        {!loading && searchQuery === "" && recentSearches.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-purple-300 mb-5">Recent Searches</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {recentSearches.map((user) => (
                <li
                  key={user.$id}
                  className="flex justify-between items-center bg-gray-900 hover:bg-gray-800 p-4 rounded-xl transition"
                >
                  <div
                    className="flex items-center gap-5 cursor-pointer"
                    onClick={() =>
                      handleUserClick(user.SearchedUserId, user.SearchedUserName, user.SearchedUserProfile)
                    }
                  >
                    <img
                      src={
                        user.SearchedUserProfile
                          ? service.getFilePreview(user.SearchedUserProfile)
                          : "https://i.pinimg.com/736x/5d/69/42/5d6942c6dff12bd3f960eb30c5fdd0f9.jpg"
                      }
                      alt={user.SearchedUserName}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <span className="text-xl font-medium">{user.SearchedUserName}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteSearch(user.$id)}
                    className="text-md text-red-400 hover:text-red-200 transition"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Search Results */}
        {!loading && searchResults.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-purple-300 mb-6">Search Results</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {searchResults.map((user) => (
                <li
                  key={user.$id}
                  className="flex items-center bg-purple-800/20 hover:bg-purple-800/40 p-4 rounded-xl cursor-pointer transition"
                  onClick={() => handleUserClick(user.$id, user.name, user.userprofile)}
                >
                  <img
                    src={
                      user.userprofile
                        ? service.getFilePreview(user.userprofile)
                        : "https://i.pinimg.com/736x/5d/69/42/5d6942c6dff12bd3f960eb30c5fdd0f9.jpg"
                    }
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover mr-5"
                  />
                  <div>
                    <p className="text-xl font-semibold">{user.name}</p>
                    <p className="text-sm text-purple-300">{user.bio}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!loading && searchQuery && searchResults.length === 0 && (
          <p className="text-center text-purple-400 text-xl mt-12">No users found.</p>
        )}
        {/* Suggested Authors */}
        {!loading && searchQuery === "" && suggestedAuthors.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-purple-300 mb-5">Suggested Authors (MOST POPULARLY RATED)</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {suggestedAuthors.map((user) => (
                <li
                  key={user.$id}
                  className="flex items-center bg-gray-800 hover:bg-gray-700 p-4 rounded-xl cursor-pointer transition"
                  onClick={() => handleUserClick(user.$id, user.name, user.userprofile)}
                >
                  <img
                    src={
                      user.userprofile
                        ? service.getFilePreview(user.userprofile)
                        : "https://i.pinimg.com/736x/5d/69/42/5d6942c6dff12bd3f960eb30c5fdd0f9.jpg"
                    }
                    alt={user.name}
                    className="w-14 h-14 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="text-lg font-semibold">{user.name}</p>
                    <p className="text-sm text-purple-400">{user.bio || "Tech Enthusiast"}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>

  );
};

export default SearchUser;

