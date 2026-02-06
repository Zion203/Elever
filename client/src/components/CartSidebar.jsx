import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartSidebar.css';

/**
 * Slide-out cart sidebar
 */
const CartSidebar = () => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal 
  } = useCart();
  const { isAuthenticated, login } = useAuth();

  const total = getCartTotal();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="cart-backdrop" onClick={() => setIsCartOpen(false)} />

      {/* Sidebar */}
      <aside className="cart-sidebar">
        {/* Header */}
        <div className="cart-header">
          <div className="cart-title">
            <FiShoppingBag size={20} />
            <h3>Your Cart</h3>
            <span className="cart-count">({cartItems.length})</span>
          </div>
          <button 
            className="cart-close"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <FiShoppingBag size={48} />
            <p>Your cart is empty</p>
            <Link 
              to="/products" 
              className="btn btn-primary"
              onClick={() => setIsCartOpen(false)}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="cart-item-image">
                    <img 
                      src={item.images?.[0] || '/images/placeholder.jpg'} 
                      alt={item.name} 
                    />
                  </div>
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                    <div className="cart-item-quantity">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>
                  <button 
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item._id)}
                    aria-label="Remove item"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="cart-footer">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <span className="subtotal-amount">${total.toFixed(2)}</span>
              </div>
              <p className="cart-shipping-note">
                Shipping & taxes calculated at checkout
              </p>
              {isAuthenticated ? (
                <Link 
                  to="/checkout" 
                  className="btn btn-primary btn-lg cart-checkout-btn"
                  onClick={() => setIsCartOpen(false)}
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <button 
                  className="btn btn-primary btn-lg cart-checkout-btn"
                  onClick={login}
                >
                  Sign in to Checkout
                </button>
              )}
              <Link 
                to="/cart" 
                className="cart-view-link"
                onClick={() => setIsCartOpen(false)}
              >
                View Full Cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;
