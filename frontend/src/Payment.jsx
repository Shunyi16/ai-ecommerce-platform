import { useState } from "react";
import PaymentInformation from "./components/Checkout/PaymentInformation";
import OrderSummary from "./components/Checkout/OrderSummary";
import AddressFields from "./components/Checkout/AddressFields";
import InputField from "./components/common/InputField";
import Button from "./components/common/Button";

export default function Payment({ isOpen, cartItems, closeCart, openCheckout, shippingInfo, onSuccess }) {
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
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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
        setPaymentInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    // Handle input changes for billing info
    const handleBillingChange = (e) => {
        let { name, value } = e.target;
        if (name === "zipCode") {
            value = value.replace(/\D/g, "");
        } else if (name === "firstName" || name === "lastName" || name === "city") {
            value = value.replace(/[^a-zA-Z\s\-\']/g, "");
        } else if (name === "state") {
            value = value.replace(/[^a-zA-Z]/g, "").toUpperCase();
        } else if (name === "phoneNumber") {
            value = value.replace(/[^\d\s\-\(\)]/g, "");
        }
        setBillingInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    // handle form submit
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};

        // 1. Card Number checks
        if (!paymentInfo.cardNumber) {
            newErrors.cardNumber = "Card number is required.";
        } else if (paymentInfo.cardNumber.replace(/\s/g, "").length < 16) {
            newErrors.cardNumber = "Please enter a valid card number.";
        }
        // 2. Expiration Date checks
        const [month, year] = paymentInfo.expiryDate.split("/");
        const datePattern = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
        if (!paymentInfo.expiryDate) {
            newErrors.expiryDate = "Expiration date is required.";
        } else if (!datePattern.test(paymentInfo.expiryDate)) {
            newErrors.expiryDate = "Please enter a valid date (MM/YY).";
        }
        // 3. Security Code checks
        if (!paymentInfo.securityCode) {
            newErrors.securityCode = "Required.";
        } else if (paymentInfo.securityCode.length < 3) {
            newErrors.securityCode = "Invalid.";
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
            if (!billingInfo.firstName.trim()) newErrors.firstName = "Required.";
            if (!billingInfo.lastName.trim()) newErrors.lastName = "Required.";
            if (!billingInfo.address.trim()) newErrors.address = "Required.";
            if (!billingInfo.city.trim()) newErrors.city = "Required.";
            if (!billingInfo.state.trim() || billingInfo.state.length !== 2) newErrors.state = "2 letters.";
            if (billingInfo.zipCode.length !== 5) newErrors.zipCode = "5 digits.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);

        setIsLoading(true);

        const activeUserId = localStorage.getItem("active_user_id");

        try {
            const response = await fetch("http://127.0.0.1:8000/orders/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: parseInt(activeUserId),
                    full_name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
                    email: shippingInfo.email,
                    address: shippingInfo.address,
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    zip_code: shippingInfo.zipCode
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Checkout failed");
            }

            const order = await response.json();
            setIsLoading(false);
            
            // Reset local states for Next Guest User
            setPaymentInfo({
                cardNumber: "",
                fullName: "",
                expiryDate: "",
                securityCode: "",
            });
            setBillingInfo({
                firstName: "",
                lastName: "",
                address: "",
                city: "",
                state: "",
                zipCode: "",
                phoneNumber: "",
                country: ""
            });
            setIsSameAsShipping(false);

            onSuccess(order); // Pass the whole order object
        } catch (error) {
            setIsLoading(false);
            console.error("Order error:", error);
            alert(`Order Error: ${error.message}`);
        }
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
                    backgroundColor: "#f9f8f3f8",
                    position: "relative",
                    display: "block",
                    width: "100%",
                    maxWidth: "1000px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    margin: "20px",
                    padding: "50px",
                    borderRadius: "24px",
                    boxSizing: "border-box",
                }}
            >
                <Button
                    variant="icon"
                    onClick={closeCart}
                    style={{ top: "15px", right: "15px" }}
                    ariaLabel="Close checkout"
                >
                    &times;
                </Button>

                <div style={{ display: "flex", flexDirection: "row", gap: "30px", marginBlock: "-10px", alignItems: "stretch" }}>
                    <form
                        onSubmit={handleFormSubmit}
                        style={{
                            flex: 1.4,
                            display: "flex",
                            flexDirection: "column",
                            paddingTop: "30px",
                        }}
                        noValidate
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <PaymentInformation
                                paymentInfo={paymentInfo}
                                handleInputChange={handleInputChange}
                                errors={errors}
                            />
                        </div>
                        <>
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                <h2 style={{
                                    margin: "30px 0",
                                    fontSize: "1.5rem",
                                    color: "#111",
                                    textAlign: "left"
                                }}>
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
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    </form>
                    <div style={{ flex: 1, minWidth: "350px" }}>
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
                    marginTop: "30px",
                    paddingTop: "30px",
                    borderTop: "1px solid #eaeaea"
                }}>
                    <Button
                        variant="secondary"
                        onClick={(e) => {
                            e.preventDefault();
                            closeCart();
                            openCheckout();
                        }}
                        disabled={isLoading}
                    >
                        Back
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleFormSubmit}
                        type="submit"
                        loading={isLoading}
                        style={{ padding: "12px 40px", minWidth: "250px" }}
                    >
                        Place Order
                    </Button>
                </div>
            </div>
        </div>
    );
}
