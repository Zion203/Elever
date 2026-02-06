import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import ScrollToTop from './components/ScrollToTop';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AuthSuccess from './pages/AuthSuccess';

// Protected Pages
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminProducts from './pages/admin/Products';

// Import global styles
import './styles/index.css';

/**
 * Protected Route wrapper - requires authentication
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

/**
 * Main App Component with routing
 */
function App() {
  return (
    <>
      <Routes>
        {/* Admin Routes - No Navbar/Footer */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        {/* Public & Protected Routes - With Navbar/Footer */}
        <Route
          path="*"
          element={
            <div className="app-wrapper">
              <ScrollToTop />
              <Navbar />
              <CartSidebar />
              <main className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/auth/success" element={<AuthSuccess />} />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/checkout" 
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/orders" 
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Catch-all redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
