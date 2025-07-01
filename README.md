# High-Level Design: Directory Structure & Purpose

This Angular project uses a modular, scalable directory structure for maintainability, collaboration, and extensibility. Below is an organized overview of the main directories and files, with their purposes.

---

## 🗂️ Root Directory

| File/Folder         | Purpose                                                                 |
|---------------------|-------------------------------------------------------------------------|
| `angular.json`      | Angular CLI configuration (build, serve, test, lint, etc.)              |
| `package.json`      | Project dependencies, scripts, and metadata                             |
| `tsconfig.json`     | TypeScript compiler configuration                                       |
| `README.md`         | Project overview, setup, and architecture docs                          |

---

## 📁 `/src`

Contains all source code for the Angular application.

### `/src/app`

Main application code, organized into feature modules.

#### Subdirectories

| Folder         | Purpose                                                                                  |
|----------------|------------------------------------------------------------------------------------------|
| `/admin`       | Admin dashboard and management (users, products, categories, orders)                     |
| `/cart`        | Shopping cart, checkout, and order history components                                    |
| `/core`        | Guards, NGRX, navbar, footer, and interceptors used throughout the app                   |
| `/auth`        | Authentication and user session management (login, register)                             |

| File                   | Purpose                                               |
|------------------------|-------------------------------------------------------|
| `app.module.ts`        | Root Angular module, imports feature modules          |
| `app-routing.module.ts`| Central routing configuration, lazy-loaded routes     |

---

## 📂 `/src/app/admin`

| File/Folder                  | Purpose                                   |
|------------------------------|-------------------------------------------|
| `admin.module.ts`            | Declares admin components and routes      |
| `/components/admin-dashboard`| Admin overview and stats                  |
| `/components/manage-products`| CRUD operations for products              |
| `/components/manage-orders`  | View and update orders                    |
| `/components/manage-users`   | User management                           |
| `/components/manage-category`| Manage product categories                 |
| `/components/admin-profile`  | Admin profile management                  |
| `admin.component.ts`         | Admin root component                      |
| `admin-routing.module.ts`    | Admin-specific routes                     |

---

## 📂 `/src/app/auth`

| File/Folder                  | Purpose                                   |
|------------------------------|-------------------------------------------|
| `auth.module.ts`             | Declares and exports auth components      |
| `/components/login`          | Login form and logic                      |
| `/components/register`       | Registration form and logic               |
| `auth-routing.module.ts`     | Auth-specific routes                      |
| `auth.component.ts`          | Auth root component                       |

---

## 📂 `/src/app/cart`

Shopping cart and checkout process.

| Folder         | Purpose                                   |
|----------------|-------------------------------------------|
| `/cart`        | Shows items in the cart                   |
| `/checkout`    | Handles checkout and payment              |
| `/order`       | Displays order confirmation               |
| `/order-history`| Displays order history                   |
| `cart.module.ts`| Declares cart and checkout components    |

---

## 📂 `/src/app/core`

| File/Folder                  | Purpose                                   |
|------------------------------|-------------------------------------------|
| `core.module.ts`             | Declares/provides core services, guards   |
| `/guards/auth.guard.ts`      | Protects routes from unauthorized access  |
| `/guards/admin.guard.ts`     | Restricts access to admin routes          |
| `/guards/unsaved-changes.guard.ts` | Prevents navigation with unsaved changes |
| `/interceptors/auth.interceptor.ts`| Handles token refresh logic          |
| `/store/auth`                | NgRx state management for authentication  |
| `/footer`                    | Site-wide footer component                |
| `/navbar`                    | Site-wide navigation and branding         |

---

## 📂 `/src/app/home`

Contains all components, services, and modules for the "Home" feature.

| File/Folder                  | Purpose                                   |
|------------------------------|-------------------------------------------|
| `home.module.ts`             | Declares and exports Home components      |
| `/components/caraousel`      | Rotating carousel of images/promotions    |
| `/components/product-card`   | Displays products on the home page        |
| `/components/product-list`   | Sends products to product-card component  |
| `home-page.component.ts`     | Main landing page UI and logic            |
| `home-routing.module.ts`     | Home feature routes                       |

---

## 📂 `/src/app/models`

Defines TypeScript interfaces and models for type safety and consistency.

| File                | Purpose                                   |
|---------------------|-------------------------------------------|
| `user.model.ts`     | Interface for user data                   |
| `product.model.ts`  | Interface for product details             |
| `order.model.ts`    | Interface for order information           |
| `category.model.ts` | Interface for product categories          |
| `cart.model.ts`     | Interface for shopping cart items         |

---

## 📂 `/src/app/services`

Reusable Angular services for business logic, API communication, and utilities.

| File/Folder                  | Purpose                                   |
|------------------------------|-------------------------------------------|
| `/product/product.service.ts`    | Product API calls                         |
| `/user/user.service.ts`       | User API requests and profile updates     |
| `/order/order.service.ts`      | Order processing and retrieval            |
| `/category/category.service.ts`   | Product category API interactions         |
| `/notifications/notification.service.ts`| Toast messages, alerts, notifications    |
| `/orderitem/orderitem.service.ts`  | Order item operations                     |
| `/auth/auth.service.ts`            | Authentication logic and token management |
| `/cart/cart.service.ts`            | Shopping cart operations                  |

---

## 📁 `src/assets`

Static assets such as images, icons, and mock data.

---

## 📁 `/src/environments`

Environment-specific configuration files (e.g., API endpoints for dev/prod).

---

## `src/styles.scss`

Global styles and theme definitions.

---

## 💡 Why This Structure?

- **Separation of Concerns:** Each feature/module is isolated for easier navigation and maintenance.
- **Scalability:** New features can be added as new modules without affecting existing code.
- **Reusability:** Shared and core modules promote code reuse and reduce duplication.
- **Performance:** Lazy loading of modules improves initial load time and user experience.

---
