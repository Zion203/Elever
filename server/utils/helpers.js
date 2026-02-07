import jwt from 'jsonwebtoken';

/**
 * Generate JWT Token
 * @param {string} id - User ID
 * @returns {string} JWT Token
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * Set token cookie
 * @param {object} res - Express response object
 * @param {string} token - JWT token
 */
export const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction, // Must be true for sameSite: 'none'
    sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-site, 'lax' for localhost
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

/**
 * Clear token cookie
 * @param {object} res - Express response object
 */
export const clearTokenCookie = (res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
};

/**
 * Format price for display
 * @param {number} price - Price in cents or base currency
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

/**
 * Paginate results
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} Skip and limit values
 */
export const paginate = (page = 1, limit = 12) => {
  const skip = (page - 1) * limit;
  return { skip, limit: parseInt(limit) };
};
