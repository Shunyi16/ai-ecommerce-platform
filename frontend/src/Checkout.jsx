import { useState } from 'react'
import OrderSummary from './components/Checkout/OrderSummary';
import AddressFields from './components/Checkout/AddressFields';

export default function Checkout({ isOpen, cartItems, closeCart, openPayment, openCart }) {

    const [shippingInfo, setShippingInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
    })

    // Using an object to track errors by field name
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        if (name === "zipCode") {
            // Strip any non-number characters for phone/zip
            value = value.replace(/\D/g, "");
        } else if (name === "firstName" || name === "lastName" || name === "city") {
            // Only allow letters, spaces, hyphens, and apostrophes for names and city
            value = value.replace(/[^a-zA-Z\s\-\']/g, "");
        } else if (name === "state") {
            value = value.replace(/[^a-zA-Z]/g, "").toUpperCase();
        } else if (name === "email") {
            // Remove any blank spaces from emails while typing
            value = value.replace(/\s/g, "");
        }
        setShippingInfo((prevInfo) => ({
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

    const handleProceedToPayment = (e) => {
        e.preventDefault();
        let newErrors = {};

        const nameRegex = /^[a-zA-Z\s\-\']+$/;
        if (!shippingInfo.firstName.trim()) {
            newErrors.firstName = "First name is required.";
        } else if (!nameRegex.test(shippingInfo.firstName)) {
            newErrors.firstName = "Please use only letters for the first name.";
        }
        if (!shippingInfo.lastName.trim()) {
            newErrors.lastName = "Last name is required.";
        } else if (!nameRegex.test(shippingInfo.lastName)) {
            newErrors.lastName = "Please use only letters for the last name.";
        }

        if (!shippingInfo.address.trim()) newErrors.address = "Address is required.";
        if (!shippingInfo.city.trim()) newErrors.city = "City is required.";
        if (!shippingInfo.state.trim()) {
            newErrors.state = "State is required.";
        } else if (shippingInfo.state.trim().length !== 2) {
            newErrors.state = "State code must be 2 letters.";
        }

        if (!shippingInfo.zipCode.trim()) {
            newErrors.zipCode = "Zip code is required.";
        } else if (shippingInfo.zipCode.length !== 5) {
            newErrors.zipCode = "Zip code must be 5 digits.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!shippingInfo.email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(shippingInfo.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!shippingInfo.country) {
            newErrors.country = "Country is required.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({}); // clear errors
        closeCart();
        openPayment();
    };

    if (!isOpen) return null
    return (
        <div onClick={closeCart}
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
                flexDirection: "column"
            }}>

            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: "white",
                    position: "relative",
                    display: "flex",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "50px",
                    borderRadius: "10px",
                    flexDirection: "column",
                    gap: "50px"
                }}>
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
                    aria-label="Close cart"
                    onMouseEnter={(e) => e.target.style.color = "#333"}
                    onMouseLeave={(e) => e.target.style.color = "#999"}
                >
                    &times; {/* button to close the checkout */}
                </button>

                <div style={{ display: "flex", flexDirection: "row", gap: "50px", marginBlock: "-10px" }}>
                    <form style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <h2 style={{ display: "flex", justifyContent: "center", color: "#111", marginBottom: "10px" }}>Shipping Information</h2>
                        <AddressFields
                            info={shippingInfo}
                            onChange={handleInputChange}
                            errors={errors}
                            getInputStyle={getInputStyle}
                            renderError={renderError}
                        />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label style={{ color: "#333", textAlign: "left", marginBottom: "3px" }}>
                                Email
                                <span style={{ color: "red", fontWeight: "bold", fontSize: "0.9rem", marginLeft: "4px" }}>*</span></label>
                            <input
                                style={getInputStyle(errors.email)}
                                type="email"
                                name="email"
                                value={shippingInfo.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                            />
                            {errors.email && <span style={{ color: "red", fontSize: "0.85rem", textAlign: "left", marginTop: "-15px", marginBottom: "15px" }}>{errors.email}</span>}
                        </div>
                    </form>
                    <OrderSummary cartItems={cartItems} />
                </div>

                {/* buttons */}
                <div style={{ flexDirection: "row", display: "flex", gap: "20px", justifyContent: "center" }}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: "white",
                            position: "relative",
                            display: "flex",
                            maxWidth: "1200px",
                            margintop: "5px",
                            borderRadius: "10px"
                        }}>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                closeCart();
                                openCart();
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
                    </div>

                    <button
                        onClick={handleProceedToPayment}
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
                        type="submit">Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    )
}