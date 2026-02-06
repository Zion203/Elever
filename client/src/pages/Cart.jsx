import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

/**
 * Full cart page with quantity management
 */
const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, login } = useAuth();

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty-state">
            <FiShoppingBag size={64} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section">
            <div className="cart-items-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span></span>
            </div>

            {cartItems.map((item) => (
              <div key={item._id} className="cart-item-row">
                <div className="cart-item-product">
                  <div className="item-image">
                    <img 
                      src={item.images?.[0] || '/images/placeholder.jpg'} 
                      alt={item.name} 
                    />
                  </div>
                  <div className="item-details">
                    <Link to={`/products/${item._id}`} className="item-name">
                      {item.name}
                    </Link>
                    <span className="item-category">{item.category}</span>
                  </div>
                </div>
                <div className="cart-item-price">
                  ${item.price.toFixed(2)}
                </div>
                <div className="cart-item-quantity">
                  <div className="quantity-control">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>
                <div className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item._id)}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <div className="shipping-note">
                Add ${(50 - subtotal).toFixed(2)} more for free shipping
              </div>
            )}
            <div className="summary-divider"></div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            {isAuthenticated ? (
              <Link to="/checkout" className="btn btn-primary btn-lg checkout-btn">
                Proceed to Checkout
                <FiArrowRight />
              </Link>
            ) : (
              <button onClick={login} className="btn btn-primary btn-lg checkout-btn">
                Sign in to Checkout
              </button>
            )}
            
            <Link to="/products" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
