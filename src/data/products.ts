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
    name: 'Chanderi Silk Suit Set',
    brand: 'EkamWear',
    price: 4999,
    originalPrice: 6499,
    image: '/placeholder.svg',
    rating: 4.8,
    reviewCount: 234,
    category: 'suit-sets',
    badge: 'Best Seller',
    colors: ['#C41E3A', '#1B4D3E', '#DAA520'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    description: 'Luxurious chanderi silk suit set with intricate gold zari work.',
  },
  {
    id: '2',
    name: 'Floral Printed Kurta Set',
    brand: 'EkamWear',
    price: 2499,
    originalPrice: 3499,
    image: '/placeholder.svg',
    rating: 4.7,
    reviewCount: 445,
    category: 'kurta-sets',
    badge: 'Best Seller',
    inStock: true,
    description: 'Breezy floral printed kurta paired with matching palazzo pants.',
  },
  {
    id: '3',
    name: 'Floor Length Georgette Anarkali',
    brand: 'EkamWear',
    price: 5999,
    originalPrice: 7999,
    image: '/placeholder.svg',
    rating: 4.9,
    reviewCount: 312,
    category: 'anarkali',
    badge: 'Best Seller',
    colors: ['#4B0082', '#C41E3A', '#006400'],
    inStock: true,
    description: 'Sweeping floor-length anarkali in pure georgette with gold sequin border.',
  },
  {
    id: '4',
    name: 'Banarasi Silk Saree',
    brand: 'EkamWear',
    price: 8999,
    originalPrice: 11999,
    image: '/placeholder.svg',
    rating: 4.9,
    reviewCount: 345,
    category: 'sarees',
    badge: 'Best Seller',
    inStock: true,
    description: 'Exquisite Banarasi silk saree with traditional gold zari motifs.',
  },
  {
    id: '5',
    name: 'Lucknowi Cotton Kurta',
    brand: 'EkamWear',
    price: 2499,
    originalPrice: 3499,
    image: '/placeholder.svg',
    rating: 4.8,
    reviewCount: 389,
    category: 'men-kurtas',
    badge: 'Best Seller',
    inStock: true,
    description: 'Classic Lucknowi chikankari kurta in pure cotton.',
  },
  {
    id: '6',
    name: 'Kundan Chandelier Earrings',
    brand: 'EkamWear',
    price: 1499,
    originalPrice: 1999,
    image: '/placeholder.svg',
    rating: 4.8,
    reviewCount: 456,
    category: 'jewellery',
    badge: 'Best Seller',
    inStock: true,
    description: 'Statement kundan chandelier earrings with pearl drops.',
  },
];
