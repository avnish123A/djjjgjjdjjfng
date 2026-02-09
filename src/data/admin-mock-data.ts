// Mock data for admin panel UI preview
// Replace with real API calls to your Express backend

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    productId: string;
    title: string;
    image: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'placed' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  courierName?: string;
  orderDate: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  image: string;
  productsCount: number;
  isActive: boolean;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discount: number;
  minOrder: number;
  expiryDate: string;
  usedCount: number;
  isActive: boolean;
}

export const mockOrders: AdminOrder[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@example.com',
    customerPhone: '+91 98765 43210',
    items: [
      { productId: '1', title: 'Classic Leather Chronograph', image: '', quantity: 1, price: 189, size: undefined, color: '#8B6914' },
      { productId: '5', title: 'Radiance Face Serum', image: '', quantity: 2, price: 45 },
    ],
    subtotal: 279,
    shipping: 0,
    discount: 20,
    total: 259,
    shippingAddress: { street: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    trackingNumber: 'TRACK123456',
    courierName: 'BlueDart',
    orderDate: '2024-12-15T10:30:00Z',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Priya Patel',
    customerEmail: 'priya@example.com',
    customerPhone: '+91 87654 32109',
    items: [
      { productId: '9', title: 'Pro Wireless Headphones', image: '', quantity: 1, price: 299 },
    ],
    subtotal: 299,
    shipping: 0,
    discount: 0,
    total: 299,
    shippingAddress: { street: '45 Park Street', city: 'Kolkata', state: 'West Bengal', pincode: '700016' },
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'confirmed',
    orderDate: '2024-12-16T14:20:00Z',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Amit Kumar',
    customerEmail: 'amit@example.com',
    customerPhone: '+91 76543 21098',
    items: [
      { productId: '4', title: 'Air Runner Sneakers', image: '', quantity: 1, price: 129, size: '10' },
      { productId: '6', title: 'Artisan Soy Candle', image: '', quantity: 3, price: 34 },
    ],
    subtotal: 231,
    shipping: 0,
    discount: 15,
    total: 216,
    shippingAddress: { street: '78 Connaught Place', city: 'New Delhi', state: 'Delhi', pincode: '110001' },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    orderDate: '2024-12-10T09:15:00Z',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customerName: 'Sneha Reddy',
    customerEmail: 'sneha@example.com',
    customerPhone: '+91 65432 10987',
    items: [
      { productId: '3', title: 'Leather Crossbody Bag', image: '', quantity: 1, price: 159 },
    ],
    subtotal: 159,
    shipping: 0,
    discount: 0,
    total: 159,
    shippingAddress: { street: '12 Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033' },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    orderStatus: 'placed',
    orderDate: '2024-12-17T16:45:00Z',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customerName: 'Vikram Singh',
    customerEmail: 'vikram@example.com',
    customerPhone: '+91 54321 09876',
    items: [
      { productId: '7', title: 'Minimalist Smart Watch', image: '', quantity: 1, price: 249 },
      { productId: '11', title: 'Vitamin C Moisturizer', image: '', quantity: 1, price: 38 },
    ],
    subtotal: 287,
    shipping: 0,
    discount: 0,
    total: 287,
    shippingAddress: { street: '56 Brigade Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'packed',
    orderDate: '2024-12-17T08:00:00Z',
  },
];

export const mockCustomers: AdminCustomer[] = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', totalOrders: 5, totalSpent: 1250, createdAt: '2024-06-15' },
  { id: '2', name: 'Priya Patel', email: 'priya@example.com', phone: '+91 87654 32109', totalOrders: 3, totalSpent: 890, createdAt: '2024-07-20' },
  { id: '3', name: 'Amit Kumar', email: 'amit@example.com', phone: '+91 76543 21098', totalOrders: 8, totalSpent: 2340, createdAt: '2024-03-10' },
  { id: '4', name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91 65432 10987', totalOrders: 2, totalSpent: 459, createdAt: '2024-09-05' },
  { id: '5', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 54321 09876', totalOrders: 4, totalSpent: 1567, createdAt: '2024-04-22' },
  { id: '6', name: 'Anita Desai', email: 'anita@example.com', phone: '+91 43210 98765', totalOrders: 1, totalSpent: 189, createdAt: '2024-11-01' },
];

export const mockCategories: AdminCategory[] = [
  { id: '1', name: 'Fashion', image: '/placeholder.svg', productsCount: 45, isActive: true },
  { id: '2', name: 'Electronics', image: '/placeholder.svg', productsCount: 32, isActive: true },
  { id: '3', name: 'Beauty', image: '/placeholder.svg', productsCount: 28, isActive: true },
  { id: '4', name: 'Home & Living', image: '/placeholder.svg', productsCount: 19, isActive: true },
  { id: '5', name: 'Sports', image: '/placeholder.svg', productsCount: 15, isActive: true },
  { id: '6', name: 'Grocery', image: '/placeholder.svg', productsCount: 56, isActive: false },
];

export const mockCoupons: AdminCoupon[] = [
  { id: '1', code: 'WELCOME10', discount: 10, minOrder: 500, expiryDate: '2025-03-31', usedCount: 234, isActive: true },
  { id: '2', code: 'SUMMER25', discount: 25, minOrder: 1000, expiryDate: '2025-06-30', usedCount: 89, isActive: true },
  { id: '3', code: 'FLAT50', discount: 50, minOrder: 2000, expiryDate: '2025-01-15', usedCount: 456, isActive: false },
  { id: '4', code: 'NEW15', discount: 15, minOrder: 300, expiryDate: '2025-12-31', usedCount: 12, isActive: true },
];

export const mockDashboardStats = {
  totalProducts: 156,
  totalOrders: 1234,
  pendingOrders: 23,
  totalRevenue: 458920,
};
