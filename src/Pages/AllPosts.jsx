import React, { useCallback, useEffect, useState } from "react";
import { Container,PostCard} from "../components";
import service from "../appwrite/database";
import SearchBar from "../components/Search.jsx"
import {  setPosts} from "../../src/store/postSlice.js"
import { useDispatch } from "react-redux";
import PromoCard from "../components/PromoCard.jsx";

const LIMIT=8;

function AllPosts(){
    const [posts,setPosts]=useState([])
    const [sortOption, setSortOption] = useState("new");
    const [page,setPage]=useState(0)
    const [hasMore,setHasMore]=useState(true)
    const [loading,setLoading]=useState(false)

    const observer=React.useRef()
    const dispatch=useDispatch()
    const fetchPosts = async (sortOption,offset) => {
        try {
            setLoading(true);
            const result = await service.getPosts(sortOption,LIMIT,offset); 
            //console.log(result.documents);
    
            if (result) {
                const newPosts = result.documents;
                setPosts((prev)=>[...prev,...newPosts]);
                //dispatch(setPosts([...posts,...newPosts]));
                setHasMore(newPosts.length === LIMIT);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
    // Reset everything when sort option changes
        setPosts([]);
        setPage(0);
        setHasMore(true);
    }, [sortOption]);

    useEffect(() => {
        fetchPosts(sortOption,0); //currently fetching posts with offset 0
    }, [page, sortOption]);

    const lastPostRef= useCallback((node)=>{
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    },[hasMore]);

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
        <div className="">
            <Container>
                <div>
                    {posts.map((post, idx) => {
                        const isLast = idx === posts.length - 1;
                        return (
                            <React.Fragment key={post.$id}>
                                
                                <div className="mb-4"
                                    ref={isLast ? lastPostRef : null}
                                    key={post.$id}
                                >
                                    <PostCard {...post} />
                                </div>
                                {idx >0  && idx % 4 === 0 && <PromoCard />}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Loader */}
                {loading && (
                    <div className="flex justify-center items-center py-4 w-full">
                        <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </Container>
        </div>
    </>
    )
}

export default AllPosts;
