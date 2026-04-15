import { useState } from "react";
import PaymentInformation from "./components/Checkout/PaymentInformation";
import OrderSummary from "./components/Checkout/OrderSummary";
import AddressFields from "./components/Checkout/AddressFields";
import InputField from "./components/common/InputField";
import Button from "./components/common/Button";

export default function Payment({ isOpen, cartItems, closeCart, openCheckout, shippingInfo }) {
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
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            paddingTop: "30px",
                        }}
                        noValidate
                    >
                        <PaymentInformation
                            paymentInfo={paymentInfo}
                            handleInputChange={handleInputChange}
                            errors={errors}
                        />

                        <>
                            <h2 style={{
                                margin: "30px 0",
                                fontSize: "1.5rem",
                                color: "#111",
                                textAlign: "center"
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
                                    <InputField
                                        label="Phone Number"
                                        name="phoneNumber"
                                        value={billingInfo.phoneNumber}
                                        onChange={handleBillingChange}
                                        placeholder="Phone Number"
                                        maxLength={15}
                                        error={errors.phoneNumber}
                                    />
                                </div>
                            )}
                        </>
                    </form>
                    <OrderSummary 
                        cartItems={cartItems} 
                        shippingState={shippingInfo.state} 
                    />
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
                    >
                        Back
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleFormSubmit}
                        type="submit"
                        style={{ padding: "12px 40px", minWidth: "250px" }}
                    >
                        Place Order
                    </Button>
                </div>
            </div>
        </div>
    );
}
