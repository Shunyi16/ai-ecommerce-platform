import React from "react";

export default function PaymentInformation({ paymentInfo, handleInputChange, errors, getInputStyle, renderError }) {
    return (
        <>
            <h2 style={{ display: "flex", textAlign: "left", color: "#111" }}>
                Payment Information
            </h2>

            <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>
                Card Number
                <span style={{ color: "red", fontWeight: "bold", fontSize: "0.9rem", marginLeft: "4px" }}>*</span>
            </label>
            <input
                style={getInputStyle(errors.cardNumber)}
                type="text"
                name="cardNumber"
                value={paymentInfo.cardNumber}
                onChange={handleInputChange}
                placeholder="Card Number"
                maxLength={19}
            />
            {renderError(errors.cardNumber)}

            <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>
                Expiration Date
                <span style={{ color: "red", fontWeight: "bold", fontSize: "0.9rem", marginLeft: "4px" }}>*</span>
            </label>
            <input
                style={getInputStyle(errors.expiryDate)}
                type="text"
                name="expiryDate"
                value={paymentInfo.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
            />
            {renderError(errors.expiryDate)}

            <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>
                Full Name
                <span style={{ color: "red", fontWeight: "bold", fontSize: "0.9rem", marginLeft: "4px" }}>*</span>
            </label>
            <input
                style={getInputStyle(errors.fullName)}
                type="text"
                name="fullName"
                value={paymentInfo.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
            />
            {renderError(errors.fullName)}

            <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>
                Security Code
                <span style={{ color: "red", fontWeight: "bold", fontSize: "0.9rem", marginLeft: "4px" }}>*</span>
            </label>
            <input
                style={getInputStyle(errors.securityCode)}
                type="text"
                name="securityCode"
                value={paymentInfo.securityCode}
                onChange={handleInputChange}
                placeholder="CVV"
                maxLength={4}
            />
            {renderError(errors.securityCode)}
        </>
    );
}
