import Product from '../models/Product.js';
import { paginate } from '../utils/helpers.js';

/**
 * @desc    Get all products with filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort, search, featured, page = 1, limit = 12 } = req.query;

    // Build query
    const query = {};

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'popular') sortOption = { 'ratings.count': -1 };

    // Pagination
    const { skip, limit: limitNum } = paginate(page, limit);

    // Execute query
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid product data',
      error: error.message,
    });
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Update failed',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:category
 * @access  Public
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Get inventory statistics (Admin)
 * @route   GET /api/products/admin/stats
 * @access  Private/Admin
 */
export const getInventoryStats = async (req, res) => {
  try {
    // Get total products count
    const totalProducts = await Product.countDocuments();

    // Get total stock across all products
    const stockAggregation = await Product.aggregate([
      { $group: { _id: null, totalStock: { $sum: '$stock' } } }
    ]);
    const totalStock = stockAggregation[0]?.totalStock || 0;

    // Get out of stock count
    const outOfStock = await Product.countDocuments({ stock: 0 });

    // Get low stock products (stock <= 5 but > 0)
    const lowStockProducts = await Product.find({ stock: { $gt: 0, $lte: 5 } })
      .select('name stock images category')
      .sort({ stock: 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalStock,
        outOfStock,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
