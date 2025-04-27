import React, { useEffect, useState } from "react";
import { Container,PostCard} from "../components";
import service from "../appwrite/database";
import SearchBar from "../components/Search.jsx"
import {  setPosts} from "../../src/store/postSlice.js"
import { useDispatch } from "react-redux";


function AllPosts(){
    const [posts,setPostss]=useState([])
    const [sortOption, setSortOption] = useState("new");
    const dispatch=useDispatch()
    const fetchPosts = async (sortOption) => {
        try {
            const result = await service.getPosts(sortOption); 
            //console.log(result.documents);
    
            if (result) {
                setPostss(result.documents);
                dispatch(setPosts(result.documents));
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        fetchPosts(sortOption);
    }, [sortOption]);

    return (
        <>
        <h1 className="text-xl font-bold mb-6 text-red-800 text-center">
            This is the feed section, containing all the posts that where uploaded by different users across this platform
        </h1>
        <SearchBar/>
        {/* Sort Dropdown */}
        <div className="flex justify-front p-4">
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-black text-purple-400 border border-purple-700 rounded-md px-4 py-2"
                >
                    <option value="new">Newly Posted</option>
                    <option value="popular">Most Popular</option>
                    <option value="old">Oldest Posted</option>
                </select>
            </div>
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post)=>(
                        <div key={post.$id} className="p-2 w-1/4">
                            <PostCard {...post}/>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    </>
    )
}

export default AllPosts;
