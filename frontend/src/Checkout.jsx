import { useState } from 'react'
import OrderSummary from './components/Checkout/OrderSummary';
import AddressFields from './components/Checkout/AddressFields';
import InputField from './components/common/InputField';
import Button from './components/common/Button';

export default function Checkout({ isOpen, cartItems, closeCart, openPayment, openCart, shippingInfo, setShippingInfo }) {

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
        } else if (name === "phoneNumber") {
            // Allow numbers, spaces, parentheses, and hyphens
            value = value.replace(/[^\d\s\-\(\)]/g, "");
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

    // handle proceed to payment
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
        if (!shippingInfo.phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required.";
        } else if (shippingInfo.phoneNumber.replace(/\D/g, "").length < 10) {
            newErrors.phoneNumber = "Please enter a valid 10-digit phone number.";
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
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(8px)",
                zIndex: 1000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
            }}>

            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: "#f9f8f3f8",
                    position: "relative",
                    display: "flex",
                    width: "100%",
                    maxWidth: "1000px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    margin: "20px",
                    padding: "40px 50px",
                    borderRadius: "24px",
                    flexDirection: "column",
                    boxSizing: "border-box",
                    gap: "40px",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    border: "1px solid rgba(0,0,0,0.05)"
                }}>
                <Button
                    variant="icon"
                    onClick={closeCart}
                    style={{ top: "15px", right: "15px" }}
                    ariaLabel="Close cart"
                >
                    &times;
                </Button>

                <div style={{ display: "flex", flexDirection: "row", gap: "40px", alignItems: "stretch", flexWrap: "wrap" }}>
                    <form style={{
                        flex: "1.4",
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "left",
                        paddingTop: "10px",
                    }}>
                        <h2 style={{
                            margin: "0 0 30px 0",
                            fontSize: "1.8rem",
                            color: "#111",
                            fontWeight: "700"
                        }}>
                            Shipping Details
                        </h2>

                        <div style={{ padding: "25px", borderRadius: "16px" }}>
                            <AddressFields
                                info={shippingInfo}
                                onChange={handleInputChange}
                                errors={errors}
                            />
                            <InputField
                                label="Email"
                                type="email"
                                name="email"
                                value={shippingInfo.email}
                                onChange={handleInputChange}
                                placeholder="your@email.com"
                                error={errors.email}
                            />
                        </div>
                    </form>

                    <div style={{ flex: "1", minWidth: "350px" }}>
                        <OrderSummary
                            cartItems={cartItems}
                            shippingState={shippingInfo.state}
                        />
                    </div>
                </div>

                {/* buttons */}
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "20px",
                    alignItems: "center",
                    marginTop: "10px",
                    paddingTop: "30px",
                    borderTop: "1px solid rgba(0,0,0,0.06)"
                }}>
                    <Button
                        variant="secondary"
                        onClick={(e) => {
                            e.preventDefault();
                            closeCart();
                            openCart();
                        }}
                    >
                        Back
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleProceedToPayment}
                        type="submit"
                        style={{ padding: "16px 50px", minWidth: "280px", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(50, 77, 236, 0.3)" }}
                    >
                        Continue to Payment
                    </Button>
                </div>
            </div>
        </div>
    )
}