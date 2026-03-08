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
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
    rating: 4.8,
    reviewCount: 234,
    category: 'suit-sets',
    badge: 'Best Seller',
    colors: ['#C41E3A', '#1B4D3E', '#DAA520'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    description: 'Luxurious chanderi silk suit set featuring intricate gold zari weaving and delicate threadwork.',
  },
  {
    id: '2',
    name: 'Floral Printed Kurta Set',
    brand: 'EkamWear',
    price: 2499,
    originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1583391733981-8b530e40d896?w=800',
    rating: 4.7,
    reviewCount: 445,
    category: 'kurta-sets',
    badge: 'Best Seller',
    inStock: true,
    description: 'Vibrant floral printed kurta set in soft cotton mull with matching palazzo pants.',
  },
  {
    id: '3',
    name: 'Floor Length Georgette Anarkali',
    brand: 'EkamWear',
    price: 5999,
    originalPrice: 7999,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80&fit=crop&crop=center',
    rating: 4.9,
    reviewCount: 312,
    category: 'anarkali',
    badge: 'Best Seller',
    colors: ['#4B0082', '#C41E3A', '#006400'],
    inStock: true,
    description: 'Sweeping floor-length anarkali in pure georgette with cascading gold sequin borders.',
  },
  {
    id: '4',
    name: 'Banarasi Silk Saree',
    brand: 'EkamWear',
    price: 8999,
    originalPrice: 11999,
    image: 'https://images.unsplash.com/photo-1610030469896-8e5e39c99e10?w=800&q=80',
    rating: 4.9,
    reviewCount: 345,
    category: 'sarees',
    badge: 'Best Seller',
    inStock: true,
    description: 'Exquisite Banarasi silk saree handwoven with traditional gold and silver zari motifs.',
  },
  {
    id: '5',
    name: 'Lucknowi Cotton Kurta',
    brand: 'EkamWear',
    price: 2499,
    originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=800',
    rating: 4.8,
    reviewCount: 389,
    category: 'men-kurtas',
    badge: 'Best Seller',
    inStock: true,
    description: 'Classic Lucknowi chikankari kurta in pure cotton with intricate hand-embroidered shadow work.',
  },
  {
    id: '6',
    name: 'Kundan Chandelier Earrings',
    brand: 'EkamWear',
    price: 1499,
    originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6c2?w=800',
    rating: 4.8,
    reviewCount: 456,
    category: 'jewellery',
    badge: 'Best Seller',
    inStock: true,
    description: 'Statement kundan chandelier earrings with cascading pearl drops and emerald-green meenakari work.',
  },
];
