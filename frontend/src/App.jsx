import { useState, useEffect } from 'react'
import ProductGrid from './ProductGrid'
import Navbar from './Navbar'
import CartDrawer from './CartDrawer'
import Checkout from './Checkout'
import Payment from './Payment'
import SuccessModal from './components/Checkout/SuccessModal'
import { getOrInitializeUserId } from './utils/userUtils'

function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isItemOpen, setIsItemOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [lastOrder, setLastOrder] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    country: ""
  })

  useEffect(() => {
    // async: tells javascript, if see await, pause and wait for the result
    const initUser = async () => { // const initUser... is preparing the task
      const id = await getOrInitializeUserId();
      setCurrentUserId(id);
    };
    initUser(); // initUser is starting the task
  }, [])

  // 1. Fetch products from backend
  useEffect(() => {
    fetch('http://127.0.0.1:8000/products/')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Error fetching products:", error))
  }, [])

  // 2. Fetch cart from backend
  const fetchCart = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/orders/cart/${currentUserId}`);
      const data = await response.json();
      setCart(data.map(item => ({
        ...item.product,
        id: item.product_id,
        quantitySelected: item.quantity,
        db_item_id: item.id
      })));
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }

  useEffect(() => {
    if (products.length > 0 && currentUserId) fetchCart();
  }, [products, currentUserId])

  // Use the URL hash (#cart, #checkout) to manage the browser's back button
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setIsCartOpen(hash === '#cart');
      setIsCheckoutOpen(hash === '#checkout');
      setIsPaymentOpen(hash === '#payment');
      if (hash !== '#success') setIsSuccessOpen(false);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const addToCart = async (product) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/orders/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUserId,
          product_id: product.id,
          quantity: product.quantitySelected || 1,
          price_at_purchase: product.price
        })
      });
      if (response.ok) fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }

  const updateCartItemQuantity = async (productId, change) => {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;

    const newQuantity = cartItem.quantitySelected + change;

    if (newQuantity <= 0) {
      try {
        await fetch(`http://127.0.0.1:8000/orders/items/${cartItem.db_item_id}`, { method: 'DELETE' });
        fetchCart();
      } catch (error) {
        console.error("Error removing item:", error);
      }
    } else {
      // The backend now supports merging, so we can send positive or negative change
      await addToCart({ ...cartItem, quantitySelected: change });
    }
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

  const handleOrderSuccess = (order) => {
    setLastOrder(order);
    setCart([]); // Clear cart
    
    // Reset Shipping Info for privacy
    setShippingInfo({
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      country: ""
    });

    localStorage.removeItem("active_user_id"); // 1. CLEAR THE SESSION
    
    // 2. Immediately generate a NEW ID for the next potential order
    getOrInitializeUserId().then(id => setCurrentUserId(id));

    setIsSuccessOpen(true);
    window.location.hash = 'success';
  }

  const closeSuccess = () => {
    setIsSuccessOpen(false);
    window.location.hash = '';
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
      <Checkout
        isOpen={isCheckoutOpen}
        cartItems={cart}
        closeCart={toggleCheckout}
        openPayment={togglePayment}
        openCart={toggleCart}
        shippingInfo={shippingInfo}
        setShippingInfo={setShippingInfo}
      />
      <Payment
        isOpen={isPaymentOpen}
        cartItems={cart}
        closeCart={togglePayment}
        openCheckout={toggleCheckout}
        shippingInfo={shippingInfo}
        onSuccess={handleOrderSuccess}
      />
      <SuccessModal
        isOpen={isSuccessOpen}
        order={lastOrder}
        closeSuccess={closeSuccess}
      />
    </div>

  )

}

export default App