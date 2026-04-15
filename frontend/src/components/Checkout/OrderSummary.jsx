import React from "react";

export default function OrderSummary({ cartItems, shippingState }) {

    // Standard US State Tax Rates (2024 Average Combined Rates)
    const taxRates = {
        "AL": 0.0929, "AK": 0.0182, "AZ": 0.0840, "AR": 0.0947, "CA": 0.0725,
        "CO": 0.0810, "CT": 0.0635, "DE": 0.0000, "FL": 0.0702, "GA": 0.0735,
        "HI": 0.0444, "ID": 0.0603, "IL": 0.0886, "IN": 0.0700, "IA": 0.0694,
        "KS": 0.0875, "KY": 0.0600, "LA": 0.0955, "ME": 0.0550, "MD": 0.0600,
        "MA": 0.0625, "MI": 0.0600, "MN": 0.0750, "MS": 0.0707, "MO": 0.0839,
        "MT": 0.0000, "NE": 0.0701, "NV": 0.0823, "NH": 0.0000, "NJ": 0.0660,
        "NM": 0.0762, "NY": 0.0452, "NC": 0.0699, "ND": 0.0697, "OH": 0.0724,
        "OK": 0.0899, "OR": 0.0000, "PA": 0.0634, "RI": 0.0700, "SC": 0.0743,
        "SD": 0.0640, "TN": 0.0955, "TX": 0.0820, "UT": 0.0719, "VT": 0.0624,
        "VA": 0.0575, "WA": 0.0940, "WV": 0.0655, "WI": 0.0543, "WY": 0.0544
    };

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantitySelected, 0);

    // Get the rate for the current state, or default to 0 if not entered/found
    const stateKey = shippingState?.trim().toUpperCase();
    const currentTaxRate = taxRates[stateKey] || 0;

    const taxAmount = subtotal * currentTaxRate;
    const shipping = 10.00;
    const total = subtotal + taxAmount + shipping;

    return (
        <div
            style={{
                flex: 1,
                backgroundColor: "#fbfbfb",
                padding: "30px",
                borderRadius: "10px",
                border: "1px solid #ebebeb"
            }}
        >
            <h2
                style={{
                    display: "flex",
                    justifyContent: "center",
                    color: "#111",
                    marginBottom: "30px",
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

                    <div key={item.id} style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                        <img
                            src={item.image_url}
                            alt={item.name}
                            style={{ width: "65px", height: "65px", objectFit: "cover", borderRadius: "8px" }}
                        />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                borderBottom: "1px solid #ddd",
                                paddingBottom: "15px",
                                textAlign: "left",
                                width: "100%"
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
                    </div>
                ))}
            </div>

            {/* Price Calculation */}
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
                        ${subtotal.toFixed(2)}
                    </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#666" }}>Shipping & Processing</span>
                    <span style={{ fontWeight: "bold", color: "#111" }}>${shipping.toFixed(2)}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#666" }}>Tax {currentTaxRate > 0 && `(${(currentTaxRate * 100).toFixed(2)}%)`}</span>
                    <span style={{ fontWeight: "bold", color: "#111" }}>
                        ${taxAmount.toFixed(2)}
                    </span>
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
                        ${total.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
