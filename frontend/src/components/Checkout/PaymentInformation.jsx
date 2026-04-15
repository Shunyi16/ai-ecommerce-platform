import React from "react";
import InputField from "../common/InputField";

export default function PaymentInformation({ paymentInfo, handleInputChange, errors }) {
    return (
        <>
            <h2 style={{ 
                margin: "0 0 30px 0", 
                fontSize: "1.5rem", 
                color: "#111", 
                textAlign: "center" 
            }}>
                Payment Information
            </h2>

            <InputField
                label="Card Number"
                name="cardNumber"
                value={paymentInfo.cardNumber}
                onChange={handleInputChange}
                placeholder="Card Number"
                maxLength={19}
                error={errors.cardNumber}
            />

            <InputField
                label="Expiration Date"
                name="expiryDate"
                value={paymentInfo.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                error={errors.expiryDate}
            />

            <InputField
                label="Full Name"
                name="fullName"
                value={paymentInfo.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                error={errors.fullName}
            />

            <InputField
                label="Security Code"
                name="securityCode"
                value={paymentInfo.securityCode}
                onChange={handleInputChange}
                placeholder="CVV"
                maxLength={4}
                error={errors.securityCode}
            />
        </>
    );
}
