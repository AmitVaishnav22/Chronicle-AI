// components/PromoCard.jsx
import React from "react";

const PromoCard = () => {
  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black border border-blue-700 rounded-lg shadow-xl p-6 my-6 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-blue-400">🚀 Try RTEX — Real-Time Collaborative Text Editor</h2>
          <p className="text-gray-300 mt-1">
            Collaborate and write articles live with peers. Fast, clean, and real-time!
          </p>
        </div>
        <button
          onClick={() => window.open("https://rtex.vercel.app/", "_blank")}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg"
        >
          Try RTEX
        </button>
      </div>
    </div>
  );
};

export default PromoCard;
