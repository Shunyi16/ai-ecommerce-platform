import React from "react";

export function ErrorMessage({ message }) {
    if (!message) {
        return <div style={{ height: "16px", marginBottom: "8px" }} />;
    }
    
    return (
        <div style={{
            color: "#d93025",
            fontSize: "0.80rem",
            fontWeight: "bold",
            marginBottom: "8px",
            textAlign: "left"
        }}>
            {message}
        </div>
    );
}

export default function InputField({
    label,
    name,
    value,
    onChange,
    error,
    placeholder,
    maxLength,
    type = "text",
    required = true,
}) {
    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {label && (
                <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>
                    {label}
                    {required && (
                        <span style={{ color: "red", fontWeight: "bold", fontSize: "0.9rem", marginLeft: "4px" }}>
                            *
                        </span>
                    )}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                style={{
                    width: "100%",
                    padding: "12px",
                    margin: "8px 0 4px 0",
                    borderRadius: "6px",
                    border: error ? "1px solid #d93025" : "1px solid #ccc",
                    backgroundColor: "white",
                    color: "#333",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                }}
            />
            <ErrorMessage message={error} />
        </div>
    );
}
