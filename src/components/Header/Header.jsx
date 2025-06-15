import React, { useState } from "react";
import { Container, Logo,Loader} from "../index";  
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MoreOptions from "./MoreOptions";

function Header() {
    const [loading, setLoading] = useState(false);  
    const authStatus = useSelector((state) => state.auth?.status || false);
    const navigate = useNavigate();
    
    const navItem = [
        { name: "Home", slug: "/", active: true },
        { name: "Login", slug: "/login", active: !authStatus },
        { name: "Signup", slug: "/signup", active: !authStatus },
        { name: "Feed", slug: "/all-posts", active: authStatus },
        { name: "Add Post", slug: "/add-post", active: authStatus },
        { name: "Search", slug: "/search-user", active: authStatus , icon: "https://thumbs.dreamstime.com/b/search-user-simple-icon-profile-avatar-magnifying-glass-sign-male-person-silhouette-symbol-circle-flat-button-shadow-vector-117264258.jpg" ,isLogo: true },
        { name: "News", slug: "/trending-news",active : true, icon:"https://th.bing.com/th/id/OIP.EGNzjKdYpHfthDMpp1pkuAHaHa?cb=thvnextc1&rs=1&pid=ImgDetMain"},
        {name: "BlogAI", slug:"/chronicle-ai",active: authStatus ,icon: "https://images.ctfassets.net/kftzwdyauwt9/2i61iTTUDpWjwTbl6cdJkL/a60bb9ad83127262f5022aabcede01a6/DON-T_add_any_colors_to_the_Blossom.png?w=1080&q=90&fm=webp", isLogo:true }

        
    ];

    const handleNavigation = (slug) => {
        setLoading(true);  
        navigate(slug);
        setTimeout(() => setLoading(false), 500);  
    };

     return (
        <header className="top-0 z-50">
            <Container>
                <nav className="flex">
                    <div className="mr-4">
                        <Link to="/">
                            <Logo width="70px" />
                        </Link>
                    </div>
                    <ul className="flex ml-auto">
                        {navItem.map((item) =>
                            item.active ? (
                                <li key={item.name} className="mx-2">
                                    {item.icon ? (
                                        <button
                                            onClick={() => handleNavigation(item.slug)}
                                            className="flex items-center bottom-0"
                                        >
                                            <img
                                                src={item.icon} 
                                                alt="BlogAI"
                                                className="h-10 w-10 rounded-full object-cover" 
                                            />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleNavigation(item.slug)}
                                            className="relative inline-block px-6 py-2 text-white bg-black border-2 border-transparent rounded-full hover:text-black hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                                        >
                                            {item.name}
                                            <span className="absolute inset-0 rounded-full border-2 border-purple-500 group-hover:border-pink-500 transition-all duration-300"></span>
                                        </button>
                                    )}
                                </li>
                            ) : null
                        )}
                        {authStatus && (
                            <li>
                                <MoreOptions/>                                
                            </li>
                        )}
                    </ul>
                </nav>
            </Container>
            {loading && <Loader />} 
        </header>
    );
}


export default Header;
