import mongoose from 'mongoose';

/**
 * Product Schema
 * Stores product information for earrings, clips, and accessories
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['earrings', 'clips', 'necklaces', 'bracelets', 'accessories'],
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
