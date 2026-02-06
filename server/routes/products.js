import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory,
  getInventoryStats,
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

// Admin routes
router.get('/admin/stats', protect, adminOnly, getInventoryStats);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;

