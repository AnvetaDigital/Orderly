# Orderly – Full-Stack Product & Order Management App

A small full-stack web application to manage **products, stock, and customer orders**.

Built using:
- **Frontend:** React + React Query + TypeScript
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL (with pg library)

---

##  Features
- Add new products with validation
- Manage available product list with stock tracking
- Create customer orders using existing products
- Automatically deduct stock when products are ordered
- Prevent invalid submissions with real-time validation
- View all placed orders with product and quantity details
- TypeScript support on both frontend and backend
- React Query used for API calls and cache management

---

## Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | React, React Query, TypeScript |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL (with pg library) |
| Tools | Axios, CORS, ts-node-dev |

---

## 🗂️ Folder Structure

Orderly/
│
├── backend/
│ ├── index.ts # Express server setup
│ ├── routes/ # Product and order routes
│ ├── controllers/ # Business logic for each API
│ ├── db.ts # MySQL connection config
│ ├── package.json
│
├── frontend/
│ ├── src/
│ │ ├── api/ # Axios API services
│ │ ├── components/ # React components
│ │ ├── App.tsx
│ │ ├── index.tsx
│ │ ├── index.css
│ ├── tsconfig.json
│ ├── package.json
│
└── README.md


---

##  Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/AnvetaDigital/Orderly.git
cd orderly

Backend Setup
cd backend
npm install

Create .env file
PORT=5000
PG_USER=postgres
PG_PASSWORD="yourpassword"
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=orderlydb

Run Postgresql scripts
CREATE DATABASE orderlydb;

USE orderlydb;

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  price DECIMAL(10,2),
  stock INT
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

Start backend
npm run dev

Backend will run at http://localhost:5000

frontend setup
cd ../frontend
cd client
npm install
npm start

Frontend will run at http://localhost:3000

API Endpoints:

| Method | Endpoint        | Description      |
| ------ | --------------- | ---------------- |
| GET    | `/api/products` | Get all products |
| POST   | `/api/products` | Add new product  |
| GET    | `/api/orders`   | Get all orders   |
| POST   | `/api/orders`   | Create new order |

