import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import service from "../appwrite/database";
import { Link } from "react-router-dom";
import authService from "../appwrite/auth";
import { FaCommentDots } from "react-icons/fa";
import { AiFillLike, AiOutlineExport } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import ShareButton from "./shareFeature/shareOption";
function PostCard({ $id, title, featuredImg ,userId,likes,comments,userName,Views,content,exportCount}) {
  const [user,setUser]=useState(null)
  const navigate = useNavigate();
  
  useEffect(()=>{ 
    authService.getCurrUser().then((user)=>{
      if(user){
        setUser(user.$id)
      }
    })
    .catch((error)=>{
      console.log(error)
    })
  })
  const handleUserClick=()=>{
    navigate(`/user-info/${userId}`)
  }
  const handlePostClick = async () => {
    try {
      await service.updatePostViews($id); 
      navigate(`/post/${$id}`);
    } catch (error) {
      console.error("Failed to increment views:", error);
      navigate(`/post/${$id}`);
    }
  };
  const getPreviewText = (html, maxLength) => {
    if (!html) return "";

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const text = doc.body.textContent || "";

    const words = text.trim().split(/\s+/);
    if (words.length <= maxLength) return text;

    return words.slice(0, maxLength).join(" ") + "...";
  };
  const isUserPost=userId===user
return (
  <div className="w-full">
    <div
      onClick={handlePostClick}
      className={`cursor-pointer flex flex-col md:flex-row gap-6 w-full bg-black border-2 rounded-xl p-4 md:p-6 transition-all duration-300 hover:outline hover:outline-2 ${
        isUserPost ? "border-blue-500 hover:outline-purple-500" : "border-purple-700 hover:outline-purple-500"
      }`}
    >
      {/* Image */}
      <div className="w-full md:w-1/3 h-60 md:h-72 overflow-hidden rounded-xl">
        <img
          src={service.getFilePreview(featuredImg)}
          alt={title}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* Content */}
      <div className="w-full md:w-2/3 flex flex-col justify-between text-white">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-2">{title}</h2>

        {/* Content Preview */}
        <p className="text-gray-300 text-sm md:text-base mb-4 line-clamp-6">{getPreviewText(content, 100)}</p>
        <span className="text-purple-400 font-semibold ml-1 hover:underline">
          Read More
        </span>

        {/* Bottom Row */}
        <div className="flex justify-between items-center mt-auto">
          {/* Author */}
          <div className="flex flex-col gap-1">
            <span
              className="text-sm font-semibold text-purple-300 cursor-pointer hover:text-purple-400 transition"
              onClick={(e) => {
                e.stopPropagation(); 
                handleUserClick();
              }}
            >
              author: {userName}
            </span>
            <span className="bg-purple-900 text-xs rounded-full px-2 py-0.5 w-fit">
              #{isUserPost ? "Your Post" : "Public"}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-5 text-purple-400 text-sm">
            <span className="flex items-center gap-1">
              {Views} <AiOutlineEye size={16} />
            </span>
            <span className="flex items-center gap-1">
              {likes} <AiFillLike size={16} />
            </span>
            <span className="flex items-center gap-1">
              {comments.length} <FaCommentDots size={16} />
            </span>
            <span className="flex items-center gap-1">
              {exportCount} <AiOutlineExport size={16} />
            </span>
            
            <ShareButton 
              postUrl={`https://chronicle-woad.vercel.app/post/${$id}`} 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default PostCard ; 
