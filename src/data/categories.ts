export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

// Static fallback — app primarily uses DB categories via useCategories hook
export const categories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80', productCount: 0 },
  { id: '2', name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80', productCount: 0 },
  { id: '3', name: 'Home & Living', slug: 'home-living', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80', productCount: 0 },
  { id: '4', name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80', productCount: 0 },
  { id: '5', name: 'Gifts', slug: 'gifts', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80', productCount: 0 },
  { id: '6', name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80', productCount: 0 },
];
