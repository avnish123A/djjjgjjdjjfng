export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

// Static fallback — app primarily uses DB categories via useCategories hook
export const categories: Category[] = [
  { id: '1', name: 'Single-Origin Oils', slug: 'single-origin-oils', image: 'https://images.unsplash.com/photo-1474979266404-7eaabdf50494?w=800&q=80', productCount: 5 },
  { id: '2', name: 'Artisan Vinegars', slug: 'artisan-vinegars', image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&q=80', productCount: 5 },
  { id: '3', name: 'Heritage Spices', slug: 'heritage-spices', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80', productCount: 5 },
  { id: '4', name: 'Wild Honey', slug: 'wild-honey', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80', productCount: 5 },
  { id: '5', name: 'Rare Teas', slug: 'rare-teas', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80', productCount: 5 },
  { id: '6', name: 'Cured Salts', slug: 'cured-salts', image: 'https://images.unsplash.com/photo-1518110925495-5fe2c8dcf2f5?w=800&q=80', productCount: 5 },
];
