import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiClock, FiCheck, FiTruck } from 'react-icons/fi';
import { orderAPI } from '../services/api';
import './Orders.css';

/**
 * User orders page
 */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock />;
      case 'confirmed': return <FiCheck />;
      case 'shipped': return <FiTruck />;
      case 'delivered': return <FiCheck />;
      default: return <FiPackage />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'confirmed': return 'badge-info';
      case 'shipped': return 'badge-info';
      case 'delivered': return 'badge-success';
      case 'cancelled': return 'badge-error';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <FiPackage size={64} />
            <h2>No orders yet</h2>
            <p>When you place an order, it will appear here.</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-id">Order #{order._id.slice(-8)}</span>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <span className={`badge ${getStatusClass(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
                
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="order-item-image">
                        <img 
                          src={item.image || '/images/placeholder.jpg'} 
                          alt={item.name} 
                        />
                      </div>
                      <div className="order-item-details">
                        <span className="item-name">{item.name}</span>
                        <span className="item-meta">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="total-amount">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
