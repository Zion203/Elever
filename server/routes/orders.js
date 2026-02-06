import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// User routes (protected)
router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.get('/admin/stats', protect, adminOnly, getOrderStats);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
