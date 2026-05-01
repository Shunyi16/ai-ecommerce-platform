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
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [lastOrder, setLastOrder] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchItem, setSearchItem] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

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
    const skip = (currentPage - 1) * 15;
    const limit = 15;
    const url = selectedCategory
      ? `http://127.0.0.1:8000/categories/${selectedCategory.id}/products?skip=${skip}&limit=${limit}`
      : `http://127.0.0.1:8000/products/?skip=${skip}&limit=${limit}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setProducts(data.items);
        setTotalCount(data.totalCount);
      })
      .catch(error => console.error("Error fetching products:", error))
  }, [selectedCategory, currentPage])

  // Reset to page 1 whenever category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchItem]);

  // 2. Fetch cart from backend
  const fetchCart = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/orders/cart/${currentUserId}`);
      const data = await response.json();
      setCart(data.map(item => ({
        ...item.product, //
        id: item.product_id,
        quantitySelected: item.quantity,
        db_item_id: item.id
      })));
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }

  // restores user's shopping cart from backend
  useEffect(() => {
    if (products.length > 0 && currentUserId) fetchCart();
  }, [products, currentUserId])

  //  reaction for cart, checkout, payment, success
  // Use the URL hash (#cart, #checkout) to manage the browser's back button
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash; //This line looks at the current URL and grabs everything from the # onward
      setIsCartOpen(hash === '#cart'); //If the hash is exactly '#cart', it sets the cart state to true
      setIsCheckoutOpen(hash === '#checkout'); //If the hash is exactly '#checkout', it sets the checkout state to true
      setIsPaymentOpen(hash === '#payment'); //If the hash is exactly '#payment', it sets the payment state to true
      if (hash !== '#success') setIsSuccessOpen(false); //If the hash is not '#success', it sets the success state to false
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const addToCart = async (product) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/orders/items', {
        method: 'POST', //tells the server the type of action is taken
        headers: { 'Content-Type': 'application/json' }, //tells the server the type of data being sent
        body: JSON.stringify({ //converts the JavaScript object into a JSON string
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

  const updateCartItemQuantity = async (productId, change) => { //async allows this function to "pause" and wait for the database to finish updating
    //.find() is a built-in JavaScript tool; 
    // item => ... This is a "lookup rule." It tells the code: "Look at each item and examine its contents.";
    // Stop once you find the item whose ID matches the number
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

  // trigger to open cart
  const toggleCart = () => {
    window.location.hash = isCartOpen ? '' : 'cart'
  }

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen)
  }

  const toggleCheckout = () => {
    window.location.hash = isCheckoutOpen ? '' : 'checkout'
  }

  const togglePayment = () => {
    window.location.hash = isPaymentOpen ? '' : 'payment'
  }

  const searchProducts = products.filter(p => {
    if (!searchItem.trim()) return true;

    const searchWords = searchItem.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    const productName = p.name.toLowerCase();

    return searchWords.some(word => productName.includes(word));
  });

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
    <div style={{ padding: "20px 20px 20px 20px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}> {/* outermost grid wrap */}
      <Navbar
        cartCount={cart.reduce((total, item) => total + (item.quantitySelected || 1), 0)}
        cartOnClick={toggleCart}
        accountOnClick={toggleAccountMenu}
        itemOnClick={setSelectedCategory}
        logoOnClick={() => {
          setSelectedCategory(null);
          setSearchItem("");
        }}
        onSearch={setSearchItem} />
      <ProductGrid products={searchProducts} addToCart={addToCart} currentPage={currentPage} setCurrentPage={setCurrentPage} totalCount={totalCount} />
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