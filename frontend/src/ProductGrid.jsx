import { useState } from 'react';

function ProductCard({ product, addToCart }) {
  // Each card remembers its own quantity state
  const [quantity, setQuantity] = useState(1);

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
        padding: "5px",
        minWidth: 0, /* Fixes the hidden CSS Grid image bug! */
        display: "flex",
        flexDirection: "column", /* Helps align the buttons */
      }}
    >
      <div
        style={{
          minWidth: 0, /* Fixes the hidden CSS Grid image bug! */
          display: "flex",
          flexDirection: "column" /* Helps align the buttons */
        }}
      >
        <img
          src={product.image_url}
          alt={product.name}
          style={{ width: "100%", height: "350px", objectFit: "cover", marginBottom: "10px" }}
        />
      </div>

      <div style={{ padding: "5px", textAlign: "left" }}>
        <p style={{ margin: "0 0 10px 0", fontSize: "1rem", color: "#222" }}>{product.name}</p>

        <p style={{ margin: "5px 0", fontSize: "1.1rem", fontWeight: "500", color: "#1b3befff" }}>
          ${product.price}
        </p>
        {/* Right Side: Stock Status
        <span style={{ fontSize: "1rem", color: "#050404ff", fontWeight: "500" }}>
          {product.inventory_count} in stock
        </span> */}

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column" }}>
          {/* HORIZONTAL QTY & BUTTON ROW */}
          {product.inventory_count > 0 ? (
            <div style={{ display: "flex", alignItems: "stretch", gap: "15px", marginTop: "3px" }}>

              {/* Left Side: Qty Selector */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: "600" }}>Qty:</label>
                <input
                  type="number"
                  min="0"
                  max={product.inventory_count}
                  value={quantity}
                  onChange={handleQuantityChange}
                  style={{
                    padding: "10px",
                    fontSize: "0.8rem",
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
                  setQuantity(1);
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
                  fontSize: "0.8rem"
                }}
              >
                Add to Cart
              </button>
            </div>
          ) : (
            /* OUT OF STOCK VIEW */
            <div style={{ marginTop: "15px", display: "flex", flexDirection: "column" }}>
              <p style={{ margin: "0 0 10px 0", color: "red", fontWeight: "bold", fontSize: "0.8rem", textAlign: "center" }}>
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
    </div>
  );
}

export default function ProductGrid({ products, addToCart, currentPage, setCurrentPage, totalCount }) {
  const totalPages = Math.ceil(totalCount / 15);

  return (
    <>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", /* Creates side-by-side columns */
        gap: "25px"
      }}>
        {products.map((product) => (
          /* Render the extracted card component! */
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div style={{
        marginTop: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        padding: '20px 0'
      }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          style={{
            padding: '10px 25px',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            backgroundColor: currentPage === 1 ? '#f9f9f9' : 'white',
            color: currentPage === 1 ? '#999' : '#222',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
            boxShadow: currentPage === 1 ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          Previous
        </button>

        <span style={{
          fontWeight: '600',
          color: '#444',
          fontSize: '0.9rem',
          backgroundColor: '#f0f2f5',
          padding: '8px 16px',
          borderRadius: '20px'
        }}>
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          style={{
            padding: '10px 25px',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            backgroundColor: currentPage >= totalPages ? '#f9f9f9' : 'white',
            color: currentPage >= totalPages ? '#999' : '#222',
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
            boxShadow: currentPage >= totalPages ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          Next
        </button>
      </div>
    </>
  )
}