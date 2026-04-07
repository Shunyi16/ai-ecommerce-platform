import { useState } from 'react'

export default function Checkout({ isOpen, cartItems, closeCart }) {

    const [shippingInfo, setShippingInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zipCode: ""
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        margin: "8px 0 20px 0",
        borderRadius: "6px",
        border: "1px solid #ccc",
        backgroundColor: "white", /* Forces the background explicitly white instead of gray */
        color: "#333",            /* Forces text to be a nice dark gray */
        fontSize: "1rem",
        boxSizing: "border-box"
    };

    if (!isOpen) return null
    return (
        <div style={{
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
        }}>

            <div style={{
                backgroundColor: "white",
                display: "flex",
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "50px",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "row",
                gap: "50px"
            }}>
                <form style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <h2 style={{ display: "flex", justifyContent: "center", color: "#111" }}>Shipping Information</h2>

                    <div style={{ display: "flex", gap: "15px" }}>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                            <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>First Name</label>
                            <input style={inputStyle} type="text" name="firstName" value={shippingInfo.firstName} onChange={handleInputChange} placeholder="First Name" />
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                            <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>Last Name</label>
                            <input style={inputStyle} type="text" name="lastName" value={shippingInfo.lastName} onChange={handleInputChange} placeholder="Last Name" />
                        </div>
                    </div>

                    <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>Email</label>
                    <input style={inputStyle} type="email" name="email" value={shippingInfo.email} onChange={handleInputChange} placeholder="Email" />

                    <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>Address</label>
                    <input style={inputStyle} type="text" name="address" value={shippingInfo.address} onChange={handleInputChange} placeholder="Address" />

                    <div style={{ display: "flex", gap: "15px" }}>
                        <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
                            <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>City</label>
                            <input style={inputStyle} type="text" name="city" value={shippingInfo.city} onChange={handleInputChange} placeholder="City" />
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                            <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>State</label>
                            <input style={inputStyle} type="text" name="state" value={shippingInfo.state} onChange={handleInputChange} placeholder="State" />
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                            <label style={{ color: "#333", textAlign: "left", marginBottom: "5px" }}>Zip Code</label>
                            <input style={inputStyle} type="text" name="zipCode" value={shippingInfo.zipCode} onChange={handleInputChange} placeholder="Zip Code" />
                        </div>
                    </div>
                    <button style={{
                        fontSize: "1.2rem",
                        marginTop: "10px",
                        padding: "10px",
                        backgroundColor: "#324decff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                        type="submit">Proceed to Payment</button>
                </form>

                <div style={{ flex: 1, backgroundColor: "#fbfbfb", padding: "30px", borderRadius: "10px", border: "1px solid #ebebeb" }}>
                    <h2 style={{ display: "flex", justifyContent: "center", color: "#111", marginBottom: "30px", marginTop: 0 }}>Order Summary</h2>

                    {/* Cart Items List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "30px" }}>
                        {cartItems.map((item) => (
                            <div key={item.id} style={{ display: "flex", flexDirection: "column", borderBottom: "1px solid #ddd", paddingBottom: "15px" }}>
                                <p style={{ textAlign: "left", margin: "0 0 10px 0", fontWeight: "bold", color: "#222" }}>{item.name}</p>

                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                    <span style={{ color: "#666" }}>Quantity</span>
                                    <span style={{ fontWeight: "600", color: "#111" }}>{item.quantitySelected}</span>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#666" }}>Price</span>
                                    <span style={{ fontWeight: "600", color: "#111" }}>${(item.price * item.quantitySelected).toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Receipt Totals */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "1.05rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#666" }}>Product Total</span>
                            <span style={{ fontWeight: "bold", color: "#111" }}>${cartItems.reduce((total, item) => total + item.price * item.quantitySelected, 0).toFixed(2)}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#666" }}>Shipping & Processing</span>
                            <span style={{ fontWeight: "bold", color: "#111" }}>$10.00</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#666" }}>Tax</span>
                            <span style={{ fontWeight: "bold", color: "#111" }}>$10.00</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px", paddingTop: "15px", borderTop: "2px solid #ccc", fontSize: "1.3rem" }}>
                            <span style={{ fontWeight: "bold", color: "#111" }}>Total</span>
                            <span style={{ fontWeight: "bold", color: "#324decff" }}>${(cartItems.reduce((total, item) => total + item.price * item.quantitySelected, 0) + 20).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}
