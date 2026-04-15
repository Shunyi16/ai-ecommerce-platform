import Button from './components/common/Button';

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
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          transition: "all 0.3s ease",
          zIndex: 999
        }}
      />

      {/* 
        THE DRAWER 
      */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-450px",
          width: "400px",
          height: "100VH",
          backgroundColor: "#f9f8f3f8",
          boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
          padding: "30px",
          transition: "right 0.3s ease",
          zIndex: 1000,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box"
        }}
      >

        <Button
          variant="icon"
          onClick={closeCart}
          style={{ top: "15px", right: "15px" }}
          ariaLabel="Close cart"
        >
          &times;
        </Button>

        {/* Drawer Header */}
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#111", textAlign: "center" }}>Your Shopping Cart</h2>
        </div>

        {/* Drawer Body/Items */}
        {cartItems.length === 0 ? (
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", color: "#666" }}>
            <p style={{ textAlign: "center" }}>Your cart is empty.</p>
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
                  padding: "15px",
                  borderRadius: "8px",
                  borderBottom: "1px solid #ebebeb"
                }}
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{ width: "65px", height: "65px", objectFit: "cover", borderRadius: "4px" }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 5px 0", fontSize: "1rem", color: "#222" }}>{item.name}</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>Quantity:</p>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "white" }}>
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        style={{ padding: "0 8px", background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#333" }}
                      >-</button>
                      <span style={{ padding: "0 4px", minWidth: "20px", textAlign: "center" }}>
                        {item.quantitySelected || 1}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        disabled={(item.quantitySelected || 1) >= item.inventory_count}
                        style={{
                          padding: "0 8px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                          color: ((item.quantitySelected || 1) >= item.inventory_count) ? "#ccc" : "#333"
                        }}
                      >+</button>
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: "bold" }}>
                  ${((item.price)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Drawer Footer / Checkout */}
        {cartItems.length > 0 && (
          <div style={{ marginTop: "30px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "bold", marginBottom: "20px" }}>
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                closeCart();
                openCheckout();
              }}
              style={{
                width: "100%",
                padding: "12px"
              }}
            >
              Go to Checkout
            </Button>
          </div>
        )}

      </div>
    </>
  )
}
