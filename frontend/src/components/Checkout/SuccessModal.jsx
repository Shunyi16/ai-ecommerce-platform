import React from "react";
import Button from "../common/Button";

export default function SuccessModal({ isOpen, orderId, closeSuccess }) {
    if (!isOpen) return null;

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
                    borderRadius: "10px",
                    maxWidth: "500px",
                    width: "90%",
                    textAlign: "center",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
            >
                <div style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto 30px auto",
                    fontSize: "3rem",
                }}>
                    ✓
                </div>
                
                <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#111" }}>Order Placed!</h2>
                <p style={{ fontSize: "1rem", color: "#666", marginBottom: "10px" }}>
                    Thank you for your purchase. We've received your order and are getting it ready.
                </p>
                <p style={{ fontWeight: "bold", color: "#324dec", fontSize: "1.1rem", marginBottom: "40px" }}>
                    Order ID: {orderId}
                </p>

                <Button
                    variant="primary"
                    onClick={closeSuccess}
                    style={{ width: "100%" }}
                >
                    Continue Shopping
                </Button>
            </div>
        </div>
    );
}
