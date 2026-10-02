# 🛡️ Event Force Management System

A production-ready, full-stack Event Force & Staffing Operations Web Application built specifically for streamlined cloud deployment: **Vercel** (Frontend) + **Render** (Backend REST API) + **MongoDB Atlas** (Managed Cloud Database) + **Cloudinary** (Media Storage).

---

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                            User                             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│           React.js + Vite + Tailwind CSS Frontend           │
│                    (Deployed on Vercel)                     │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / REST API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Node.js + Express REST API Backend              │
│                     (Deployed on Render)                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
┌──────────────────────────────┐ ┌──────────────────────────┐
│  MongoDB Atlas Cloud DB      │ │  Cloudinary Media Server │
│  (Managed Mongo Cluster)     │ │  (Event & Avatar Uploads)│
└──────────────────────────────┘ └──────────────────────────┘
```

---

## 🚀 Key System Features

1. **Role-Based Access Control (RBAC)**:
   - 👑 **Admin**: Executive metrics dashboard, department breakdown, user role management, complete force catalog.
   - 🎯 **Event Manager**: Event creation wizard, staffing quota progress tracking, force assignment & schedule conflict prevention.
   - 🛡️ **Staff / Force Member**: Assigned shift roster, event venue locations, shift confirmation/decline actions.
2. **Schedule Conflict & Double-Booking Prevention**:
   - Automatically prevents assigning the same force member to overlapping event schedules.
3. **Capacity & Headcount Tracking**:
   - Live quota progress bars tracking Required vs Assigned force headcounts.
4. **Cloud Media Management**:
   - Seamless image upload integration using Cloudinary with memory buffer fallbacks.
5. **Real-time Notifications**:
   - In-app notification alerts for new assignments and operational updates.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios, Recharts, Lucide Icons, Context API.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose ODM, JWT Authentication, bcryptjs, Helmet, Express Rate Limiting, Multer, Cloudinary.
- **Cloud Infrastructure**: MongoDB Atlas, Vercel, Render.

---

## ⚡ Quick Local Development Setup

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/event-force-management-system.git
cd "Event Force Management System"

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend Environment File (`backend/.env`)**:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/event_force_db?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_event_force_2026
CLIENT_URL=http://localhost:5173
```

**Frontend Environment File (`frontend/.env`)**:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Demo Data

Run the seed script to populate demo users, events, and force assignments:

```bash
cd backend
npm run seed
```

#### Demo Credentials:
- **Admin**: `admin@eventforce.com` / `password123`
- **Event Manager**: `manager@eventforce.com` / `password123`
- **Staff Member**: `john.security@eventforce.com` / `password123`

### 4. Run Locally

```bash
# Run Backend API Server (Port 5000)
cd backend
npm run dev

# Run Frontend Web App (Port 5173) in another terminal
cd frontend
npm run dev
```

---

## 🌐 Production Deployment Guide

### Step 1: Set Up Managed Database on MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and record the username & password.
3. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere for cloud deployment).
4. Copy your Connection String (`MONGODB_URI`).

---

### Step 2: Deploy Backend REST API on Render
1. Sign in to [Render](https://render.com) and click **New + -> Web Service**.
2. Connect your GitHub repository.
3. Set the following build and start settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add Environment Variables under **Environment**:
   - `PORT` = `5000` *(Render sets process.env.PORT automatically)*
   - `MONGODB_URI` = `your_mongodb_atlas_connection_string`
   - `JWT_SECRET` = `your_production_secret_key`
   - `CLIENT_URL` = `https://your-frontend-app.vercel.app`
5. Click **Create Web Service** and copy your backend URL (e.g., `https://event-force-api.onrender.com`).

---

### Step 3: Deploy Frontend Web App on Vercel
1. Sign in to [Vercel](https://vercel.com) and click **Add New -> Project**.
2. Select your repository.
3. Set Framework Preset to **Vite**.
4. Set **Root Directory** to `frontend`.
5. Add Environment Variable:
   - `VITE_API_URL` = `https://event-force-api.onrender.com/api`
6. Click **Deploy**.

---

## 📡 REST API Routes Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & get JWT token |
| `GET` | `/api/auth/me` | Private | Get current user profile |
| `GET` | `/api/events` | Private | List all events with filters & capacity |
| `POST` | `/api/events` | Manager/Admin | Create new event operation |
| `GET` | `/api/events/:id` | Private | Get event details & assigned staff roster |
| `GET` | `/api/force-members` | Manager/Admin | List staff directory & availability |
| `POST` | `/api/assignments` | Manager/Admin | Assign staff to event (with conflict check) |
| `GET` | `/api/dashboard/admin` | Admin | Executive stats & department chart data |
| `GET` | `/api/dashboard/manager` | Manager | Staffing progress & managed events |
| `GET` | `/api/dashboard/staff` | Staff | My assigned shifts & duty schedule |
