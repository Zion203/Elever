import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiMinus, FiPlus, FiChevronLeft, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { productAPI } from '../services/api';
import toast from 'react-hot-toast';
import './ProductDetail.css';

/**
 * Individual product detail page
 */
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getById(id);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} × ${product.name} added to cart`);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length > 0 
    ? product.images 
    : ['/images/placeholder.jpg'];

  return (
    <div className="product-detail">
      <div className="container">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiChevronLeft size={20} />
          Back to Shop
        </button>

        <div className="product-detail-grid">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="gallery-main">
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                className="gallery-main-image"
              />
            </div>
            {images.length > 1 && (
              <div className="gallery-thumbnails">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <span className="product-category">{product.category}</span>
            <h1 className="product-title">{product.name}</h1>
            
            {product.ratings && product.ratings.count > 0 && (
              <div className="product-rating">
                <span className="rating-stars">
                  {'★'.repeat(Math.round(product.ratings.average))}
                  {'☆'.repeat(5 - Math.round(product.ratings.average))}
                </span>
                <span className="rating-text">
                  {product.ratings.average.toFixed(1)} ({product.ratings.count} reviews)
                </span>
              </div>
            )}

            <div className="product-price-row">
              <span className="product-price">${product.price.toFixed(2)}</span>
              <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? (
                  <>
                    <FiCheck size={14} />
                    In Stock ({product.stock} available)
                  </>
                ) : (
                  'Out of Stock'
                )}
              </span>
            </div>

            <div className="divider"></div>

            <p className="product-description">{product.description}</p>

            {/* Quantity Selector */}
            <div className="quantity-section">
              <label className="quantity-label">Quantity</label>
              <div className="quantity-control">
                <button 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={16} />
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="product-actions">
              <button 
                className="btn btn-primary btn-lg add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <FiShoppingBag size={20} />
                Add to Cart
              </button>
              <button className="btn btn-outline btn-lg wishlist-btn">
                <FiHeart size={20} />
              </button>
            </div>

            {/* Features */}
            <div className="product-features">
              <div className="feature">
                <span className="feature-icon">✦</span>
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✦</span>
                <span>30-day returns policy</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✦</span>
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
