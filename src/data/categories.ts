export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

// These are fallback/static categories — the app primarily uses DB categories via useCategories hook
export const categories: Category[] = [
  { id: '1', name: 'Desk & Gadgets', slug: 'desk-gadgets', image: 'https://www.bigsmall.in/cdn/shop/files/2_ae79da9c-90db-454a-882d-a45098d716aa.png?crop=center&height=500&v=1769778498&width=500', productCount: 5 },
  { id: '2', name: 'Home & Living', slug: 'home-living', image: 'https://www.bigsmall.in/cdn/shop/files/3_a4c39915-698b-4d66-9525-6884fa020fb6.png?crop=center&height=500&v=1769778498&width=500', productCount: 7 },
  { id: '3', name: 'Travel Essentials', slug: 'travel-essentials', image: 'https://www.bigsmall.in/cdn/shop/files/5_eb1dc556-96cc-471f-b2fa-a866e7c07f18.png?crop=center&height=500&v=1769778498&width=500', productCount: 3 },
  { id: '4', name: 'Gifts for Her', slug: 'gifts-for-her', image: 'https://www.bigsmall.in/cdn/shop/files/4_87e8d87f-7c68-4898-b701-2c24306d18d4.png?crop=center&height=500&v=1769778498&width=500', productCount: 4 },
  { id: '5', name: 'Gifts for Him', slug: 'gifts-for-him', image: 'https://www.bigsmall.in/cdn/shop/files/1_ab5ba158-8f7f-418e-8bab-1e5b5b9c5c24.png?crop=center&height=500&v=1769778498&width=500', productCount: 2 },
  { id: '6', name: 'Personalized Gifts', slug: 'personalized-gifts', image: 'https://www.bigsmall.in/cdn/shop/files/6_267e2f3d-e699-4f4b-aa23-7f703abfc9ea.png?crop=center&height=500&v=1769778498&width=500', productCount: 2 },
];
