## QUICK SUMMARY: `Navbar.jsx`
Renders a responsive navigation bar with search, logo, account/cart links, and dynamic categories fetched from an API.

| Function Name | Description |
|:--------------|:------------|
| `Navbar`      | Renders a navigation bar with dynamic content. |

---

### `Navbar`
Renders a comprehensive navigation bar featuring search, branding, user actions, and dynamic category links.

#### Arguments
- **`cartCount`** (`number`): The current number of items in the user's shopping cart.
- **`cartOnClick`** (`function`): A callback function executed when the cart icon is clicked.
- **`accountOnClick`** (`function`): A callback function executed when the account icon is clicked.
- **`itemOnClick`** (`function`): A callback function executed when a category navigation item is clicked, receiving the category object.
- **`logoOnClick`** (`function`): A callback function executed when the main logo is clicked.
- **`onSearch`** (`function`): A callback function passed to the `SearchBar` component, executed when a search is performed.

#### Return Value
- `JSX.Element`: A React header element containing the complete navigation structure, including search, logo, account/cart icons, and category links.

#### Error Handling
- `console.log`: Logs an error message to the console if the fetch request for categories fails.

#### Description
The `Navbar` component constructs the main navigation header for the application. It utilizes React's `useState` hook to manage the list of product categories and the currently hovered category for UI effects. An `useEffect` hook is employed to asynchronously fetch category data from a local API endpoint (`http://localhost:8000/categories/`) upon component mounting, populating the navigation links dynamically. The component's structure includes a top row with a `SearchBar` (which uses the `onSearch` prop), a central logo (`Home Lightings` with `logoOnClick` prop), and right-aligned icons for `Account` (`accountOnClick` prop) and `Cart` (`cartOnClick` prop), displaying the `cartCount`. A bottom navigation row dynamically renders category links, each invoking `itemOnClick` when clicked. Hover effects are implemented using local state to provide visual feedback.

#### Example
```jsx
import Navbar from './Navbar';

function App() {
    const handleCartClick = () => console.log("Cart icon clicked!");
    const handleAccountClick = () => console.log("Account icon clicked!");
    const handleItemClick = (category) => console.log("Category clicked:", category.name);
    const handleLogoClick = () => console.log("Logo clicked!");
    const handleSearch = (query) => console.log("Search query:", query);

    return (
        <Navbar
            cartCount={3}
            cartOnClick={handleCartClick}
            accountOnClick={handleAccountClick}
            itemOnClick={handleItemClick}
            logoOnClick={handleLogoClick}
            onSearch={handleSearch}
        />
    );
}
// Expected output: Renders a Navbar component with 3 items in cart.
// Console logs will appear upon user interactions (clicks, search).
```