import React, { useState } from "react";

export default function Button({
    children,
    onClick,
    variant = "primary", // can be "primary", "secondary", or "icon"
    type = "button",
    style = {},
    ariaLabel,
}) {
    const [isHovered, setIsHovered] = useState(false);

    let baseStyle = {
        cursor: "pointer",
        fontWeight: "bold",
        transition: "all 0.2s ease-in-out",
    };

    if (variant === "primary") {
        baseStyle = {
            ...baseStyle,
            fontSize: "1.2rem",
            padding: "10px 30px",
            backgroundColor: isHovered ? "#2b41c8" : "#324dec",
            color: "white",
            border: "none",
            borderRadius: "5px",
        };
    } else if (variant === "secondary") {
        baseStyle = {
            ...baseStyle,
            fontSize: "1.2rem",
            padding: "10px 30px",
            backgroundColor: isHovered ? "#f0f0f0" : "white",
            color: isHovered ? "#111" : "#333",
            border: "1px solid #ccc",
            borderRadius: "5px",
        };
    } else if (variant === "icon") {
        baseStyle = {
            ...baseStyle,
            position: "absolute",
            background: "none",
            border: "none",
            fontSize: "2rem",
            color: isHovered ? "#333" : "#999",
            padding: "5px",
            lineHeight: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "normal",
        };
    }

    baseStyle = { ...baseStyle, ...style };

    return (
        <button
            type={type}
            onClick={onClick}
            style={baseStyle}
            aria-label={ariaLabel}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </button>
    );
}
