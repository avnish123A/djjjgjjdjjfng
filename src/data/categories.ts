export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

// These are fallback/static categories — the app primarily uses DB categories via useCategories hook
export const categories: Category[] = [
  { id: '1', name: 'Suit Sets', slug: 'suit-sets', image: '/placeholder.svg', productCount: 4 },
  { id: '2', name: 'Kurta Sets', slug: 'kurta-sets', image: '/placeholder.svg', productCount: 5 },
  { id: '3', name: 'Co-ord Sets', slug: 'co-ord-sets', image: '/placeholder.svg', productCount: 4 },
  { id: '4', name: 'Anarkali', slug: 'anarkali', image: '/placeholder.svg', productCount: 4 },
  { id: '5', name: 'Lehenga Sets', slug: 'lehenga-sets', image: '/placeholder.svg', productCount: 3 },
  { id: '6', name: 'Sarees', slug: 'sarees', image: '/placeholder.svg', productCount: 4 },
  { id: '7', name: 'Dresses', slug: 'dresses', image: '/placeholder.svg', productCount: 4 },
  { id: '8', name: 'Men Kurtas', slug: 'men-kurtas', image: '/placeholder.svg', productCount: 4 },
  { id: '9', name: 'Sherwanis', slug: 'sherwanis', image: '/placeholder.svg', productCount: 3 },
  { id: '10', name: 'Jewellery', slug: 'jewellery', image: '/placeholder.svg', productCount: 4 },
  { id: '11', name: 'Bags', slug: 'bags', image: '/placeholder.svg', productCount: 3 },
  { id: '12', name: 'Dupattas & Scarves', slug: 'dupattas-scarves', image: '/placeholder.svg', productCount: 4 },
];
