import axios from 'axios';

/**
 * Axios instance configured for Elever API
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - could redirect to login
      console.log('Unauthorized - please login');
    }
    return Promise.reject(error);
  }
);

export default api;

/**
 * Product API functions
 */
export const productAPI = {
  getAll: (params) => api.get('/api/products', { params }),
  getById: (id) => api.get(`/api/products/${id}`),
  getFeatured: () => api.get('/api/products/featured'),
  getByCategory: (category) => api.get(`/api/products/category/${category}`),
  getInventoryStats: () => api.get('/api/products/admin/stats'),
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`),
};

/**
 * Order API functions
 */
export const orderAPI = {
  create: (data) => api.post('/api/orders', data),
  getMyOrders: () => api.get('/api/orders'),
  getById: (id) => api.get(`/api/orders/${id}`),
  getAllOrders: (params) => api.get('/api/orders/admin/all', { params }),
  getStats: () => api.get('/api/orders/admin/stats'),
  updateStatus: (id, status) => api.put(`/api/orders/${id}/status`, { status }),
};

/**
 * Auth API functions
 */
export const authAPI = {
  getStatus: () => api.get('/auth/status'),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.get('/auth/logout'),
};
