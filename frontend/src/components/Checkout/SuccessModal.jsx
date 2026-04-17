import React from "react";
import Button from "../common/Button";

export default function SuccessModal({ isOpen, order, closeSuccess }) {
    if (!isOpen || !order) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 2000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    padding: "50px",
                    borderRadius: "24px",
                    maxWidth: "500px",
                    width: "90%",
                    textAlign: "center",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
            >
                <div style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#f0fdf4",
                    color: "#22c55e",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto 30px auto",
                    fontSize: "3rem",
                }}>
                    ✓
                </div>
                
                <h2 style={{ fontSize: "1.8rem", marginBottom: "15px", color: "#111", fontWeight: "700" }}>Order Placed!</h2>
                <p style={{ fontSize: "1rem", color: "#666", marginBottom: "30px", lineHeight: "1.5" }}>
                    Thank you for your purchase. We've received your order and are getting it ready.
                </p>

                <div style={{ 
                    backgroundColor: "#f9fbfd", 
                    padding: "20px", 
                    borderRadius: "16px", 
                    marginBottom: "30px",
                    textAlign: "center",
                    border: "1px solid #eef2f6"
                }}>
                    <span style={{ color: "#64748b", fontSize: "0.9rem", display: "block", marginBottom: "5px" }}>Order Number</span>
                    <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "1.4rem" }}>{order.order_number}</span>
                </div>

                <Button
                    variant="primary"
                    onClick={closeSuccess}
                    style={{ width: "100%", padding: "14px", borderRadius: "12px" }}
                >
                    Continue Shopping
                </Button>
            </div>
        </div>
    );
}
