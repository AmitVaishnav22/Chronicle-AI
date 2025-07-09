// components/PromoCard.jsx
import React from "react";
import service from "../appwrite/database";

const PromoCard = ({id,title,desciption,url}) => {
  const handleClick = async()=> {
    try {
      if(url){
        // Open the URL in a new tab
        window.open(url, "_blank");
        
        // Increment the click count for the ad
        await service.incrementAdCounts(id);
      }
      
    } catch (error) {
      console.error("Error handling click:", error);
    }
  }
  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black border border-blue-700 rounded-lg shadow-xl p-6 my-6 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-blue-400">🚀 {title}</h2>
          <p className="text-gray-300 mt-1">
            {desciption}
          </p>
        </div>
        {url && (
          <button
            onClick={() => handleClick()}
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg"
          >
          Try it Now
        </button>)}
      </div>
    </div>
  );
};

export default PromoCard;
