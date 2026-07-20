# ShopEZ — Full-Stack MERN E-Commerce Application

ShopEZ is a complete, production-ready e-commerce web application built with the
**MERN** stack (MongoDB, Express.js, React, Node.js) and secured with **JWT authentication**.

It includes a customer-facing storefront (home page, product browsing/search/filtering,
product details with reviews, cart, checkout) and a full **Admin Dashboard** with CRUD
operations for products and order management.

---

## Tech Stack

| Layer      | Technology                                              |
|------------|----------------------------------------------------------|
| Frontend   | React 18 (Vite), React Router v6, Axios, React Toastify   |
| Backend    | Node.js, Express.js                                       |
| Database   | MongoDB with Mongoose ODM                                  |
| Auth       | JSON Web Tokens (JWT) + bcrypt password hashing            |
| Styling    | Plain CSS (no framework dependency, fully responsive)      |

---

## Project Structure

```
ShopEZ/
├── client/                     # React (Vite) frontend
│   ├── public/
│   │   └── images/             # Product placeholder image
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProductCard, Rating, route guards, etc.
│   │   ├── context/             # AuthContext, CartContext (React Context API)
│   │   ├── pages/                # Home, Products, ProductDetails, Cart, Login, Register,
│   │   │   └── Admin/              Shipping, PlaceOrder, OrderDetails, Profile, MyOrders...
│   │   │                        # Admin/Dashboard, ProductList, ProductEdit, OrderList
│   │   ├── services/            # Axios instance (api.js)
│   │   ├── App.jsx               # Route definitions
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express backend (ESM / MongoDB / JWT)
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/             # authController, productController, orderController
│   ├── middleware/               # authMiddleware (protect/admin), errorMiddleware
│   ├── models/                   # User, Product, Order (Mongoose schemas)
│   ├── routes/                   # authRoutes, productRoutes, orderRoutes
│   ├── seed/                     # data.js (sample data) + seeder.js (import/destroy script)
│   ├── utils/
│   │   └── generateToken.js       # JWT signing helper
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # App entry point
│
├── package.json                 # Root convenience scripts (run both apps together)
└── README.md
```

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB** — either:
  - a local MongoDB instance running on `mongodb://127.0.0.1:27017`, **or**
  - a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (recommended if you don't want to install MongoDB locally)

---

## Setup Instructions

### 1. Clone / extract the project and install dependencies

From the project root (`ShopEZ/`), install dependencies for both the server and client:

```bash
npm run install-all
```

This runs `npm install` in both the `server/` and `client/` folders.
(If you prefer to do it manually: `cd server && npm install`, then `cd ../client && npm install`.)

If you'd like to use the root convenience script `npm run dev` (which starts both apps together
with a single command), also install the root dependency:

```bash
npm install
```

### 2. Configure environment variables

**Server** — copy the example env file and fill in your values:

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shopez
JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
```

> If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string, e.g.
> `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/shopez`

**Client** — copy the example env file:

```bash
cd ../client
cp .env.example .env
```

The default `VITE_API_URL=/api` works out of the box with the Vite dev server proxy
(configured in `client/vite.config.js` to forward `/api` requests to `http://localhost:5000`),
so no changes are usually needed for local development.

### 3. Seed the database with sample data

From the `server/` folder, run:

```bash
cd server
npm run seed
```

This will wipe existing Users/Products/Orders and insert:
- **3 sample users** (1 admin, 2 regular customers)
- **12 sample products** across multiple categories

**Demo login credentials created by the seeder:**

| Role  | Email                | Password      |
|-------|-----------------------|---------------|
| Admin | admin@shopez.com      | admin123      |
| User  | john@example.com      | password123   |
| User  | jane@example.com      | password123   |

To wipe all data instead: `npm run seed:destroy`

### 4. Run the application

**Option A — Run both apps at once (from the project root):**

```bash
npm run dev
```

**Option B — Run them separately in two terminals:**

```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm run dev
```

- Backend API: **http://localhost:5000**
- Frontend app: **http://localhost:5173**

Open **http://localhost:5173** in your browser to use the app.

---

## Available Features

### Storefront
- Home page with featured products and category shortcuts
- Product listing with keyword search, category filter, price sort, and pagination
- Product details page with image, description, stock status, and customer reviews
- Add product reviews (logged-in users only, one review per user per product)
- Shopping cart (persisted in `localStorage`) with quantity adjustment
- Multi-step checkout: shipping address → order review → place order
- Order confirmation and order history ("My Orders")
- User profile management (update name/email/password)

### Authentication (JWT)
- Register / Login / Logout
- Passwords hashed with bcrypt
- JWT issued on login/register, stored client-side, and sent via `Authorization: Bearer <token>` header (also mirrored in an httpOnly cookie)
- Protected routes on both the frontend (`PrivateRoute`, `AdminRoute`) and backend (`protect`, `admin` middleware)

### Admin Dashboard (requires `isAdmin: true`)
- Dashboard with quick stats: total products, total orders, total revenue, pending orders
- **Full CRUD for products**: create, view, update, delete
- Order management: view all orders, update order status (Pending → Processing → Shipped → Delivered → Cancelled)

---

## REST API Reference

Base URL: `http://localhost:5000/api`

### Auth (`/api/auth`)
| Method | Endpoint          | Access   | Description                    |
|--------|-------------------|----------|--------------------------------|
| POST   | `/register`       | Public   | Register a new user            |
| POST   | `/login`          | Public   | Log in and receive a JWT       |
| POST   | `/logout`         | Private  | Clear auth cookie              |
| GET    | `/profile`        | Private  | Get logged-in user's profile   |
| PUT    | `/profile`        | Private  | Update logged-in user's profile|

### Products (`/api/products`)
| Method | Endpoint             | Access        | Description                                        |
|--------|-----------------------|---------------|----------------------------------------------------|
| GET    | `/`                   | Public        | List products (supports `keyword`, `category`, `minPrice`, `maxPrice`, `sort`, `page`, `pageSize`) |
| GET    | `/categories`         | Public        | List distinct product categories                    |
| GET    | `/featured`           | Public        | Top-rated / featured products                        |
| GET    | `/:id`                | Public        | Get a single product by ID                           |
| POST   | `/`                   | Private/Admin | Create a new product                                 |
| PUT    | `/:id`                | Private/Admin | Update a product                                     |
| DELETE | `/:id`                | Private/Admin | Delete a product                                     |
| POST   | `/:id/reviews`        | Private       | Add a review to a product                            |

### Orders (`/api/orders`)
| Method | Endpoint            | Access        | Description                             |
|--------|-----------------------|---------------|------------------------------------------|
| POST   | `/`                   | Private       | Create a new order from cart items        |
| GET    | `/`                   | Private/Admin | List all orders                           |
| GET    | `/myorders`           | Private       | List the logged-in user's orders          |
| GET    | `/:id`                | Private       | Get a single order (owner or admin only)  |
| PUT    | `/:id/pay`            | Private       | Mark an order as paid                     |
| PUT    | `/:id/status`         | Private/Admin | Update order status / mark as delivered   |

---

## Making a User an Admin Manually

The seeder automatically creates one admin account (`admin@shopez.com`). If you want to
promote another existing user to admin, connect to your MongoDB instance and run:

```js
db.users.updateOne(
  { email: "someone@example.com" },
  { $set: { isAdmin: true } }
)
```

---

## Building for Production

1. Build the React app:
   ```bash
   cd client
   npm run build
   ```
   This outputs static files to `client/dist`.

2. Set `NODE_ENV=production` in `server/.env`. The Express server (`server/server.js`) is
   already configured to serve the built React app from `client/dist` and handle client-side
   routing when running in production mode.

3. Start the server:
   ```bash
   cd server
   npm start
   ```

---

## Notes

- Product images referenced in the sample data (`server/seed/data.js`) point to filenames
  like `/images/headphones.jpg`. A generic placeholder image is included at
  `client/public/images/placeholder.jpg` and is used as the fallback `onError` image
  throughout the UI — replace the sample data image paths with your own hosted images,
  or add matching files under `client/public/images/` for a fully custom catalog.
- CORS is configured via the `CLIENT_URL` environment variable on the server — update it
  if you deploy the frontend to a different origin.
- This project uses ES Modules (`"type": "module"`) throughout the backend.

---

## License

This project is provided as a learning/starter template and is free to use and modify.
