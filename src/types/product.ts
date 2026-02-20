export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  categoryId?: string;
  categoryName?: string;
  badge?: string;
  colors?: string[];
  sizes?: string[];
  inStock: boolean;
  stock: number;
  description: string;
  lowStockThreshold?: number;
  trackInventory?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}
