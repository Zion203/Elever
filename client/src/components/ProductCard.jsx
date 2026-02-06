import { Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

/**
 * Elegant product card component
 */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { _id, name, price, images, category, ratings, featured } = product;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${name} added to cart`);
  };

  // Default image if none provided
  const imageUrl = images?.[0] || '/images/placeholder.jpg';

  return (
    <Link to={`/products/${_id}`} className="product-card">
      {/* Image Container */}
      <div className="product-card-image">
        <img src={imageUrl} alt={name} loading="lazy" />
        
        {/* Badges */}
        <div className="product-card-badges">
          {featured && <span className="badge badge-gold">Featured</span>}
        </div>

        {/* Hover Actions */}
        <div className="product-card-actions">
          <button 
            className="action-btn wishlist-btn"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            aria-label="Add to wishlist"
          >
            <FiHeart size={18} />
          </button>
          <button 
            className="action-btn add-to-cart-btn"
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <FiShoppingBag size={18} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="product-card-info">
        <span className="product-card-category">{category}</span>
        <h3 className="product-card-name">{name}</h3>
        <div className="product-card-footer">
          <span className="product-card-price">${price.toFixed(2)}</span>
          {ratings && ratings.count > 0 && (
            <span className="product-card-rating">
              ★ {ratings.average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
