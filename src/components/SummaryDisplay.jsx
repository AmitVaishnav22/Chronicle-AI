import React from "react";

function SummaryDisplay({ summary }) {
  return (
    <div >
      <h2 className="text-lg font-bold mb-2">Summary</h2>
      <p className="text-sm mb-4">{summary}</p>
      <div className="text-xs text-purple-300 italic">
        Find the response accurate? <span className="underline cursor-pointer hover:text-purple-400">Upvote!</span>
      </div>
    </div>
  );
}

export default SummaryDisplay;