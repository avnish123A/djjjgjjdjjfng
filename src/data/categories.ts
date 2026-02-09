import catFashion from '@/assets/cat-fashion.jpg';
import catElectronics from '@/assets/cat-electronics.jpg';
import catBeauty from '@/assets/cat-beauty.jpg';
import catHome from '@/assets/cat-home.jpg';
import catSports from '@/assets/cat-sports.jpg';
import catGrocery from '@/assets/cat-grocery.jpg';

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  { id: '1', name: 'Fashion', slug: 'fashion', image: catFashion, productCount: 256 },
  { id: '2', name: 'Electronics', slug: 'electronics', image: catElectronics, productCount: 189 },
  { id: '3', name: 'Beauty & Health', slug: 'beauty', image: catBeauty, productCount: 178 },
  { id: '4', name: 'Home & Living', slug: 'home-living', image: catHome, productCount: 213 },
  { id: '5', name: 'Sports & Fitness', slug: 'sports', image: catSports, productCount: 145 },
  { id: '6', name: 'FMCG & Grocery', slug: 'fmcg', image: catGrocery, productCount: 342 },
];