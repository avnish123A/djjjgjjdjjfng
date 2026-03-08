export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

// Static fallback categories — the app primarily uses DB categories via useCategories hook
export const categories: Category[] = [
  { id: '1', name: 'Smartphones', slug: 'smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', productCount: 8 },
  { id: '2', name: 'Laptops', slug: 'laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80', productCount: 8 },
  { id: '3', name: 'Tablets', slug: 'tablets', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80', productCount: 5 },
  { id: '4', name: 'Mobile Accessories', slug: 'mobile-accessories', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80', productCount: 7 },
  { id: '5', name: 'Laptop Accessories', slug: 'laptop-accessories', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80', productCount: 6 },
  { id: '6', name: 'Smart Gadgets', slug: 'smart-gadgets', image: 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=800&q=80', productCount: 8 },
];
