export default function CartDrawer({ isOpen, cartItems, closeCart, updateQuantity, openCheckout }) {
  // Calculate cart total dynamically
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantitySelected || 1)), 0);

  return (
    <>
      {/* 
        BACKDROP OVERLAY 
        Darkens and blurs the main screen behind the drawer when open.
        Clicking the backdrop automatically closes the drawer!
      */}
      <div
        onClick={closeCart}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100VW",
          height: "100VH",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(5px)", // Glassmorphism blur on the backdrop
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          transition: "all 0.3s ease",
          zIndex: 999
        }}
      />

      {/* 
        THE DRAWER 
        Slides in from the right edge with a premium glassmorphic frosted surface
      */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-450px", /* Hides off-screen by default */
          width: "400px",
          height: "100VH",
          backgroundColor: "rgba(255, 255, 255, 0.7)", /* Translucent white base */
          backdropFilter: "blur(20px)", /* Intense frosted glass effect */
          WebkitBackdropFilter: "blur(20px)", /* Safari support */
          boxShadow: "-10px 0 30px rgba(0,0,0,0.1)", /* Soft shadow blending into the backdrop */
          borderLeft: "1px solid rgba(255,255,255,0.4)",
          padding: "30px",
          transition: "right 0.35s cubic-bezier(0.25, 1, 0.5, 1)", /* Ultra-smooth snap-in animation */
          zIndex: 1000,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box"
        }}
      >

        {/* Drawer Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2 style={{ margin: 0, fontSize: "1.8rem", color: "#111" }}>Your Cart</h2>
          <button
            onClick={closeCart}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#333",
              transition: "background 0.2s"
            }}
          >
            ✕
          </button>
        </div>

        {/* Drawer Body/Items */}
        {cartItems.length === 0 ? (
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", color: "#666" }}>
            <p style={{ fontSize: "1.2rem", textAlign: "center" }}>
              Your cart is empty.<br />
              <span style={{ fontSize: "0.9rem", color: "#aaa" }}>Looks like a great time to start shopping!</span>
            </p>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "15px" }}>
            {cartItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.6)", /* Inner glass effect */
                  padding: "15px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  border: "1px solid rgba(255,255,255,0.8)"
                }}
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{ width: "65px", height: "65px", objectFit: "cover", borderRadius: "8px" }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 5px 0", fontSize: "1.1rem", color: "#222" }}>{item.name}</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "5px" }}>
                    <p style={{ margin: 0, color: "#888", fontWeight: "500", fontSize: "0.9rem" }}>Qty:</p>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "4px", backgroundColor: "rgba(255,255,255,0.8)" }}>
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        style={{ padding: "1px 8px", background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", color: "#333" }}
                      >-</button>
                      <span style={{ color: "#111", fontSize: "0.95rem", padding: "0 4px", minWidth: "15px", textAlign: "center", fontWeight: "bold" }}>
                        {item.quantitySelected || 1}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        disabled={(item.quantitySelected || 1) >= item.inventory_count}
                        style={{
                          padding: "1px 8px",
                          background: "none",
                          border: "none",
                          cursor: ((item.quantitySelected || 1) >= item.inventory_count) ? "not-allowed" : "pointer",
                          fontSize: "1.1rem",
                          color: ((item.quantitySelected || 1) >= item.inventory_count) ? "#ccc" : "#333"
                        }}
                      >+</button>
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: "bold", fontSize: "1.15rem", color: "#324decff" }}>
                  ${((item.price) * (item.quantitySelected || 1)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Drawer Footer / Checkout */}
        {cartItems.length > 0 && (
          <div style={{ marginTop: "30px", borderTop: "2px solid rgba(0,0,0,0.06)", paddingTop: "25px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.5rem", fontWeight: "bold", marginBottom: "25px", color: "#111" }}>
              <span>Subtotal</span>
              <span style={{ color: "#324decff" }}>${subtotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => {
                closeCart();
                openCheckout();
              }}
              style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "#111",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
            }}>
              Checkout
            </button>
          </div>
        )}

      </div>
    </>
  )
}
