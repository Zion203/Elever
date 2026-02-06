import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch, FiGrid, FiHome, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

/**
 * Elegant navigation bar component
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isAuthenticated, login, logout, isAdmin } = useAuth();
  const { getItemCount, toggleCart } = useCart();
  const navigate = useNavigate();

  const itemCount = getItemCount();

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => document.body.classList.remove('menu-open');
  }, [isMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setIsSearchOpen(false);
    }
  };

  // Mobile Menu Component - Rendered via Portal
  const MobileMenu = () => {
    if (typeof document === 'undefined') return null;
    
    return createPortal(
      <>
        {/* Overlay */}
        <div 
          className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Sidebar */}
        <aside className={`mobile-menu-sidebar ${isMenuOpen ? 'active' : ''}`}>
          {/* Header */}
          <div className="mobile-menu-header">
            <Link to="/" className="mobile-menu-logo" onClick={() => setIsMenuOpen(false)}>
              <img src="/logo.png" alt="Elever" />
              <span>MENU</span>
            </Link>
            <button 
              className="mobile-menu-close"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mobile-menu-nav">
            <Link to="/" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
              <FiHome size={18} />
              <span>Home</span>
            </Link>
            <Link to="/products" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
              <FiShoppingBag size={18} />
              <span>Shop All</span>
            </Link>
            <Link to="/products?category=earrings" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
              <span className="menu-icon-space" />
              <span>Earrings</span>
            </Link>
            <Link to="/products?category=necklaces" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
              <span className="menu-icon-space" />
              <span>Necklaces</span>
            </Link>
            <Link to="/products?category=bracelets" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
              <span className="menu-icon-space" />
              <span>Bracelets</span>
            </Link>
            {isAuthenticated && (
              <Link to="/orders" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
                <FiUser size={18} />
                <span>My Orders</span>
              </Link>
            )}
          </nav>

          {/* Footer */}
          <div className="mobile-menu-footer">
            <Link to="/" className="mobile-menu-back" onClick={() => setIsMenuOpen(false)}>
              <FiArrowLeft size={16} />
              <span>Back to Store</span>
            </Link>
          </div>
        </aside>
      </>,
      document.body
    );
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-container container">
          {/* Mobile Menu Toggle */}
          <button 
            className="navbar-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <FiMenu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <img src="/logo.png" alt="Elever" className="navbar-logo-img" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="navbar-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Shop All</Link>
            <Link to="/products?category=earrings" className="nav-link">Earrings</Link>
            <Link to="/products?category=necklaces" className="nav-link">Necklaces</Link>
            <Link to="/products?category=bracelets" className="nav-link">Bracelets</Link>
          </nav>

          {/* Actions */}
          <div className="navbar-actions">
            {/* Search */}
            <button 
              className="navbar-action-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>

            {/* User Menu */}
            <div className="navbar-user">
              {isAuthenticated ? (
                <div className="user-dropdown">
                  <button className="navbar-action-btn user-trigger">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="user-avatar" referrerPolicy="no-referrer" />
                    ) : (
                      <FiUser size={20} />
                    )}
                  </button>
                  <div className="user-dropdown-menu">
                    <div className="user-info">
                      <span className="user-name">{user?.name}</span>
                      <span className="user-email">{user?.email}</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/orders" className="dropdown-item">My Orders</Link>
                    {isAdmin() && (
                      <Link to="/admin" className="dropdown-item">Admin Dashboard</Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button onClick={logout} className="dropdown-item logout-btn">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={login} className="navbar-action-btn" aria-label="Login">
                  <FiUser size={20} />
                </button>
              )}
            </div>

            {/* Admin Dashboard */}
            {isAdmin() && (
              <Link 
                to="/admin" 
                className="navbar-action-btn"
                aria-label="Admin Dashboard"
                title="Admin Dashboard"
              >
                <FiGrid size={20} />
              </Link>
            )}

            {/* Cart */}
            <button 
              className="navbar-action-btn cart-btn"
              onClick={toggleCart}
              aria-label="Cart"
            >
              <FiShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar (expandable) */}
        {isSearchOpen && (
          <div className="navbar-search">
            <form onSubmit={handleSearch} className="search-form container">
              <input
                type="text"
                name="search"
                placeholder="Search for jewelry..."
                className="search-input"
                autoFocus
              />
              <button type="submit" className="search-submit">
                <FiSearch size={20} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Menu - Rendered via Portal */}
      <MobileMenu />
    </>
  );
};

export default Navbar;

