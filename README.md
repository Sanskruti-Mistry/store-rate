# 🌟 Store Rating System

**Full-Stack Project • Node.js • Express • Prisma ORM • PostgreSQL**

🔗 **GitHub Repository:**
[https://github.com/Pagaryash/store-rating-system](https://github.com/Pagaryash/store-rating-system)

🌍 **Live Website:**
[https://peaceful-croissant-01fe44.netlify.app/](https://peaceful-croissant-01fe44.netlify.app/)

---

## 📌 Overview

The **Store Rating System** is a full-stack web application where users can browse stores, submit ratings (1–5), and view dashboards based on their assigned roles.

The application includes:

- 🔐 Secure authentication using JWT
- 👑 Role-based access (Admin, Owner, User)
- 🏪 Store management & owner dashboard
- ⭐ User rating system
- 📊 Admin analytics dashboard
- 🌍 Fully deployed (Netlify + Render + Neon DB)

---

## 🎯 Features by Role

### 👑 Admin Features

- Add new Users (Admin / Owner / User)
- Add new Stores
- Assign Store Owners
- View Insights Dashboard:

  - Total Users
  - Total Stores
  - Total Ratings

- Manage Users: search & filter
- Manage Stores

---

### 🧑‍💼 Store Owner Features

- View the store they own
- View ratings posted by customers
- See average store rating

---

### 👤 User Features

- Sign up & Login
- Browse all stores
- Search stores
- Submit rating (1–5)
- Update rating anytime

---

# 🛠️ Tech Stack

### **Frontend**

- React (Vite)
- React Router
- Context API for auth
- Hosted on **Netlify**

### **Backend**

- Node.js + Express
- Prisma ORM
- JWT Authentication
- Hosted on **Render**

### **Database**

- PostgreSQL (**Neon**)
- Prisma Migrations

---

# 🗂️ Database Schema (Prisma)

### **User**

- id
- name
- email
- passwordHash
- role (ADMIN / OWNER / USER)
- address
- relations → stores, ratings

### **Store**

- id
- name
- email
- address
- ownerId
- relations → ratings

### **Rating**

- id
- value (1–5)
- userId
- storeId
- unique (userId, storeId)

---

# 🌐 API Endpoints

### 🔐 Authentication

| Method | Route          | Description  |
| ------ | -------------- | ------------ |
| POST   | `/auth/signup` | Register     |
| POST   | `/auth/login`  | Login        |
| GET    | `/auth/me`     | Current user |

---

### 🧑‍💼 Owner

| Method | Route                     | Description   |
| ------ | ------------------------- | ------------- |
| GET    | `/owner/my-store`         | Owner store   |
| GET    | `/owner/my-store/ratings` | Store ratings |

---

### 👤 User

| Method | Route                 | Description          |
| ------ | --------------------- | -------------------- |
| GET    | `/stores`             | List stores          |
| GET    | `/stores/:id`         | Store details        |
| POST   | `/stores/:id/ratings` | Submit/update rating |

---

### 👑 Admin

| Method | Route              | Description  |
| ------ | ------------------ | ------------ |
| GET    | `/admin/users`     | List users   |
| POST   | `/admin/users`     | Create user  |
| GET    | `/admin/stores`    | List stores  |
| POST   | `/admin/stores`    | Create store |
| GET    | `/admin/dashboard` | Stats        |

---

# 📸 Demo (Screenshots PDF)

All application screens — Login, Admin Dashboard, Owner Dashboard, Stores Page, Rating Modal — are included in the PDF below:

📄 **Demo Screenshots:**
👉 [https://github.com/Pagaryash/store-rating-system/blob/main/Demo.pdf](https://github.com/Pagaryash/store-rating-system/blob/main/Demo.pdf)

**Download:**
[Click here to download Demo.pdf](https://github.com/Pagaryash/store-rating-system/raw/main/Demo.pdf)

**Preview:**
![Demo PDF](https://github.com/Pagaryash/store-rating-system/blob/main/Demo.pdf)

---

# ⚙️ Local Development Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Pagaryash/store-rating-system.git
cd store-rating-system
```

---

## 🖥️ Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```
DATABASE_URL=postgresql://localhost:5432/store_rating_dev?schema=public
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Start backend:

```bash
npm run dev
```

Backend runs at:

```
http://localhost:3000
```

---

# 🎨 Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:3000
```

Start frontend:

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 🚀 Deployment

## 🔹 Backend (Render)

Settings:

- **Root Directory:** `backend`
- **Build Command:**

```
npm install && npm run render-build
```

- **Start Command:**

```
npm start
```

Environment variables:

```
DATABASE_URL=<Your Neon DB URL>
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
```

---

## 🔹 Frontend (Netlify)

Settings:

- **Base Directory:** `frontend`
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`

Environment:

```
VITE_API_URL=https://store-rating-system-backend.onrender.com
```

---

## 🔹 Database (Neon)

- PostgreSQL
- SSL required
- Used by Prisma Client & Render backend

---

# 📝 Future Enhancements

- Store Images Upload
- Rating Comments
- Pagination & Filters
- Analytics Graphs
- Forgot Password / Reset
- Owner – Edit Store Info

---

# 🤝 Contributing

Pull requests are welcome.

---
