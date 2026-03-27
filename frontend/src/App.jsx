import { useState, useEffect } from 'react'

function App() {
  const [products, setProducts] = useState([])

  // Fetch the data from your FastAPI backend
  useEffect(() => {
    fetch('http://localhost:8000/products/')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Error fetching data:", error))
  }, [])

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto", color: "white" }}>
      <h1>Beautiful Lamps</h1>
      
      {/* Loop through the database products and draw them */}
      <div style={{ display: "grid", gap: "20px" }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: "1px solid #444", padding: "20px", borderRadius: "8px", backgroundColor: "#222" }}>
            <h2 style={{ margin: "0 0 10px 0" }}>{product.name}</h2>
            <p style={{ margin: "5px 0", fontSize: "1.2rem", fontWeight: "bold", color: "#4ade80" }}>
              ${product.price}
            </p>
            <p style={{ margin: "5px 0", color: product.inventory_count > 0 ? "#aaa" : "red" }}>
              {product.inventory_count > 0 ? `${product.inventory_count} in stock` : "Out of Stock"}
            </p>
            <button style={{ padding: "10px 15px", backgroundColor: "#646cff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px" }}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App