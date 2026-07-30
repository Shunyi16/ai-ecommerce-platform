# Technical Documentation: AI E-commerce Platform

Welcome to the technical documentation for the AI E-commerce platform. This document provides a comprehensive overview of the system architecture, database design, API surface, and core feature engineering.

---

## 🏗 System Architecture

The application is built on a modern, decoupled architecture designed for performance and maintainability:

### **Backend (Python)**
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) for high-performance, asynchronous RESTful API endpoints.
- **ORM Framework:** [SQLModel](https://sqlmodel.tiangolo.com/) (which bridges SQLAlchemy and Pydantic) to maintain a single source of truth for database schemas and data validation models.
- **Database Engine:** PostgreSQL managing relational data persistence.
- **Development Server:** [Uvicorn](https://www.uvicorn.org/) providing ASGI server capabilities with hot-reloading.

### **Frontend (JavaScript)**
- **UI Library:** [React](https://react.dev/) emphasizing component-driven development.
- **Build Tooling:** [Vite](https://vitejs.dev/) enabling instant server start and lightning-fast Hot Module Replacement (HMR).
- **Styling Strategy:** Vanilla CSS implementing a custom design system focused on high-end, premium aesthetics and responsive layouts without framework bloat.
- **State Management:** React Context API and localized hooks (e.g., `useState`, `useEffect`) manage complex interactions like the persistent cart.

---

## 📊 Database Schema & ORM Design

The database utilizes `SQLModel` to define robust relational entities. 

### **Entity-Relationship Overview**

||: Means "exactly one".
--: The line connecting the two tables.
o{: Means "zero or many".
orders: The second table.
: places: The label written on the line connecting them.

mermaid
erDiagram
    users ||--o{ orders : places
    users {
        int id PK
        string email UK
        string full_name
        string hashed_password
        boolean is_admin
    }
    
    categories }o--o{ products : categorizes 
    categories {
        int id PK
        string name UK
    }
    
    ProductCategoryLink {
        int product_id FK
        int category_id FK
    }
    
    products ||--o{ order_items : "included in"
    products {
        int id PK
        string name
        string description
        float price
        int inventory_count
        string image_url
        boolean is_active
    }
    
    orders ||--o{ order_items : contains
    orders {
        int id PK
        int user_id FK
        string status
        datetime created_at
        string full_name
        string email
        string address
        string city
        string state
        string zip_code
        string order_number
        string tracking_number
        string carrier
    }
    
    order_items {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        float price_at_purchase
    }
```

### **Schema Highlights**
*   **Historical Accuracy:** The `order_items` table explicitly captures `price_at_purchase`. This prevents past order totals from changing if a product's price is updated in the future.
*   **Many-to-Many Relationships:** A hidden `ProductCategoryLink` table manages the relationship between `products` and `categories`, allowing diverse catalog organization.
*   **Dynamic Computations:** The `OrderRead` model leverages Pydantic's `@computed_field` to automatically calculate the precise `total_price` based on historical item prices.

---

## 🔌 API Interaction Surface (FastAPI Routers)

The backend exposes a highly organized API through modular routers:

### **`[POST/GET/PATCH] /users` Router**
- Responsible for account creation and management.
- Handles the dynamic generation of anonymous Guest User accounts (e.g., `guest_xyz123@store.com`) to support friction-free browsing.

### **`[GET] /categories` Router**
- Fetches the dynamic navigation structure.
- Simplifies fetching all active products grouped under a specific category ID.

### **`[POST/GET/PATCH] /products` Router**
- Manages inventory updates and product modifications.
- Implements `exclude_unset=True` during PATCH requests to ensure only modified fields are updated in the database.

### **`[POST/GET/DELETE] /orders` Router**
- **Cart Management:** Endpoints for adding items, removing items, and fetching the active `"cart"` state.
- **Inventory Protection:** The `/items` POST route proactively deducts inventory, while the DELETE route restores inventory to prevent race conditions.
- **Checkout Processing:** Finalizes the cart into a `"pending"` order and links shipping data while automatically generating professional tracking and order IDs (e.g., `AG-83921`).

---

## ⚡ Core Systems Engineering

### **1. Seamless Guest Checkout Pipeline**
The system is explicitly designed to minimize drop-off rates by avoiding mandatory account creation.
- Cart state immediately binds to a distinct Guest ID assigned dynamically via the `/users/guest` endpoint.
- This ID maps directly to standard `users` and `orders` tables, eliminating the need for separate tracking logic for authenticated vs. unauthenticated users.

### **2. Location-Aware Taxation Engine**
- A robust utility (`utils/taxUtils.js`) intercepts the checkout flow to apply accurate, state-specific tax rates based on standard 50-state mapping.
- As the user types their shipping address, the DOM reactivity dynamically recalculates sub-totals, applying precision rounding before the final charge representation.

### **3. Form Architecture & Validation Constraints**
- The monolithic checkout experience is decoupled into discrete, maintainable React components (`Payment`, `OrderSummary`, etc.).
- Invalid checkout states are aggressively caught using native HTML5 validation paired with custom JS logic, rendering UI-friendly error indicators rather than alert popups.
- Component state (like checkout data parameters) survives page refreshes via specialized HashRouter implementations.

---

## 🎨 UI/UX Design Specifications

The frontend implements a bespoke, high-conversion design system:
- **Boutique Grid System:** Product cards employ deliberate whitespace, precise aspect-ratio constraints for images, and subtle transform animations on hover.
- **Three-Row Navigation Hierarchy:** 
  1. Top-tier branding structure.
  2. Sub-tier application utilities (Search, Cart access).
  3. Dynamic API-driven category filters forming the baseline.
- **Typography:** Implementation of professional web fonts (Google Inter/Outfit variant styles) configured at the root CSS layer for uniform application across all standard components.

---

## 🛠 Development Diagnostics

### **Spinning Up Environments**
*   **Database:** Verify PostgreSQL is running (`brew services info postgresql`).
*   **Backend Application:** 
    ```bash
    cd backend
    poetry run uvicorn main:app --reload
    ```
*   **Frontend Application:** 
    ```bash
    cd frontend
    npm run dev
    ```

### **API Documentation Context**
FastAPI exposes real-time OpenAPI schemas documenting exact payload expectations and HTTP response codes:
- **Development Swagger Interface:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Static ReDoc Interface:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---
*Technical Documentation Version 2.0 | Last Updated: 2026-04-27*
