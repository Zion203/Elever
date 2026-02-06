import { useState, useEffect } from 'react';
import { FiSearch, FiEye } from 'react-icons/fi';
import CustomSelect from '../../components/common/CustomSelect';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './AdminOrders.css';

/**
 * Admin orders management page
 */
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { limit: 20 };
      if (statusFilter) params.status = statusFilter;
      
      const response = await orderAPI.getAllOrders(params);
      setOrders(response.data.data || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="admin-orders">
      <div className="admin-page-header">
        <h1>Orders</h1>
        <div className="header-actions">
        <div className="header-actions">
          <CustomSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Status' },
              ...statusOptions.map(s => ({
                value: s,
                label: s.charAt(0).toUpperCase() + s.slice(1)
              }))
            ]}
            placeholder="All Status"
            className="status-filter-select"
          />
        </div>
        </div>
      </div>

      <div className="orders-table-container">
        {loading ? (
          <div className="table-loading">
            <div className="spinner"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="table-empty">
            <p>No orders found</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="order-id">#{order._id.slice(-8)}</td>
                  <td>
                    <div className="customer-info">
                      <span className="customer-name">{order.user?.name || 'N/A'}</span>
                      <span className="customer-email">{order.user?.email || ''}</span>
                    </div>
                  </td>
                  <td>{order.items?.length || 0} items</td>
                  <td className="order-total">${order.totalAmount.toFixed(2)}</td>
                  <td>
                  <td>
                    <CustomSelect
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      options={statusOptions.map(s => ({
                        value: s,
                        label: s.charAt(0).toUpperCase() + s.slice(1)
                      }))}
                      getOptionClass={(val) => `status-${val}`}
                      className="status-select-wrapper"
                    />
                  </td>
                  </td>
                  <td className="order-date">{formatDate(order.createdAt)}</td>
                  <td>
                    <button 
                      className="action-btn"
                      onClick={() => setSelectedOrder(order)}
                      title="View Details"
                    >
                      <FiEye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="order-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order #{selectedOrder._id.slice(-8)}</h2>
              <button onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="order-section">
                <h3>Customer</h3>
                <p>{selectedOrder.user?.name}</p>
                <p>{selectedOrder.user?.email}</p>
              </div>
              <div className="order-section">
                <h3>Shipping Address</h3>
                <p>{selectedOrder.shippingAddress?.fullName}</p>
                <p>{selectedOrder.shippingAddress?.address}</p>
                <p>
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}
                </p>
                <p>{selectedOrder.shippingAddress?.country}</p>
                <p>Phone: {selectedOrder.shippingAddress?.phone}</p>
              </div>
              <div className="order-section">
                <h3>Items</h3>
                <div className="order-items-list">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="order-item-row">
                      <span>{item.name}</span>
                      <span>×{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total-row">
                  <strong>Total:</strong>
                  <strong>${selectedOrder.totalAmount.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
