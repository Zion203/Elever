import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from 'passport';

// Load environment variables
dotenv.config();

// Import configuration
import connectDB from './config/db.js';
import configurePassport from './config/passport.js';

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Configure Passport
configurePassport();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// API Routes
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Elever API is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║                                           ║
  ║     🌟 ELEVER E-Commerce API Server 🌟    ║
  ║                                           ║
  ║     Running on: http://localhost:${PORT}     ║
  ║     Environment: ${process.env.NODE_ENV || 'development'}            ║
  ║                                           ║
  ╚═══════════════════════════════════════════╝
  `);
});

export default app;
