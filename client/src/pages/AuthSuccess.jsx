import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Auth Success Page - Handles redirect after successful Google OAuth
 */
const AuthSuccess = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // Refresh auth state to pick up the new cookie/token
        await checkAuth();
        toast.success('Welcome! You have successfully signed in.');
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Auth verification failed:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/', { replace: true });
      }
    };

    handleAuthSuccess();
  }, [checkAuth, navigate]);

  return (
    <div className="auth-success-page">
      <div className="auth-success-content">
        <div className="spinner"></div>
        <h2>Signing you in...</h2>
        <p>Please wait while we complete your authentication.</p>
      </div>
      <style>{`
        .auth-success-page {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .auth-success-content h2 {
          margin-top: 1.5rem;
          color: var(--color-text);
        }
        .auth-success-content p {
          color: var(--color-text-muted);
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default AuthSuccess;
