# **E-Commerce Platform Documentation**  
*(Angular 13 with RxJS State Management & JWT Authentication)*  

---

## **1. Project Setup Instructions**  

### **Prerequisites**  
- Node.js (v14.x or later)  
- Angular CLI (`npm install -g @angular/cli@13`)  
- IDE (VS Code recommended)  

### **Installation Steps**  

1. **Clone the Repository**  
   ```bash
   git clone <repository-url>
   cd ecommerce-platform
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   ```

3. **Install Additional Required Packages**  
   ```bash
   npm install jwt-decode @types/jwt-decode
   ```

4. **Run the Application**  
   ```bash
   ng serve
   ```
   Open `http://localhost:4200` in your browser.

---

## **2. Architectural Decisions**  

### **Core Architecture**  
- **Modular Structure**: Lazy-loaded feature modules (`Home`, `Auth`, `Admin`, `Cart`)  
- **State Management**: RxJS `BehaviorSubject` for global state (instead of NgRx)  
- **Authentication**: JWT-based (access token stored in `localStorage`)  
- **API Communication**: Angular `HttpClient` with interceptors for token handling  

### **Key Decisions**  

| **Decision** | **Why?** | **Alternatives Considered** |
|-------------|---------|----------------------------|
| **RxJS State Management** | Lightweight, avoids NgRx complexity | NgRx, Akita, Redux |
| **Lazy-Loaded Modules** | Faster initial load time | Eager loading |
| **JWT Authentication** | Stateless, scalable | Session-based auth |
| **BehaviorSubject for State** | Simple reactive state management | NgRx Store, Signals (Angular 16+) |
| **Role-Based Guards** | Secure admin routes | Custom middleware |

---

## **3. API Endpoints (Mocked/Backend Integration)**  

### **Auth Endpoints**  

| **Endpoint** | **Method** | **Description** | **Request Body** | **Response** |
|-------------|-----------|----------------|------------------|--------------|
| `/api/auth/login` | `POST` | User login | `{ username, password }` | `{ accessToken, user }` |
| `/api/auth/register` | `POST` | User registration | `{ username, email, password }` | `{ accessToken, user }` |
| `/api/auth/refresh-token` | `POST` | Refresh expired JWT | `{ token }` | `{ accessToken }` |

### **Product Endpoints**  

| **Endpoint** | **Method** | **Description** | **Request Body** | **Response** |
|-------------|-----------|----------------|------------------|--------------|
| `/api/products` | `GET` | Get all products | - | `Product[]` |
| `/api/products/:id` | `GET` | Get product by ID | - | `Product` |
| `/api/products` | `POST` | Add new product (Admin) | `{ name, price, description }` | `Product` |
| `/api/products/:id` | `PUT` | Update product (Admin) | `{ name, price, description }` | `Product` |
| `/api/products/:id` | `DELETE` | Delete product (Admin) | - | `{ success: boolean }` |

### **User Management (Admin-Only)**  

| **Endpoint** | **Method** | **Description** | **Request Body** | **Response** |
|-------------|-----------|----------------|------------------|--------------|
| `/api/users` | `GET` | List all users | - | `User[]` |
| `/api/users/:username` | `PUT` | Update user role | `{ role }` | `User` |
| `/api/users/:username` | `DELETE` | Delete user | - | `{ success: boolean }` |

---

## **4. State Management Flow**  

### **Auth State (`AuthStateService`)**  
- **Stores**:  
  - JWT token  
  - Current user (`id, username, email, role`)  
  - `isAuthenticated` flag  

- **Key Methods**:  
  ```typescript
  setToken(token: string)  // Decodes JWT & updates state
  clearState()            // Logout (clears token)
  isAdmin()               // Role check
  ```

### **Product State (`ProductService`)**  
- Uses `HttpClient` + caching (RxJS `ReplaySubject`)  
- Example:  
  ```typescript
  getProducts(): Observable<Product[]> {
    if (this.cachedProducts) return of(this.cachedProducts);
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      tap(products => this.cachedProducts = products)
    );
  }
  ```

---

## **5. Security & Guards**  

### **Route Guards**  
| **Guard** | **Purpose** | **Usage** |
|-----------|------------|----------|
| `AuthGuard` | Restricts routes to logged-in users | `/cart`, `/profile` |
| `AdminGuard` | Restricts to `role: admin` | `/admin`, `/manage-products` |

### **JWT Handling**  
- **Interceptor**:  
  - Adds `Authorization: Bearer <token>` to requests  
  - Auto-refreshes token on `401` errors  

