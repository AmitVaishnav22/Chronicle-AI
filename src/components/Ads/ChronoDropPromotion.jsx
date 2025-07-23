import React from "react";
const url = "https://chrono-drop-service.vercel.app/"
const ChoronoDropAD= () => {
  const handleClick = async()=> {
    try {
        window.open(url, "_blank");
    } catch (error) {
      console.error("Error handling click:", error);
    }
  }
  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black border border-purple-700 rounded-lg shadow-xl p-6 my-6 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-purple-400">🚀 ChronoDrop - Instantly Export Any Public ChronicleAI Article</h2>
          <p className="text-gray-300 mt-1">
            {
                <p>Chronodrop — a zero-login tool to extract and export any public Chronicle post into clean Exports.</p>
            }
          </p>
        </div>
        
          <button
            onClick={() => handleClick()}
            className="bg-purple-600 hover:bg-purple-800 text-white font-bold px-4 py-2 rounded-lg"
          >
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default ChoronoDropAD;