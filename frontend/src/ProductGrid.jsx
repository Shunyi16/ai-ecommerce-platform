export default function ProductGrid({products}) {
    return (
      /* Loop through the database products and draw them */
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", /* Creates side-by-side columns */
        gap: "25px" 
      }}>
        {products.map((product) => (
          <div 
            key={product.id} 
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
              style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "4px", marginBottom: "15px"}} 
            />
            
            <h2 style={{ margin: "0 0 10px 0", fontSize: "1.4rem", color: "#222" }}>{product.name}</h2>
            
            <p style={{ margin: "5px 0", fontSize: "1.2rem", fontWeight: "bold", color: "#11b54d" }}> 
              ${product.price}  
            </p>
            
            <p style={{ margin: "5px 0 15px 0", color: product.inventory_count > 0 ? "#aaa" : "red" }}>
              {product.inventory_count > 0 ? `${product.inventory_count} in stock` : "Out of Stock"}
            </p>
            
            <button 
              style={{ 
                marginTop: "auto", /* Pushes the button to the bottom if titles are different lengths */
                padding: "12px 15px", 
                backgroundColor: "#646cff", 
                color: "white", 
                border: "none", 
                borderRadius: "5px", 
                cursor: "pointer", 
                fontWeight: "bold"
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
  )
}