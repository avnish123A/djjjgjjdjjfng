// API Configuration
// Point this to your Express.js backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    // Auth
    login: '/admin/login',
    logout: '/admin/logout',
    
    // Dashboard
    dashboard: '/admin/dashboard/stats',
    
    // Products
    products: '/admin/products',
    addProduct: '/admin/products/add',
    editProduct: (id: string) => `/admin/products/edit/${id}`,
    deleteProduct: (id: string) => `/admin/products/delete/${id}`,
    updateStock: (id: string) => `/admin/products/stock/${id}`,
    
    // Orders
    orders: '/admin/orders',
    orderDetail: (id: string) => `/admin/orders/${id}`,
    updateOrderStatus: (id: string) => `/admin/orders/update-status/${id}`,
    addTracking: (id: string) => `/admin/orders/tracking/${id}`,
    markPaid: (id: string) => `/admin/orders/mark-paid/${id}`,
    
    // Customers
    customers: '/admin/customers',
    customerDetail: (id: string) => `/admin/customers/${id}`,
    
    // Categories
    categories: '/admin/categories',
    addCategory: '/admin/categories/add',
    editCategory: (id: string) => `/admin/categories/edit/${id}`,
    deleteCategory: (id: string) => `/admin/categories/delete/${id}`,
    
    // Coupons
    coupons: '/admin/coupons',
    addCoupon: '/admin/coupons/add',
    editCoupon: (id: string) => `/admin/coupons/edit/${id}`,
    deleteCoupon: (id: string) => `/admin/coupons/delete/${id}`,
    
    // Payments
    createPaymentOrder: '/api/payment/create-order',
    verifyPayment: '/api/payment/verify',
  },
};

// Helper for making API calls (uses cookies for session auth)
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${apiConfig.baseUrl}${endpoint}`;
  
  const response = await fetch(url, {
    credentials: 'include', // Send session cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 401) {
    // Session expired, redirect to login
    window.location.href = '/admin/login';
    throw new Error('Session expired');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Helper for FormData uploads (product images, etc.)
export async function apiUpload<T = any>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const url = `${apiConfig.baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: formData,
    // Don't set Content-Type - browser sets it with boundary for FormData
  });

  if (response.status === 401) {
    window.location.href = '/admin/login';
    throw new Error('Session expired');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}
