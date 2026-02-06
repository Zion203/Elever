# Elever - Elegant E-Commerce Platform

A modern, elegant e-commerce web application for selling earrings, clips, and fashion accessories.

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: Google OAuth 2.0

## Features

- 🛍️ Beautiful product browsing with filters & sorting
- 🛒 Shopping cart with persistent storage
- 👤 Google OAuth authentication
- 📦 Order management & tracking
- 👑 Admin dashboard for product & order management

## Project Structure

```
elever/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context providers
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── styles/        # Global CSS
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/            # Database & auth config
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Auth middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── utils/             # Helper functions
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Google Developer Console project

### 1. Clone & Install

```bash
# Install server dependencies
cd elever/server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Create `.env` files from the examples:

**Server** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elever
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLIENT_URL=http://localhost:5173
SESSION_SECRET=your-session-secret
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000
```

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy Client ID and Secret to your `.env`

### 4. Seed Sample Data (Optional)

```bash
cd server
node utils/seedData.js
```

### 5. Run the Application

```bash
# Start backend (from server/)
npm run dev

# Start frontend (from client/)
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Auth
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout user

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders/my` - Get user's orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

## Admin Access

To access the admin dashboard at `/admin`:
1. Sign in with Google
2. Use the seed script which creates an admin user, OR
3. Manually update a user's role to "admin" in MongoDB

## Design

- **Color Palette**: Soft neutrals with champagne gold (#D4AF37) accents
- **Typography**: Playfair Display (headings) + Inter (body)
- **Style**: Elegant, minimal, and modern

---

Built with ❤️ for Elever
