import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import service from "../../appwrite/database";
import { Trash2 } from "lucide-react"; 
import { Eye } from "lucide-react"; 

function UserAds() {
  const user = useSelector((state) => state.auth?.userData);
  const [userAds, setUserAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserAds = async () => {
    try {
      const res = await service.getAdByUserId(user?.$id);
      //console.log("Fetched user ads:", res);
      const ads = res || []; 
      setUserAds(ads);
    } catch (error) {
      console.error("Error fetching user ads:", error);
      setUserAds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAd = async (adId) => {
    try {
      await service.deleteAd(adId);
      setUserAds(prev => prev.filter(ad => ad.$id !== adId));
    } catch (err) {
      console.error("Failed to delete ad:", err);
    }
  };

  useEffect(() => {
    if (user?.$id) fetchUserAds();
  }, [user?.$id]);

  return (
  <div className="min-h-screen bg-black px-4 py-10 text-white flex flex-col items-center">
    <div className="w-full max-w-xl text-center mb-6">
      <h1 className="text-2xl font-semibold text-purple-300 mb-1">Your Chronicle Ads</h1>
      <p className="text-gray-500 text-sm">
        Here you can view, manage, and delete your submitted ads. Each user can submit one ad that may appear across the platform. 
        <br />
        <strong>Note:</strong> Ads are subject to review and may not appear immediately.
      </p>
    </div>

    <div className="w-full max-w-xl">
      {loading ? (
        <p className="text-purple-400 animate-pulse text-sm text-center">Loading your ads...</p>
      ) : userAds.length > 0 ? (
        <ul className="space-y-3">
          {userAds.map((ad) => (
            <li
              key={ad.$id}
              className="flex justify-between items-center bg-[#111] rounded-md px-4 py-3 border border-gray-800"
            >
              <div className="flex flex-col">
                <h3 className="font-medium text-sm text-purple-300 truncate max-w-xs">{ad.title}</h3>
                <p className="text-gray-400 text-xs truncate max-w-xs">{ad.description}</p>
                {ad.url && (
                  <a
                    href={ad.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 text-xs mt-1 hover:underline"
                  >
                    🔗 Visit
                  </a>
                )}
              </div>

              <div className="flex flex-col items-end gap-1 text-right">
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Eye size={14} /> {ad.NoOfClicks || 0} clicks
                </div>
                <p className="text-xs text-gray-400">
                  Moderation: 
                  {ad.moderationStatus === "APPROVED" && <span className="ml-1 text-green-400">Approved</span>}
                  {ad.moderationStatus === "PENDING" && <span className="ml-1 text-yellow-400 animate-pulse"> Pending</span>}
                  {ad.moderationStatus === "REJECTED" && <span className=" ml-1 text-red-400">Rejected </span> 
                  && ` (${ad.moderationReason})`}
                </p>
                <button
                  onClick={() => handleDeleteAd(ad.$id)}
                  className="text-red-400 hover:text-red-600 transition"
                  title="Delete Ad"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-sm text-center">You have no ads submitted yet.</p>
      )}
    </div>
  </div>
);
}
export default UserAds;
