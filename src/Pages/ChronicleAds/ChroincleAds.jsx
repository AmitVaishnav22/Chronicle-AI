import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import service from "../../appwrite/database";
import { useSelector } from "react-redux";
import UserAds from "./UserAds";
import AiJudgeService from "./AgenticAI_Judge";
import { Unlink } from "lucide-react"; // Importing icons for future use
import ChoronoDropAD from "../../components/Ads/ChronoDropPromotion";

const ChronicleAds = () => {
  const [formData, setFormData] = useState({ title: "", description: "", url: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth?.userData);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const newAd = await service.createAd({ ...formData, userId: user.$id, NoOfClicks: 0 , moderationStatus: "PENDING" , moderationReason: "" });

      AiJudgeService.sendAd({
        adId: newAd.$id,
        title: formData.title,
        description: formData.description,
        url: formData?.url || "",
      }).catch((err) => console.error("AI moderation failed:", err));

      setIsOpen(false)
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Ad submission failed");
    }
  };
  const handleClose = () => {
    setIsOpen(false);
    setFormData({ title: "", description: "", url: "" });
    setSubmitted(false);
    setError("");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-16 flex flex-col items-center justify-center">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-12">
          
          {/* Left Section: Intro + AI Flow + Form */}
          <div className="w-full md:w-2/3">
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-4 animate-pulse">
              📢 ChronicleAds — Let Your Projects Shine!
            </h1>
            
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              ChronicleAds allows every user to showcase one personal or public project across our community. Whether it’s your portfolio, a side project, or a tool — if it brings value, it belongs here.
            </p>

            <div className="bg-gray-700/60 rounded-xl p-6 mb-6 shadow-inner">
              <h2 className="text-purple-400 font-semibold text-xl mt-0 mb-2">Features</h2>
              <ul className="pl-6 text-yellow-400 mb-6 text-sm md:text-base space-y-1">
                <li>One ad per user (you can update it anytime)</li>
                <li>Custom title, description & live project URL</li>
                <li>Click tracking and moderation status</li>
                <li>Get featured in user feeds, profile views & more</li>
              </ul>
              <h2 className="text-purple-400 font-semibold text-xl mb-2">How Agentic AI Moderation Works:</h2>
              <ol className="text-green-300 pl-6 space-y-1 text-sm md:text-base">
                <li>You submit your ad (title, description, and project link).</li>
                <li>Our intelligent Agentic AI Judge immediately reviews it in the background.</li>
                <li>It checks for safety, relevance, spam, and prohibited content.</li>
                <li>Once verified, your ad becomes eligible to appear on the platform-wide feed.</li>
                <li>You can track real-time click stats and moderation status.</li>
              </ol>
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-3 rounded-full font-semibold transition duration-300 shadow-lg"
            >
              ➕ Add Your Ad
            </button>

            {submitted && (
              <div className="mt-4 text-green-400 text-center font-medium">
                ✅ Your ad was submitted!{" "}
                <Link to={`/user-info/${user.$id}`} className="text-purple-400 underline hover:text-purple-300">
                  View on your Ads Page
                </Link>
              </div>
            )}
          </div>

          {/* Right Section: Image */}
          <div className="w-full md:w-1/3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/8472/8472023.png"
              alt="Ad illustration"
              className="w-full h-auto rounded-lg shadow-lg hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4">
          <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-lg shadow-xl relative">
            <button
              onClick={handleClose}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-400 text-xl"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4 text-purple-400 text-center">Submit Your Chronicle Ad</h2>
            {error && <p className="text-red-500 mb-2 text-sm text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                required
                className="w-full p-3 text-white rounded-lg bg-gray-800"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <textarea
                placeholder="Short Description"
                required
                className="w-full p-3 text-white rounded-lg bg-gray-800"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <input
                type="url"
                placeholder="Your Website / Project URL"
                className="w-full p-3 text-white rounded-lg bg-gray-800"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-800 text-white py-3 rounded-lg font-semibold"
              >
                Submit Ad
              </button>
              <p className="text-sm text-gray-400 text-center mt-2">
                By submitting, you agree to our{" "}
                <Link to="/" className="text-purple-400 hover:underline">Terms of Service</Link>.
              </p>
            </form>
          </div>
        </div>
      )}

      <UserAds />
      <ChoronoDropAD/>
    </>

  );
};

export default ChronicleAds;
