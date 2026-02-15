# 🏪 ABCD Supermarket Management System

A full-stack MERN application designed to manage supermarket operations with multi-role access, inventory control, billing system, and real-time reporting.

---

## 🚀 Overview

ABCD Supermarket is a role-based management system built using the MERN stack.

It supports three types of users:

- 👨‍💼 Manager
- 🧾 Sales Clerk
- 🚚 Supplier

The system enables product management, order processing, stock supply tracking, and business reporting.

---

## 🛠 Tech Stack

### Frontend

- React (Vite)
- React Router
- Axios
- Bootstrap

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt

---

## 👥 User Roles & Features

### 👨‍💼 Manager

- Add, update, delete products
- Manage pricing and stock
- View daily sales report
- View monthly sales report
- View total revenue
- Monitor low stock products

### 🧾 Sales Clerk

- View available products
- Add products to cart
- Calculate billing dynamically
- Place orders
- View order history
- Delete orders (with automatic stock restoration)

### 🚚 Supplier

- Supply products (increase stock)
- View supply history
- Track supplied quantities

---

## 🔐 Authentication & Security

- JWT-based authentication
- Role-based access control
- Protected backend routes
- Password hashing using bcrypt
- Frontend protected routing

---

## 📊 Reports & Analytics

- Daily Sales Revenue
- Monthly Sales Revenue
- Total Revenue
- Total Orders Count
- Low Stock Alerts

Reports are generated using MongoDB aggregation pipelines.

---

## 📦 Project Structure

ABCD-supermarket/
│
├── backend/
│ ├── models/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ └── config/
│
├── frontend/
│ ├── pages/
│ ├── components/
│ └── api/
│
└── README.md

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

- git clone <your-repo-url>
- cd ABCD-supermarket

---

### 2️⃣ Backend Setup

- cd backend
- npm install
- Create `.env` file:
- PORT = 5000
- MONGO_URI = your_mongodb_connection_string
- JWT_SECRET = your_secret_key
- start backend:
- npm run dev

---

### 3️⃣ Frontend Setup

- cd frontend
- npm install
- npm run dev

---

## 🔄 Application Flow

1. Manager adds products
2. Supplier supplies stock
3. Clerk places orders
4. Stock updates automatically
5. Reports reflect real-time sales

---

## 📌 Key Highlights

- Full CRUD operations
- Role-based dashboards
- Inventory consistency (stock restore on order delete)
- Real-time sales analytics
- Clean admin-style UI
- Modular backend architecture

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

Priyanshu Rajoria  
LinkedIn: https://www.linkedin.com/in/priyanshu-rajoria/
