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

// Static fallback — app primarily uses DB products via useProducts hook
export const products: Product[] = [
  {
    id: '1',
    name: 'Tuscan Estate Extra Virgin Olive Oil',
    brand: 'Terroir & Co.',
    price: 3200,
    originalPrice: 3800,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaabdf50494?w=800&q=80',
    rating: 4.9,
    reviewCount: 187,
    category: 'single-origin-oils',
    badge: 'Best Seller',
    inStock: true,
    description: 'Origin: Chianti, Tuscany — Harvest: 2025. Notes of: Fresh artichoke, green almond, white pepper.',
  },
  {
    id: '2',
    name: '25-Year Aged Balsamic — Modena DOP',
    brand: 'Terroir & Co.',
    price: 8500,
    originalPrice: 9800,
    image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&q=80',
    rating: 5.0,
    reviewCount: 89,
    category: 'artisan-vinegars',
    badge: 'Best Seller',
    inStock: true,
    description: 'Origin: Emilia-Romagna, Italy — Aged since 2001. Notes of: Dark cherry, dried plum, caramel, aged wood.',
  },
  {
    id: '3',
    name: 'Kashmir Saffron — Grade I Mongra',
    brand: 'Terroir & Co.',
    price: 12000,
    originalPrice: 14000,
    image: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=800&q=80',
    rating: 5.0,
    reviewCount: 156,
    category: 'heritage-spices',
    badge: 'Best Seller',
    inStock: true,
    description: 'Origin: Pampore, Kashmir — Harvest: November 2025. Notes of: Honey, hay, metallic warmth, earthy sweetness.',
  },
  {
    id: '4',
    name: 'Silver Needle White Tea — Fujian',
    brand: 'Terroir & Co.',
    price: 4800,
    originalPrice: 5500,
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80',
    rating: 5.0,
    reviewCount: 112,
    category: 'rare-teas',
    badge: 'Best Seller',
    inStock: true,
    description: 'Origin: Fuding, Fujian Province — Spring 2025 first flush. Notes of: Cucumber water, honeydew melon, sweet hay.',
  },
  {
    id: '5',
    name: 'Fleur de Sel — Guérande',
    brand: 'Terroir & Co.',
    price: 2800,
    originalPrice: 3200,
    image: 'https://images.unsplash.com/photo-1518110925495-5fe2c8dcf2f5?w=800&q=80',
    rating: 4.9,
    reviewCount: 198,
    category: 'cured-salts',
    badge: 'Best Seller',
    inStock: true,
    description: 'Origin: Guérande, Brittany — Harvest: Summer 2025. Notes of: Violet, mild brine, mineral sweetness.',
  },
  {
    id: '6',
    name: 'Acacia Honey — Hungarian Plains',
    brand: 'Terroir & Co.',
    price: 2400,
    originalPrice: 2900,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80',
    rating: 4.9,
    reviewCount: 178,
    category: 'wild-honey',
    badge: 'Best Seller',
    inStock: true,
    description: 'Origin: Great Hungarian Plain — Harvest: Spring 2025. Notes of: Vanilla, light floral, clean sweetness.',
  },
];
