import React from "react";

export default function AddressFields({ info, onChange, errors = {}, getInputStyle, renderError }) {

    // Provide default generic styling if used in Checkout.jsx without Payment.jsx's robust error handlers
    const safeGetInputStyle = getInputStyle || (() => ({
        width: "100%",
        padding: "12px",
        margin: "8px 0 20px 0",
        borderRadius: "6px",
        border: "1px solid #ccc",
        backgroundColor: "white",
        color: "#333",
        fontSize: "1rem",
        boxSizing: "border-box"
    }));

    const safeRenderError = renderError || (() => null);

    return (
        <>
            <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>
                        First Name
                        <span style={{ color: "red", fontWeight: "bold", fontSize: "0.9rem", marginLeft: "4px" }}>*</span>
                    </label>
                    <input
                        style={safeGetInputStyle(errors?.firstName)}
                        type="text"
                        name="firstName"
                        value={info.firstName}
                        onChange={onChange}
                        placeholder="First Name"
                    />
                    {safeRenderError(errors?.firstName)}
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>
                        Last Name
                        <span style={{ color: "red", fontWeight: "bold", fontSize: "0.9rem", marginLeft: "4px" }}>*</span>
                    </label>
                    <input
                        style={safeGetInputStyle(errors?.lastName)}
                        type="text"
                        name="lastName"
                        value={info.lastName}
                        onChange={onChange}
                        placeholder="Last Name"
                    />
                    {safeRenderError(errors?.lastName)}
                </div>
            </div>

            <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>
                Address
                <span style={{ color: "red", fontWeight: "bold", fontSize: "0.9rem", marginLeft: "4px" }}>*</span>
            </label>
            <input
                style={safeGetInputStyle(errors?.address)}
                type="text"
                name="address"
                value={info.address}
                onChange={onChange}
                placeholder="Address"
            />
            {safeRenderError(errors?.address)}

            <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
                    <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>
                        City
                        <span style={{ color: "red", fontWeight: "bold", fontSize: "0.9rem", marginLeft: "4px" }}>*</span>
                    </label>
                    <input
                        style={safeGetInputStyle(errors?.city)}
                        type="text"
                        name="city"
                        value={info.city}
                        onChange={onChange}
                        placeholder="City"
                    />
                    {safeRenderError(errors?.city)}
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>
                        State
                        <span style={{ color: "red", fontWeight: "bold", fontSize: "0.9rem", marginLeft: "4px" }}>*</span>
                    </label>
                    <input
                        style={safeGetInputStyle(errors?.state)}
                        type="text"
                        name="state"
                        value={info.state}
                        onChange={onChange}
                        placeholder="State"
                        maxLength={2}
                    />
                    {safeRenderError(errors?.state)}
                </div>
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>
                        Zip Code
                        <span style={{ color: "red", fontWeight: "bold", fontSize: "0.9rem", marginLeft: "4px" }}>*</span>
                    </label>
                    <input
                        style={safeGetInputStyle(errors?.zipCode)}
                        type="text"
                        name="zipCode"
                        value={info.zipCode}
                        onChange={onChange}
                        placeholder="Zip Code"
                        maxLength={5}
                    />
                    {safeRenderError(errors?.zipCode)}
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* dropdown for country */}
                    <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>
                        Country
                        <span style={{ color: "red", fontWeight: "bold", fontSize: "0.9rem", marginLeft: "4px" }}>*</span>
                    </label>
                    <select
                        style={safeGetInputStyle(errors?.country)}
                        name="country"
                        value={info.country}
                        onChange={onChange}
                    >
                        <option value="">Select Country</option>
                        {[
                            "United States", "Canada", "United Kingdom", "Australia", 
                            "Germany", "France", "Japan", "Mexico", "Spain", "Italy"
                        ].map((country) => (
                            <option key={country} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                    {safeRenderError(errors?.country)}
                </div>
            </div>
        </>
    );
}
