import React from "react";

export default function OrderSummary({ cartItems }) {
    return (
        <div
            style={{
                flex: 1,
                backgroundColor: "#fbfbfb",
                padding: "30px",
                borderRadius: "10px",
                border: "1px solid #ebebeb",
                marginBottom: "30px"
            }}
        >
            <h2
                style={{
                    display: "flex",
                    justifyContent: "center",
                    color: "#111",
                    marginBottom: "30px",
                    marginTop: 0,
                }}
            >
                Order Summary
            </h2>

            {/* Cart Items List */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    marginBottom: "30px",
                }}
            >
                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            borderBottom: "1px solid #ddd",
                            paddingBottom: "15px",
                        }}
                    >
                        <p
                            style={{
                                textAlign: "left",
                                margin: "0 0 10px 0",
                                fontWeight: "bold",
                                color: "#222",
                            }}
                        >
                            {item.name}
                        </p>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "5px",
                            }}
                        >
                            <span style={{ color: "#666" }}>Quantity</span>
                            <span style={{ fontWeight: "600", color: "#111" }}>
                                {item.quantitySelected}
                            </span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#666" }}>Price</span>
                            <span style={{ fontWeight: "600", color: "#111" }}>
                                ${(item.price * item.quantitySelected).toFixed(2)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Receipt Totals */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    fontSize: "1.05rem",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#666" }}>Product Total</span>
                    <span style={{ fontWeight: "bold", color: "#111" }}>
                        $
                        {cartItems
                            .reduce(
                                (total, item) => total + item.price * item.quantitySelected,
                                0
                            )
                            .toFixed(2)}
                    </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#666" }}>Shipping & Processing</span>
                    <span style={{ fontWeight: "bold", color: "#111" }}>$10.00</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#666" }}>Tax</span>
                    <span style={{ fontWeight: "bold", color: "#111" }}>$10.00</span>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "15px",
                        paddingTop: "15px",
                        borderTop: "2px solid #ccc",
                        fontSize: "1.3rem",
                    }}
                >
                    <span style={{ fontWeight: "bold", color: "#111" }}>Total</span>
                    <span style={{ fontWeight: "bold", color: "#111" }}>
                        $
                        {(
                            cartItems.reduce(
                                (total, item) => total + item.price * item.quantitySelected,
                                0
                            ) + 20
                        ).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
