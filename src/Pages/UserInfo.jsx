import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../store/authSlice";
import authService from "../appwrite/auth.js";
import service from "../appwrite/database.js";
import { Query } from "appwrite";
import { Button } from "../components/index.js";
import { Pencil } from "lucide-react";
import LikedPost from "./LikedPost.jsx";
import YourPosts from "./YourPosts.jsx";
import Drafts from "./Drafts";
import Bookmarks from "./Bookmarks";
import ReactStars from "react-rating-stars-component";
import UserAds from "./ChronicleAds/UserAds.jsx"; 


export default function UserInfo() {
    const { userId } = useParams(); 
    const dispatch = useDispatch();
    const authUser = useSelector((state) => state.auth?.userData);
    
    const isCurrentUser = authUser?.$id === userId;

    const [profileUser, setProfileUser] = useState(null);
    const [activeTab, setActiveTab] = useState("posts");
    const [newBio, setNewBio] = useState("");
    const [newImage, setNewImage] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [posts, setPosts] = useState([]);
    const [rating, setRating] = useState(0);
    const [hasRated, setHasRated] = useState(false);

    const tabs = [
        { id: "posts", label: "Posts" },
        { id: "drafts", label: "Drafts" },
        { id: "bookmarks", label: "Bookmarks" },
        { id: "liked", label: "Liked Posts" },
        { id: "chronicleads", label: "Chronicle Ads" }
    ];

    /** Fetch user's posts **/
    useEffect(() => {
        if (userId) {
            service.getPosts([Query.equal("userId", userId)])
                .then((posts) => {
                    if (posts) setPosts(posts.documents);
                })
                .catch((error) => console.error("Error fetching posts:", error));
        }
    }, [userId]);

    /** Fetch target user's profile **/
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await authService.getUserById(userId); 
                setProfileUser(userData);
                setNewBio(userData?.bio || ""); 
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    /** Track changes for Save button **/
    useEffect(() => {
        if (newBio !== profileUser?.bio || newImage) {
            setHasChanges(true);
        } else {
            setHasChanges(false);
        }
    }, [newBio, newImage, profileUser]);

    /** Handle profile update **/
    const handleUpdateProfile = async () => {
        if (!hasChanges) return;
        setUpdating(true);

        try {
            let profilePicId = profileUser?.userprofile;

            // Upload new image if selected
            if (newImage) {
                const file = await service.uploadFile(newImage);
                if (file) {
                    profilePicId = file.$id;
                    if (profileUser?.userprofile) await service.deleteFile(profileUser.userprofile);
                }
            }

            // Update in Appwrite DB
            await authService.updateUser(profileUser?.$id, { bio: newBio, userprofile: profilePicId });

            // Refetch updated data
            const updatedUser = await authService.getUserById(userId);
            setProfileUser(updatedUser);

            if (isCurrentUser) {
                dispatch(updateProfile({ userData: updatedUser }));
                localStorage.setItem("userData", JSON.stringify(updatedUser));
            }

            setEditMode(false);
            setNewImage(null);
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setUpdating(false);
        }
    };
    /** Check if user has already rated **/
    useEffect(() => {
    const checkIfAlreadyRated = async () => {
        if (!authUser || !userId || authUser.$id === userId) return;

        try {
        const ratings = await service.getRatingsForUser(authUser.$id, userId);
        // console.log("Ratings for user:", ratings);
        if (!ratings || ratings.documents.length === 0) {
            setHasRated(false);
            return;
        }
        setHasRated(true);
        } catch (err) {
        console.error("Error checking rating status:", err);
        }
    };

    checkIfAlreadyRated();
    }, [authUser, userId]);

    /** Handle rating submission **/
    const handleRatingSubmit = async () => {
        if (!authUser || !rating) return;
        try {

            await service.submitRating(authUser.$id, userId, rating);
            await service.updateUserRating(userId, rating);
            setHasRated(true);
            setRating(0);

        } catch (err) {
            console.error("Error submitting rating:", err);
        }
    };


    if (!profileUser) return <p>Loading user profile...</p>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-black text-white min-h-screen">
            <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                {/* Profile Image */}
                <div className="relative group w-48 h-48 flex-shrink-0">
                    <img 
                        src={profileUser?.userprofile ? service.getFilePreview(profileUser.userprofile) : "default-profile.png"} 
                        alt={profileUser?.name} 
                        className="w-full h-full rounded-full object-cover border-4 border-purple-600" 
                    />
                    
                    {isCurrentUser && (
                        <label className="absolute bottom-2 right-2 bg-black/80 p-2 rounded-full cursor-pointer hover:bg-black transition-all">
                            <Pencil className="w-5 h-5 text-white" />
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => setNewImage(e.target.files[0])} 
                            />
                        </label>
                    )}
                </div>
                {!isCurrentUser && (
                <div className="mt-0 p-1 rounded-lg shadow-md transition-all duration-300 animate-fadeIn">
                    {hasRated ? (
                    <p className="text-green-400 font-medium flex items-center gap-1">
                        Your rating has been recorded. Thank you! You can vote again next month.
                    </p>
                    ) : (
                    <>
                        <h4 className="text-gray-200 text-lg mb-0 font-semibold">
                        Rate {profileUser.name} for{" "}
                        <span className="font-bold">
                            {new Date().toLocaleString('default', { month: 'long' })}
                        </span>
                        :
                        </h4>

                        <div className="transition-transform duration-200 hover:scale-105 ml-2">
                        <ReactStars
                            count={5}
                            size={32}
                            value={rating}
                            onChange={(newRating) => setRating(newRating)}
                            activeColor="#a855f7"
                        />
                        </div>

                        <Button
                        onClick={handleRatingSubmit}
                        className="mt-3 bg-purple-600 hover:bg-purple-700 px-4 py-1 text-sm transition-all duration-200"
                        disabled={rating === 0}
                        >
                        Submit Rating
                        </Button>
                    </>
                    )}
                </div>
                )}


                {/* User Info Section */}
                <div className="flex-1 space-y-4">
                    
                    <h1 className="text-4xl font-bold">{profileUser?.name}</h1>
                    <h1 className="text-4xl font-bold">{profileUser?.email}</h1>
                    <p className="text-gray-300 text-lg">Joined: {profileUser?.$createdAt ? new Date(profileUser.$createdAt).toDateString() : "N/A"}</p>
                    <p className="text-gray-300 text-lg">Users Rated {profileUser?.name} this month : {profileUser.ratedByCount}</p>
                    {/* Bio Section */}
            
                   <div className="space-y-2">
                        {isCurrentUser ? (
                            editMode ? (
                                <input
                                    type="text"
                                    value={newBio}
                                    onChange={(e) => setNewBio(e.target.value)}
                                    className="p-2 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                                    placeholder="Tell us about yourself..."
                                    autoFocus
                                />
                            ) : (
                                <p 
                                    className="text-gray-300 text-lg cursor-pointer hover:underline"
                                    onClick={() => setEditMode(true)}
                                >
                                    Bio: {profileUser?.bio || "Click to add bio"}
                                </p>
                            )
                        ) : (
                            <p className="text-gray-300 text-lg">Bio: {profileUser?.bio || "No bio available"}</p>
                        )}
                    </div>

                    {/* Save Button */}
                    {isCurrentUser && hasChanges && (
                        <Button onClick={handleUpdateProfile} disabled={updating} className="bg-purple-600 hover:bg-purple-700 px-4 py-1 text-sm">
                            {updating ? "Saving..." : "Save"}
                        </Button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-800 pt-8">
                <div className="flex gap-6 mb-8 overflow-x-auto pb-2">
                    {tabs.map((tab) => (
                        isCurrentUser || !["drafts", "bookmarks","chronicleads"].includes(tab.id) ? (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 text-lg font-medium ${activeTab === tab.id ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400 hover:text-gray-200"}`}
                            >
                                {tab.label}
                            </button>
                        ) : null
                    ))}
                </div>
                <div className="space-y-6">
                    {activeTab === "posts" && <YourPosts userId={userId} />}
                    {activeTab === "liked" && <LikedPost userId={userId} />}
                    {activeTab === "drafts" && isCurrentUser && <Drafts />}
                    {activeTab === "bookmarks" && <Bookmarks />}
                    {activeTab === "chronicleads" && <UserAds />}
                </div>
            </div>
        </div>
    );
}
