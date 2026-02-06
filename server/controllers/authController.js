import passport from 'passport';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utils/helpers.js';

/**
 * @desc    Initiate Google OAuth
 * @route   GET /auth/google
 * @access  Public
 */
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

/**
 * @desc    Google OAuth callback
 * @route   GET /auth/google/callback
 * @access  Public
 */
export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }

    // Generate JWT token
    const token = generateToken(user._id);
    
    // Set cookie
    setTokenCookie(res, token);

    // Redirect to frontend
    res.redirect(`${process.env.CLIENT_URL}`);
  })(req, res, next);
};

/**
 * @desc    Get current logged-in user
 * @route   GET /auth/me
 * @access  Private
 */
export const getCurrentUser = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

/**
 * @desc    Logout user
 * @route   GET /auth/logout
 * @access  Private
 */
export const logout = (req, res) => {
  clearTokenCookie(res);
  
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

/**
 * @desc    Check authentication status
 * @route   GET /auth/status
 * @access  Public
 */
export const checkAuthStatus = (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      isAuthenticated: true,
      data: req.user,
    });
  } else {
    res.status(200).json({
      success: true,
      isAuthenticated: false,
      data: null,
    });
  }
};
