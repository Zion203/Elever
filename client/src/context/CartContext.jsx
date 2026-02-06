import { createContext, useContext, useState, useEffect } from 'react';

/**
 * Cart Context
 * Manages shopping cart state with localStorage persistence
 */
const CartContext = createContext(null);

const CART_STORAGE_KEY = 'elever_cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * Add item to cart
   */
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity }];
    });
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  /**
   * Update item quantity
   */
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  /**
   * Clear entire cart
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * Get cart total
   */
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  /**
   * Get total number of items
   */
  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  /**
   * Toggle cart sidebar
   */
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const value = {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
    toggleCart,
    setIsCartOpen,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Custom hook to use cart context
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
