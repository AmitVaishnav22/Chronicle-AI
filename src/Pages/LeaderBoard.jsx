import React, { useEffect,useState } from 'react';
import authService from '../appwrite/auth';
import service from '../appwrite/database';
import { useNavigate } from 'react-router-dom';

function LeaderBoard() {
  const [month, setMonth] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [topRatedUsers, setTopRatedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    const init=async()=>{
      const monthHistory= await service.getAvailableMonths();
      //console.log("monthHistory",monthHistory);
      setMonth(monthHistory);
      if(monthHistory.length>0){
        setSelectedMonth(monthHistory[0]);
        loadTopRatedUsers(monthHistory[0].month);
      }
    }
    init();
  },[])
  const loadTopRatedUsers = async (month) => {
    setLoading(true);
    try {
      const topRated = await service.getTopRatedUsers(month);
      const sortedRatings = topRated.sort((a, b) => a.rank - b.rank);
      //console.log("topRated",sortedRatings)
      setTopRatedUsers(sortedRatings);

    } catch (error) {
      //console.error('Error fetching top rated users:', error);
    } finally {
      setLoading(false);
    }
  }
  const handleMonthChange = (e) => {
    const month=e.target.value;
    setSelectedMonth(month);
    loadTopRatedUsers(month);
  }

  const handleUserClick = (userId) => {
    if (!userId) return;
    navigate(`/user-info/${userId}`);
  }

  return (
  <>
  <div className="w-full bg-gradient-to-b from-black top-0 via-gray-900 to-black text-white">
    {/* Header Section */}
    <div className="flex flex-col items-center pt-10 pb-6 px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 mb-6 text-center">
        🏆 Welcome to Top Rated Authors Leaderboard
      </h1>

      {/* Rules + Image */}
      <div className="flex flex-col mt-5 md:flex-row items-center md:items-start justify-between gap-6 w-full max-w-6xl">
        <p className="text-sm md:text-base text-gray-300 text-left leading-snug w-full md:w-2/3">
          <span className="text-violet-400 font-semibold ">Leaderboard Rules:</span><br/>
          • Authors are ranked based on their <span className="text-pink-400">average rating</span> each month.<br />
          • Average is calculated as <code>total score ÷ number of votes</code>.<br />
          • Only authors with at least one rating are considered.<br />
          • Rankings refresh on the <span className="text-violet-400">1st of every month</span>.<br />
          • In case of a tie, the author with more votes ranks higher.<br />
          <span className="text-yellow-400 font-semibold">How to rate an author :<br />
          </span>
            1. Visit the author's profile via search or feed.<br />
            2. There will be rating button near author's profile.<br />
            3. Select a rating from 1 to 5 stars.<br /> 
            4. Submit your rating.<br />
          <span className="text-green-400 font-semibold">Vote regularly to support your favorite authors!</span>
        </p>
        <img
          src="https://www.pinclipart.com/picdir/big/54-540742_leaderboard-icon-free-download-leaderboard-icons-png-clipart.png"
          alt="Leaderboard Icon"
          className="w-50 md:w-56 h-auto object-contain animate-pulse"
        />
      </div>
    </div>

    {/* Leaderboard Content */}
    <div className="w-full mt-10 flex flex-col items-center px-4 pb-16">
      {/* Month Selector & Title */}
      <h2 className="text-3xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 mb-4">
         Top Rated Authors for{" "}
        {selectedMonth
          ? new Date(selectedMonth.month).toLocaleString("default", {
              year: "numeric",
              month: "long",
            })
          : "-"}
      </h2>

      <select
        value={selectedMonth}
        onChange={handleMonthChange}
        className="mb-8 p-2 rounded bg-gray-800 text-white border border-gray-600"
      >
        {month.map((m) => (
          <option key={m.$id} value={m.month}>
            {new Date(m.month).toLocaleString("default", {
              year: "numeric",
              month: "long",
            })}
          </option>
        ))}
      </select>

      {/* Loader */}
      {loading ? (
        <div className="py-4">
          <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : topRatedUsers.length > 0 ? (
        <>
          {/* Top 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mb-10 w-full px-4">
            {topRatedUsers.slice(0, 3).map((user, idx) => (
              <div
                onClick={() => handleUserClick(user?.userId)}
                key={user?.userId}
                className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-5 rounded-xl shadow-lg text-center border border-purple-600 cursor-pointer hover:shadow-xl hover:scale-105 transition-transform"
              >
                <div className="relative mb-4">
                  <img
                    src={
                      user.userprofile
                        ? service.getFilePreview(user.userprofile)
                        : "https://i.pinimg.com/736x/5d/69/42/5d6942c6dff12bd3f960eb30c5fdd0f9.jpg"
                    }
                    alt={user?.username}
                    className="w-24 h-24 rounded-full border-4 border-purple-500 object-cover mx-auto"
                  />
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black font-bold text-sm px-2 py-1 rounded-full">
                    #{idx + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-violet-300">{user?.username}</h3>
                <p className="text-sm text-gray-400">{user?.userBio || "No bio available"}</p>
                <div className="mt-3">
                  <p className="text-lg font-bold text-pink-400">Total Score: {user?.totalRatings || 0}</p>
                  <p className="text-sm text-gray-500">Votes: {user?.ratedByCount || 0}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Remaining Users Table */}
          {topRatedUsers.length > 3 && (
            <div className="w-full max-w-6xl px-4">
              <table className="min-w-full bg-black text-white rounded-md overflow-hidden border border-gray-800">
                <thead className="bg-gray-900 text-purple-300 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-3 text-left">Rank</th>
                    <th className="px-3 py-3 text-left">Avatar</th>
                    <th className="px-11 py-3 text-left">Name</th>
                    <th className="px-3 py-3 text-left">Score</th>
                    <th className="px-3 py-3 text-left">Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {topRatedUsers.slice(3).map((user, idx) => (
                    <tr
                      key={user?.userId}
                      onClick={() => handleUserClick(user?.userId)}
                      className="border-t border-gray-800 hover:bg-gray-800 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">#{idx + 4}</td>
                      <td className="px-4 py-3">
                        <img
                          src={
                            user.userprofile
                              ? service.getFilePreview(user.userprofile)
                              : "https://i.pinimg.com/736x/5d/69/42/5d6942c6dff12bd3f960eb30c5fdd0f9.jpg"
                          }
                          alt={user?.username}
                          className="w-10 h-10 rounded-full border-2 border-gray-500 object-cover"
                        />
                      </td>
                      <td className="px-4 py-3">{user?.username}</td>
                      <td className="px-4 py-3">{user?.totalRatings}</td>
                      <td className="px-4 py-3">{user?.ratedByCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-lg mt-10">No top users found for this month.</p>
      )}
    </div>
  </div>
  </>
  );
}

export default LeaderBoard;

