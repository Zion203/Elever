import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { 
  FiHome, FiPackage, FiShoppingBag, FiMenu, FiX, 
  FiDollarSign, FiUsers, FiTrendingUp, FiAlertTriangle, FiBox 
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, productAPI } from '../../services/api';
import './Admin.css';

/**
 * Admin Dashboard Layout and Home
 */
const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [inventoryStats, setInventoryStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (isAdmin()) {
      fetchStats();
    }
  }, []);

  const fetchStats = async () => {
    try {
      const [orderResponse, inventoryResponse] = await Promise.all([
        orderAPI.getStats(),
        productAPI.getInventoryStats()
      ]);
      setStats(orderResponse.data.data);
      setInventoryStats(inventoryResponse.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Wait for auth to load
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  // Redirect if not admin
  if (!user || !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  const isActive = (path) => location.pathname === path;
  const isHome = location.pathname === '/admin';

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/admin" className="admin-logo">
            <img src="/logo.png" alt="Elever Admin" />
            <span>Admin</span>
          </Link>
          <button 
            className="sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="/admin" 
            className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiHome size={18} />
            Dashboard
          </Link>
          <Link 
            to="/admin/orders" 
            className={`nav-item ${isActive('/admin/orders') ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiPackage size={18} />
            Orders
          </Link>
          <Link 
            to="/admin/products" 
            className={`nav-item ${isActive('/admin/products') ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiShoppingBag size={18} />
            Products
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="back-to-store">
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FiMenu size={20} />
          </button>
          <div className="admin-user">
            <span>Welcome, {user.name}</span>
            {user.avatar && <img src={user.avatar} alt={user.name} />}
          </div>
        </header>

        <div className="admin-content">
          {isHome ? (
            // Dashboard Home
            <div className="dashboard-home">
              <h1>Dashboard</h1>
              
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon revenue">
                    <FiDollarSign size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">
                      ${statsLoading ? '...' : (stats?.totalRevenue || 0).toFixed(2)}
                    </span>
                    <span className="stat-label">Total Revenue</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon orders">
                    <FiPackage size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">
                      {statsLoading ? '...' : stats?.totalOrders || 0}
                    </span>
                    <span className="stat-label">Total Orders</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon pending">
                    <FiTrendingUp size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">
                      {statsLoading ? '...' : 
                        stats?.statusBreakdown?.find(s => s._id === 'pending')?.count || 0}
                    </span>
                    <span className="stat-label">Pending Orders</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon customers">
                    <FiUsers size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">
                      {statsLoading ? '...' : 
                        stats?.statusBreakdown?.find(s => s._id === 'delivered')?.count || 0}
                    </span>
                    <span className="stat-label">Delivered</span>
                  </div>
                </div>
              </div>

              {/* Inventory Stats */}
              <div className="stats-grid inventory-stats">
                <div className="stat-card">
                  <div className="stat-icon inventory">
                    <FiShoppingBag size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">
                      {statsLoading ? '...' : inventoryStats?.totalProducts || 0}
                    </span>
                    <span className="stat-label">Total Products</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon stock">
                    <FiBox size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">
                      {statsLoading ? '...' : inventoryStats?.totalStock || 0}
                    </span>
                    <span className="stat-label">Total Stock</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon out-of-stock">
                    <FiAlertTriangle size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">
                      {statsLoading ? '...' : inventoryStats?.outOfStock || 0}
                    </span>
                    <span className="stat-label">Out of Stock</span>
                  </div>
                </div>
              </div>

              {/* Low Stock Alert */}
              {!statsLoading && inventoryStats?.lowStockProducts?.length > 0 && (
                <div className="low-stock-alert">
                  <h2>
                    <FiAlertTriangle size={20} />
                    Low Stock Alert
                  </h2>
                  <div className="low-stock-list">
                    {inventoryStats.lowStockProducts.map((product) => (
                      <div key={product._id} className="low-stock-item">
                        <div className="low-stock-product">
                          <img 
                            src={product.images?.[0] || '/images/placeholder.jpg'} 
                            alt={product.name} 
                          />
                          <div className="low-stock-info">
                            <span className="product-name">{product.name}</span>
                            <span className="product-category">{product.category}</span>
                          </div>
                        </div>
                        <span className={`stock-count ${product.stock <= 2 ? 'critical' : 'warning'}`}>
                          {product.stock} left
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link to="/admin/products" className="view-all-link">
                    Manage Inventory →
                  </Link>
                </div>
              )}

              {/* Quick Actions */}
              <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                  <Link to="/admin/orders" className="action-card">
                    <FiPackage size={24} />
                    <span>View Orders</span>
                  </Link>
                  <Link to="/admin/products" className="action-card">
                    <FiShoppingBag size={24} />
                    <span>Manage Products</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

