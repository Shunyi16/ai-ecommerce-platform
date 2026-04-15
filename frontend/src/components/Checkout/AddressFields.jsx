import React from "react";
import InputField, { ErrorMessage } from "../common/InputField";

export default function AddressFields({ info, onChange, errors = {} }) {
    return (
        <>
            <div style={{ display: "flex", gap: "15px" }}>
                <InputField
                    label="First Name"
                    name="firstName"
                    value={info.firstName}
                    onChange={onChange}
                    placeholder="First Name"
                    error={errors?.firstName}
                />
                <InputField
                    label="Last Name"
                    name="lastName"
                    value={info.lastName}
                    onChange={onChange}
                    placeholder="Last Name"
                    error={errors?.lastName}
                />
            </div>

            <InputField
                label="Address"
                name="address"
                value={info.address}
                onChange={onChange}
                placeholder="Address"
                error={errors?.address}
            />

            <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
                    <InputField
                        label="City"
                        name="city"
                        value={info.city}
                        onChange={onChange}
                        placeholder="City"
                        error={errors?.city}
                    />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <InputField
                        label="State"
                        name="state"
                        value={info.state}
                        onChange={onChange}
                        placeholder="State"
                        maxLength={2}
                        error={errors?.state}
                    />
                </div>
            </div>
            
            <div style={{ display: "flex", gap: "15px" }}>
                <InputField
                    label="Zip Code"
                    name="zipCode"
                    value={info.zipCode}
                    onChange={onChange}
                    placeholder="Zip Code"
                    maxLength={5}
                    error={errors?.zipCode}
                />
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* dropdown for country */}
                    <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>
                        Country
                        <span style={{ color: "red", fontWeight: "bold", fontSize: "0.9rem", marginLeft: "4px" }}>*</span>
                    </label>
                    <select
                        style={{
                            width: "100%",
                            padding: "12px",
                            margin: "8px 0 4px 0",
                            borderRadius: "6px",
                            border: errors?.country ? "1px solid #d93025" : "1px solid #ccc",
                            backgroundColor: "white",
                            color: "#333",
                            fontSize: "1rem",
                            boxSizing: "border-box",
                        }}
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
                    <ErrorMessage message={errors?.country} />
                </div>
            </div>
        </>
    );
}

