import React, { useState } from "react";

export default function Button({
    children,
    onClick,
    variant = "primary", // can be "primary", "secondary", or "icon"
    type = "button",
    style = {},
    ariaLabel,
    disabled = false,
    loading = false,
}) {
    const [isHovered, setIsHovered] = useState(false);

    let baseStyle = {
        cursor: disabled || loading ? "not-allowed" : "pointer",
        fontWeight: "bold",
        transition: "all 0.2s ease-in-out",
        opacity: disabled ? 0.6 : 1,
    };

    if (variant === "primary") {
        baseStyle = {
            ...baseStyle,
            fontSize: "1.2rem",
            padding: "10px 30px",
            backgroundColor: isHovered && !disabled && !loading ? "#2b41c8" : "#324dec",
            color: "white",
            border: "none",
            borderRadius: "5px",
        };
    } else if (variant === "secondary") {
        baseStyle = {
            ...baseStyle,
            fontSize: "1.2rem",
            padding: "10px 30px",
            backgroundColor: isHovered && !disabled && !loading ? "#f0f0f0" : "white",
            color: isHovered && !disabled && !loading ? "#111" : "#333",
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
            color: isHovered && !disabled && !loading ? "#333" : "#999",
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
            onClick={disabled || loading ? undefined : onClick}
            style={baseStyle}
            aria-label={ariaLabel}
            disabled={disabled || loading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <span className="spinner" style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                    }} />
                    <span>Processing...</span>
                </div>
            ) : children}
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
        </button>
    );
}
