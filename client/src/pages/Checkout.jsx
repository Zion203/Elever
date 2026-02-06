import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiLock } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';
import './Checkout.css';

/**
 * Checkout page with shipping form
 */
const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: formData,
        paymentMethod: 'COD',
      };

      await orderAPI.create(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Order failed:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-layout">
          {/* Shipping Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              <h2>Shipping Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row form-row-2">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row form-row-2">
                <div className="form-group">
                  <label className="form-label">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="payment-section">
                <h3>Payment Method</h3>
                <div className="payment-option active">
                  <FiCheck size={18} />
                  <span>Cash on Delivery (COD)</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg place-order-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  <>
                    <FiLock size={18} />
                    Place Order - ${total.toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item._id} className="summary-item">
                  <div className="summary-item-image">
                    <img 
                      src={item.images?.[0] || '/images/placeholder.jpg'} 
                      alt={item.name} 
                    />
                    <span className="item-quantity">{item.quantity}</span>
                  </div>
                  <div className="summary-item-details">
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
