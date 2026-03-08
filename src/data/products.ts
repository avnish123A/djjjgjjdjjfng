export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  badge?: 'Sale' | 'New' | 'Best Seller';
  colors?: string[];
  sizes?: string[];
  inStock: boolean;
  description?: string;
}

// Static fallback products — app primarily uses DB products via useProducts hook
export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 16 Pro Max 256GB',
    brand: 'Apple',
    price: 144900,
    originalPrice: 149900,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
    rating: 4.9,
    reviewCount: 1245,
    category: 'smartphones',
    badge: 'Best Seller',
    inStock: true,
    description: 'The ultimate iPhone with A18 Pro chip, 48MP camera system, titanium design, and all-day battery life.',
  },
  {
    id: '2',
    name: 'MacBook Air M4 15-inch',
    brand: 'Apple',
    price: 149900,
    originalPrice: 159900,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    rating: 4.9,
    reviewCount: 890,
    category: 'laptops',
    badge: 'Best Seller',
    inStock: true,
    description: 'Impossibly thin with the M4 chip delivering blazing performance and 18-hour battery life.',
  },
  {
    id: '3',
    name: 'Samsung Galaxy S25 Ultra',
    brand: 'Samsung',
    price: 134999,
    originalPrice: 139999,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
    rating: 4.8,
    reviewCount: 876,
    category: 'smartphones',
    badge: 'New',
    inStock: true,
    description: 'Flagship Galaxy with Snapdragon 8 Elite, 200MP camera, built-in S Pen, and Galaxy AI features.',
  },
  {
    id: '4',
    name: 'iPad Air M3 11-inch',
    brand: 'Apple',
    price: 69900,
    originalPrice: 74900,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
    rating: 4.8,
    reviewCount: 1567,
    category: 'tablets',
    badge: 'Best Seller',
    inStock: true,
    description: 'Supercharged by M3 chip with Liquid Retina display and Apple Pencil Pro support.',
  },
  {
    id: '5',
    name: 'Sony WH-1000XM6 Headphones',
    brand: 'Sony',
    price: 29999,
    originalPrice: 34999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    rating: 4.9,
    reviewCount: 2345,
    category: 'mobile-accessories',
    badge: 'Best Seller',
    inStock: true,
    description: 'Industry-leading noise cancellation with 40-hour battery and Hi-Res Audio support.',
  },
  {
    id: '6',
    name: 'ASUS ROG Strix G16',
    brand: 'ASUS',
    price: 129999,
    originalPrice: 144999,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
    rating: 4.7,
    reviewCount: 567,
    category: 'laptops',
    badge: 'Best Seller',
    inStock: true,
    description: 'Gaming powerhouse with NVIDIA RTX 4070, Intel Core i9, and 240Hz QHD+ display.',
  },
];
