export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

// These are fallback/static categories — the app primarily uses DB categories via useCategories hook
export const categories: Category[] = [
  { id: '1', name: 'Desk & Gadgets', slug: 'desk-gadgets', image: 'https://rwrznilwfczmichtfyyo.supabase.co/storage/v1/object/public/product-images/categories/desk-gadgets.jpg', productCount: 5 },
  { id: '2', name: 'Home & Living', slug: 'home-living', image: 'https://rwrznilwfczmichtfyyo.supabase.co/storage/v1/object/public/product-images/categories/home-living.jpg', productCount: 7 },
  { id: '3', name: 'Travel Essentials', slug: 'travel-essentials', image: 'https://rwrznilwfczmichtfyyo.supabase.co/storage/v1/object/public/product-images/categories/travel.jpg', productCount: 3 },
  { id: '4', name: 'Gifts for Her', slug: 'gifts-for-her', image: 'https://rwrznilwfczmichtfyyo.supabase.co/storage/v1/object/public/product-images/categories/gifts-her.jpg', productCount: 4 },
  { id: '5', name: 'Gifts for Him', slug: 'gifts-for-him', image: 'https://rwrznilwfczmichtfyyo.supabase.co/storage/v1/object/public/product-images/categories/gifts-him.jpg', productCount: 2 },
  { id: '6', name: 'Personalized Gifts', slug: 'personalized-gifts', image: 'https://rwrznilwfczmichtfyyo.supabase.co/storage/v1/object/public/product-images/categories/personalized.jpg', productCount: 2 },
];
