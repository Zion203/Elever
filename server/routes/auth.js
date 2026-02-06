import express from 'express';
import {
  googleAuth,
  googleCallback,
  getCurrentUser,
  logout,
  checkAuthStatus,
} from '../controllers/authController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// User routes
router.get('/me', protect, getCurrentUser);
router.get('/logout', protect, logout);
router.get('/status', optionalAuth, checkAuthStatus);

export default router;
