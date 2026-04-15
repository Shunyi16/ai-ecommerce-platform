import { useState } from 'react';

function ProductCard({ product, addToCart }) {
  // Each card remembers its own quantity state
  const [quantity, setQuantity] = useState(0);

  // handleQuantityChange is a function that handles the quantity change
  const handleQuantityChange = (e) => {
    let val = parseInt(e.target.value, 10);
    // If they clear the box, default to 0
    //if (isNaN(val)) val = 1;
    // Don't let them type negatives or more than inventory
    if (val < 0) val = 0;
    if (val > product.inventory_count) val = product.inventory_count;
    setQuantity(val);
  };

  return (
    <div
      style={{
        border: "1px solid #f2eeee",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#f9f7f7",
        minWidth: 0, /* Fixes the hidden CSS Grid image bug! */
        display: "flex",
        flexDirection: "column" /* Helps align the buttons */
      }}
    >
      <img
        src={product.image_url}
        alt={product.name}
        style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "4px", marginBottom: "15px" }}
      />

      <h2 style={{ margin: "0 0 10px 0", fontSize: "1.4rem", color: "#222" }}>{product.name}</h2>

      <p style={{ margin: "5px 0", fontSize: "1.2rem", fontWeight: "bold", color: "#1b3befff" }}>
        ${product.price}
      </p>

      {/* Right Side: Stock Status */}
      <span style={{ fontSize: "1.1rem", color: "#050404ff", fontWeight: "500" }}>
        {product.inventory_count} in stock
      </span>



      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column" }}>
        {/* HORIZONTAL QTY & BUTTON ROW */}
        {product.inventory_count > 0 ? (
          <div style={{ display: "flex", alignItems: "stretch", gap: "15px", marginTop: "15px" }}>

            {/* Left Side: Qty Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label style={{ fontSize: "1.1rem", fontWeight: "600" }}>Qty:</label>
              <input
                type="number"
                min="0"
                max={product.inventory_count}
                value={quantity}
                onChange={handleQuantityChange}
                style={{
                  padding: "10px",
                  fontSize: "1.1rem",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  width: "60px",
                  textAlign: "center",
                  color: "black",
                  backgroundColor: "transparent",
                  boxSizing: "border-box" /* Ensures padding doesn't affect fixed width */
                }}
              />
            </div>

            {/* Right Side: Add to Cart Button */}
            <button
              onClick={() => {
                addToCart({ ...product, quantitySelected: quantity });
                setQuantity(0);
              }}
              disabled={quantity === 0}
              style={{
                flex: 1, /* Tells this button to stretch and fill all remaining horizontal space */
                padding: "10px 15px",
                backgroundColor: "#324decff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: quantity === 0 ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "1.1rem"
              }}
            >
              Add to Cart
            </button>
          </div>
        ) : (
          /* OUT OF STOCK VIEW */
          <div style={{ marginTop: "15px", display: "flex", flexDirection: "column" }}>
            <p style={{ margin: "0 0 10px 0", color: "red", fontWeight: "bold", fontSize: "1.1rem", textAlign: "center" }}>
              Out of Stock
            </p>
            <button
              disabled
              style={{
                width: "100%",
                padding: "12px 15px",
                backgroundColor: "#ccc",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "not-allowed",
                fontWeight: "bold"
              }}
            >
              Out of Stock
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductGrid({ products, addToCart }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", /* Creates side-by-side columns */
      gap: "25px"
    }}>
      {products.map((product) => (
        /* Render the extracted card component! */
        <ProductCard key={product.id} product={product} addToCart={addToCart} />
      ))}
    </div>
  )
}