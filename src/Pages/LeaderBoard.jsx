import React from 'react';

function LeaderBoard() {
  return (
    <div className="relative top-0 w-full">
      <div className="min-h-screen bg-gradient-to-b from-black pt-4 via-gray-900 to-black text-white flex flex-col items-center px-4 py-12 w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 mb-6 animate-fadeIn">
          🏆 Top Rated Authors Leaderboard
        </h1>
        <p className="text-base md:text-lg text-gray-300 mb-6 text-center max-w-2xl leading-relaxed animate-fadeIn delay-200">
          Rate your favorite authors and see who’s on the top every month ! <br />
          Voting resets on the <span className="text-violet-400 font-semibold">1st of each month</span>. <br />
          <span className="text-pink-400 font-semibold">Your votes matter !</span><br />
          <span className="text-red-400 font-semibold"> LIVE NOW , start rating your favorite authors and help them climb the leaderboard!</span>
        </p>
        <p className="text-xl text-violet-300 font-bold mb-8 animate-bounce">🚧 Coming Soon 🚧</p>
        <img
          src="https://www.pinclipart.com/picdir/big/54-540742_leaderboard-icon-free-download-leaderboard-icons-png-clipart.png"
          alt="Coming Soon"
          className="w-48 md:w-64 h-48 md:h-64 object-contain animate-pulse"
        />
      </div>
    </div>
  );
}

export default LeaderBoard;

