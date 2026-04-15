import { useState, useEffect } from 'react'
import ProductGrid from './ProductGrid'
import Navbar from './Navbar'
import CartDrawer from './CartDrawer'
import Checkout from './Checkout'
import Payment from './Payment'

function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isItemOpen, setIsItemOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  // Fetch the data from your FastAPI backend
  useEffect(() => {
    fetch('http://localhost:8000/products/')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Error fetching data:", error))
  }, [])

  // Use the URL hash (#cart, #checkout) to manage the browser's back button
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setIsCartOpen(hash === '#cart');
      setIsCheckoutOpen(hash === '#checkout');
      setIsPaymentOpen(hash === '#payment');
    };

    window.addEventListener('hashchange', handleHashChange);
    // Check the URL when the page first loads
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      // Check if product is already in the cart
      const existingProduct = prevCart.find(item => item.id === product.id)

      if (existingProduct) {
        // If it is, update its quantitySelected by adding the new amount
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantitySelected: item.quantitySelected + product.quantitySelected }
            : item
        )
      } else {
        // If it's a new product, append it to the cart
        return [...prevCart, product]
      }
    })
  }

  const updateCartItemQuantity = (productId, change) => {
    setCart(prevCart => {
      const itemToUpdate = prevCart.find(item => item.id === productId);
      if (!itemToUpdate) return prevCart;

      const newQuantity = (itemToUpdate.quantitySelected || 1) + change;

      // Enforce inventory limit
      if (newQuantity > itemToUpdate.inventory_count) return prevCart;

      // Remove item if quantity falls to 0 or below
      if (newQuantity <= 0) {
        return prevCart.filter(item => item.id !== productId);
      }

      // Otherwise, update the quantity safely
      return prevCart.map(item =>
        item.id === productId ? { ...item, quantitySelected: newQuantity } : item
      );
    })
  }

  const toggleCart = () => {
    window.location.hash = isCartOpen ? '' : 'cart'
  }

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen)
  }

  const toggleItem = () => {
    setIsItemOpen(!isItemOpen)
  }

  const toggleCheckout = () => {
    window.location.hash = isCheckoutOpen ? '' : 'checkout'
  }

  const togglePayment = () => {
    window.location.hash = isPaymentOpen ? '' : 'payment'
  }

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif", maxWidth: "1000px", margin: "0 auto", width: "100%" }}> {/* outermost grid wrap */}
      <Navbar
        cartCount={cart.reduce((total, item) => total + (item.quantitySelected || 1), 0)}
        cartOnClick={toggleCart}
        accountOnClick={toggleAccountMenu}
        itemOnClick={toggleItem} />
      <ProductGrid products={products} addToCart={addToCart} />
      <CartDrawer isOpen={isCartOpen} cartItems={cart} closeCart={toggleCart} updateQuantity={updateCartItemQuantity} openCheckout={toggleCheckout} />
      <Checkout isOpen={isCheckoutOpen} cartItems={cart} closeCart={toggleCheckout} openPayment={togglePayment} openCart={toggleCart} />
      <Payment isOpen={isPaymentOpen} cartItems={cart} closeCart={togglePayment} openCheckout={toggleCheckout} />
    </div>

  )

}

export default App