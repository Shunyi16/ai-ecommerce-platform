import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";

export default function Navbar({ cartCount, cartOnClick, accountOnClick, itemOnClick, logoOnClick, onSearch }) {
    const [categories, setCategories] = useState([]);
    const [hoveredCategory, setHoveredCategory] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/categories/")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.log("Error fetching categories:", err))
    }, [])

    return (
        <header style={{
            width: "100%",
            marginBottom: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 15px rgba(0,0,0,0.03)"
        }}>
            {/* Top Branding Row (Compact Single-Row Layout) */}
            <div style={{
                display: "flex",
                alignItems: "center",
                padding: "20px 0",
                width: "100%",
                boxSizing: "border-box"
            }}>
                {/* 1. Left: Search (Aligned to Grid Edge) */}
                <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
                    <SearchBar onSearch={onSearch} />
                </div>

                {/* 2. Center: Logo (Refined Compact Wordmark) */}
                <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    <h1
                        onClick={logoOnClick}
                        style={{
                            margin: 0,
                            fontSize: "1.7rem",
                            color: "#1a1a1a",
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: "300",
                            letterSpacing: "5px",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            transition: "opacity 0.3s ease"
                        }}
                        onMouseOver={(e) => e.target.style.opacity = "0.7"}
                        onMouseOut={(e) => e.target.style.opacity = "1"}
                    >
                        Home Lightings
                    </h1>
                </div>

                {/* 3. Right: Interaction Icons (Clean SVG Style) */}
                <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", gap: "35px" }}>
                    <div
                        onClick={accountOnClick}
                        style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            fontSize: "0.85rem",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            color: "#444",
                            transition: "color 0.3s ease"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = "#000"}
                        onMouseOut={(e) => e.currentTarget.style.color = "#444"}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Account "add this part just for testing 4"</span>
                    </div>
                    <div
                        onClick={cartOnClick}
                        style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            fontSize: "0.85rem",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            color: "#444",
                            transition: "color 0.3s ease"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = "#000"}
                        onMouseOut={(e) => e.currentTarget.style.color = "#444"}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        <span>Cart ({cartCount})</span>
                    </div>
                </div>
            </div>

            {/* Bottom Category Navigation */}
            <nav style={{
                display: "flex",
                justifyContent: "center",
                gap: "30px",
                fontSize: "0.80rem",
                fontWeight: "bold",
                letterSpacing: "2px",
                textTransform: "uppercase",
                borderBottom: "1px solid #e0dfdfff",

                padding: "18px 10px"
            }}>
                {categories.map((category) => (
                    <span
                        key={category.id}
                        onClick={() => itemOnClick(category)}
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        style={{
                            cursor: "pointer",
                            position: "relative",
                            color: category.name.toLowerCase() === "sale" ? "#d9534f" : "#555",
                            transition: "color 0.3s ease",
                            paddingBottom: "5px"
                        }}>
                        {category.name}
                        {/* Animated Underline */}
                        <div style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: hoveredCategory === category.id ? "100%" : "0%",
                            height: "1px",
                            backgroundColor: "#1a1a1a",
                            transition: "width 0.3s ease"
                        }} />
                    </span>
                ))}
            </nav>
        </header>
    );
}
