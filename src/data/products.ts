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
// Static fallback — products are managed from the admin panel.
export const products: Product[] = [];
