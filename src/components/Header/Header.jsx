import React, { useState } from "react";
import { Container, Logo, Loader } from "../index";
import { Link, useNavigate , useLocation} from "react-router-dom";
import { useSelector } from "react-redux";
import MoreOptions from "./MoreOptions";

function Header() {
    const [loading, setLoading] = useState(false);
    const authStatus = useSelector((state) => state.auth?.status || false);
    const navigate = useNavigate();
    const location = useLocation();

    const navItem = [
        { name: "Home", slug: "/", active: true },
        { name: "Login", slug: "/login", active: !authStatus },
        { name: "Signup", slug: "/signup", active: !authStatus },
        { name: "Feed", slug: "/all-posts", active: authStatus },
        { name: "Add Post", slug: "/add-post", active: authStatus },
        { name: "Search", slug: "/search-user", active: authStatus },
        { name: "News", slug: "/trending-news", active: true },
        { name: "ChronicleAI", slug: "/chronicle-ai", active: authStatus },
        { name: "LeaderBoard", slug: "/leaderboard", active: true }
    ];

    const handleNavigation = (slug) => {
        setLoading(true);
        navigate(slug);
        setTimeout(() => setLoading(false), 500);
    };

    return (
        <header className="top-0 z-50 shadow-m bg-black text-white">
            <Container>
                <nav className="flex items-center justify-between py-4">
                    <Link to="/" className="mr-5">
                        <Logo width="70px" />
                    </Link>
                    <ul className="flex gap-8 flex-wrap">
                        {navItem.map((item) =>
                            item.active ? (
                                <li key={item.name} className="relative">
                                    <button
                                        onClick={() => handleNavigation(item.slug)}
                                        className={`flex items-center gap-2 px-2 py-1 transition-all duration-200
                                            ${location.pathname === item.slug
                                                ? "text-violet-600 text-xl font-semibold border-b-2 border-violet-600"
                                                : "text-gray-400 text-xl hover:text-violet-600"}
                                        `}
                                    >
                                        {item.name}
                                    {item.name === "LeaderBoard" && (
                                        <span className="absolute -top-2 -right-2 bg-red-400 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                                           NEW
                                        </span>
                                    )}
                                    </button>
                                    
                                </li>
                            ) : null
                        )}
                        {authStatus && (
                            <li>
                                <MoreOptions />
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



