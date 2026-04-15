import React from "react";
import AddressFields from "./AddressFields";

export default function BillingAddress({
    isSameAsShipping,
    setIsSameAsShipping,
    billingInfo,
    handleBillingChange,
    errors,
    getInputStyle,
    renderError,
}) {
    return (
        <>
            <h2 style={{ display: "flex", textAlign: "left", color: "#111" }}>
                Billing Address
            </h2>

            <label
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "15px",
                }}
            >
                <input
                    type="checkbox"
                    checked={isSameAsShipping}
                    onChange={(e) => setIsSameAsShipping(e.target.checked)}
                    style={{
                        backgroundColor: "white",
                        colorScheme: "light",
                        accentColor: "#324dec",
                    }}
                />
                Same as shipping
            </label>

            {!isSameAsShipping && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <AddressFields
                        info={billingInfo}
                        onChange={handleBillingChange}
                        errors={errors}
                        getInputStyle={getInputStyle}
                        renderError={renderError}
                    />
                    <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>
                        Phone Number
                        <span style={{ color: "red", fontWeight: "bold", fontSize: "0.9rem", marginLeft: "4px" }}>*</span>
                    </label>
                    <input
                        style={getInputStyle(errors.phoneNumber)}
                        type="text"
                        name="phoneNumber"
                        value={billingInfo.phoneNumber}
                        onChange={handleBillingChange}
                        placeholder="Phone Number"
                        maxLength={15}
                    />
                    {renderError(errors.phoneNumber)}
                </div>
            )}
        </>
    );
}
