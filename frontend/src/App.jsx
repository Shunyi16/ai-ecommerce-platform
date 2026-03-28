import { useState, useEffect } from 'react'
import ProductGrid from './ProductGrid'
import Navbar from './Navbar'

function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Fetch the data from your FastAPI backend
  useEffect(() => {
    fetch('http://localhost:8000/products/')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Error fetching data:", error))
  }, [])

  const addToCart = (product) => {
    setCart([...cart, product])
    //console.log("Added to cart:", product.name)
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif", maxWidth: "1000px", margin: "0 auto" , width: "100%"}}> {/* outermost grid wrap */}
      <Navbar cartCount={cart.length} CartOnClick={toggleCart}/>
      <ProductGrid products={products} addToCart={addToCart}/>
    </div>

  )

}

export default App