import { useState } from "react";
import PaymentInformation from "./components/Checkout/PaymentInformation";
import BillingAddress from "./components/Checkout/BillingAddress";
import OrderSummary from "./components/Checkout/OrderSummary";

export default function Payment({ isOpen, cartItems, closeCart, openCheckout }) {
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: "",
        fullName: "",
        expiryDate: "",
        securityCode: "",
    });

    const [billingInfo, setBillingInfo] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        country: ""
    });

    const [isSameAsShipping, setIsSameAsShipping] = useState(false);

    // Using an object to track errors by field name
    const [errors, setErrors] = useState({});

    // Handle input changes for payment info
    const handleInputChange = (e) => {
        let { name, value } = e.target;
        if (name === "cardNumber") {
            value = value.replace(/\D/g, "");
            value = value.replace(/(.{4})/g, "$1 ").trim();
        } else if (name === "expiryDate") {
            let cleanValue = value.replace(/\D/g, "");
            if (cleanValue.length >= 3) {
                value = cleanValue.slice(0, 2) + "/" + cleanValue.slice(2, 4);
            } else {
                value = cleanValue;
            }
        } else if (name === "securityCode") {
            value = value.replace(/\D/g, "");
        } else if (name === "fullName") {
            value = value.replace(/[^a-zA-Z\s\-\']/g, "");
        }
        // saving the input values
        setPaymentInfo((prevInfo) => ({
            ...prevInfo, // tell react to take a snapshot of the current data
            [name]: value, //ells React: "Look at the HTML name of the box they are typing in (e.g. cardNumber), and instantly update only that specific field with the new text"
        }));
        setErrors((prev) => ({ ...prev, [name]: undefined })); // If user hits "Submit" with an empty box, the box turns red and says "Required."; or clear the error message when user starts typing
    };

    // Handle input changes for billing info
    const handleBillingChange = (e) => {
        let { name, value } = e.target;
        if (name === "zipCode") {
            // Strip any non-number characters for phone/zip
            value = value.replace(/\D/g, "");
        } else if (name === "firstName" || name === "lastName" || name === "city") {
            // Only allow letters, spaces, hyphens, and apostrophes for names and city
            value = value.replace(/[^a-zA-Z\s\-\']/g, "");
        } else if (name === "state") {
            value = value.replace(/[^a-zA-Z]/g, "").toUpperCase();
        } else if (name === "phoneNumber") {
            // Allow numbers, spaces, parentheses, and hyphens
            value = value.replace(/[^\d\s\-\(\)]/g, "");
        }
        setBillingInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    // input style or red border for error
    const getInputStyle = (errorMsg) => ({
        width: "100%",
        padding: "12px",
        margin: "8px 0 4px 0",
        borderRadius: "6px",
        border: errorMsg ? "1px solid #d93025" : "1px solid #ccc", // Dynamic red border!
        backgroundColor: "white",
        color: "#333",
        fontSize: "1rem",
        boxSizing: "border-box",
    });

    // render error message
    const renderError = (errorMsg) => {
        if (!errorMsg)
            return <div style={{ height: "16px", marginBottom: "8px" }} />;
        return (
            <div
                style={{
                    color: "#d93025",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    marginBottom: "8px",
                }}
            >
                {errorMsg}
            </div>
        );
    };

    // handle form submit
    const handleFormSubmit = (e) => {
        e.preventDefault(); // stop browser to refresh the page
        let newErrors = {}; //local object to catch errors

        // 1. Card Number checks
        if (!paymentInfo.cardNumber) {
            newErrors.cardNumber = "Card number is required.";
        } else if (paymentInfo.cardNumber.length < 18) {
            newErrors.cardNumber = "Please enter a valid card number.";
        }

        // 2. Expiration Date checks
        const [month, year] = paymentInfo.expiryDate.split("/");
        const datePattern = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10) + 2000;
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        if (!paymentInfo.expiryDate) {
            newErrors.expiryDate = "Expiration date is required.";
        } else if (
            paymentInfo.expiryDate.length !== 5 ||
            !datePattern.test(paymentInfo.expiryDate) ||
            yearNum < currentYear ||
            (yearNum === currentYear && monthNum < currentMonth) ||
            yearNum > currentYear + 10 ||
            monthNum > 12 ||
            monthNum < 1
        ) {
            newErrors.expiryDate = "Please enter a valid expiration date (MM/YY).";
        }

        // 3. Security Code checks
        if (!paymentInfo.securityCode) {
            newErrors.securityCode = "Security code is required.";
        } else if (paymentInfo.securityCode.length < 3) {
            newErrors.securityCode = "Please enter a valid security code.";
        }

        // 4. Full Name checks
        const nameRegex = /^[a-zA-Z\s\-\']+$/;
        if (!paymentInfo.fullName.trim()) {
            newErrors.fullName = "Full name is required.";
        } else if (!nameRegex.test(paymentInfo.fullName)) {
            newErrors.fullName = "Please enter a valid name.";
        }

        // 5. Billing checks
        if (!isSameAsShipping) {
            const {
                firstName,
                lastName,
                address,
                city,
                state,
                zipCode,
                phoneNumber,
            } = billingInfo;
            if (!firstName.trim()) {
                newErrors.firstName = "First name is required.";
            } else if (!nameRegex.test(billingInfo.firstName)) {
                newErrors.firstName = "Please use only letters for the first name.";
            }
            if (!lastName.trim()) {
                newErrors.lastName = "Last name is required.";
            } else if (!nameRegex.test(billingInfo.lastName)) {
                newErrors.lastName = "Please use only letters for the last name.";
            }

            if (!address.trim()) newErrors.address = "Address is required.";
            if (!city.trim()) newErrors.city = "City is required.";
            if (!state.trim()) {
                newErrors.state = "State is required.";
            } else if (state.trim().length !== 2) {
                newErrors.state = "State code must be 2 letters.";
            }

            if (!zipCode.trim()) {
                newErrors.zipCode = "Zip code is required.";
            } else if (zipCode.length !== 5) {
                newErrors.zipCode = "Zip code must be 5 digits.";
            }

            if (!phoneNumber.trim()) {
                newErrors.phoneNumber = "Phone number is required.";
            } else if (phoneNumber.replace(/\D/g, "").length < 10) {
                // Ignore the symbols during validation check and just count the real numbers
                newErrors.phoneNumber = "Please enter a valid 10-digit phone number.";
            }
        }

        // Check if we hit any errors during validation
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({}); // clear errors
        console.log("Processing order...");
        console.log("Payment Info:", paymentInfo);
        console.log("Billing Info:", billingInfo);
        console.log("Is Same as Shipping:", isSameAsShipping);
        console.log("Cart Items:", cartItems);

        alert("Order placed successfully!");
        closeCart();
    };

    if (!isOpen) return null;
    return (
        <div
            onClick={closeCart}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: "white",
                    position: "relative",
                    display: "block",
                    width: "100%",
                    maxWidth: "1000px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    margin: "0 auto",
                    padding: "50px",
                    borderRadius: "10px",
                }}
            >
                <button
                    onClick={closeCart}
                    style={{
                        position: "absolute",
                        top: "15px",
                        right: "15px",
                        background: "none",
                        border: "none",
                        fontSize: "2rem",
                        cursor: "pointer",
                        color: "#999",
                        padding: "5px",
                        lineHeight: "1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    aria-label="Close checkout"
                    onMouseEnter={(e) => (e.target.style.color = "#333")}
                    onMouseLeave={(e) => (e.target.style.color = "#999")}
                >
                    &times; {/* button to close the checkout */}
                </button>


                <div style={{ display: "flex", flexDirection: "row", gap: "50px", marginBlock: "-10px" }}>
                    <form
                        onSubmit={handleFormSubmit}
                        style={{ flex: 1, display: "flex", flexDirection: "column" }}
                        noValidate
                    >
                        <PaymentInformation
                            paymentInfo={paymentInfo}
                            handleInputChange={handleInputChange}
                            errors={errors}
                            getInputStyle={getInputStyle}
                            renderError={renderError}
                        />

                        <BillingAddress
                            isSameAsShipping={isSameAsShipping}
                            setIsSameAsShipping={setIsSameAsShipping}
                            billingInfo={billingInfo}
                            handleBillingChange={handleBillingChange}
                            errors={errors}
                            getInputStyle={getInputStyle}
                            renderError={renderError}
                        />
                    </form>
                    <OrderSummary cartItems={cartItems} />
                </div>

                {/* buttons */}
                <div style={{ flexDirection: "row", display: "flex", gap: "20px", justifyContent: "center" }}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            display: "flex",
                            gap: "20px",
                            alignItems: "center",
                            marginTop: "15px"
                        }}>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                closeCart();
                                openCheckout();
                            }}
                            style={{
                                fontSize: "1.2rem",
                                padding: "10px 30px",
                                backgroundColor: "white",
                                color: "#333",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}
                            onMouseEnter={(e) => e.target.style.color = "#111"}
                            onMouseLeave={(e) => e.target.style.color = "#666"}>
                            Back
                        </button>

                        <button
                            onClick={handleFormSubmit}
                            style={{
                                fontSize: "1.2rem",
                                padding: "10px 30px",
                                backgroundColor: "#324decff",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                flex: 1
                            }}
                            type="submit">Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
