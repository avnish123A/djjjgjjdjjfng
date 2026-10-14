import type { Product, Category } from '@/types/product';
export type CatalogSort = 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'discount';
export function discoverProducts(products: Product[], categories: Category[], search: string, category: string | null, priceRange: [number, number], sort: string) {
 const words = search.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
 const categoryId = category ? categories.find(c => c.slug === category)?.id : undefined;
 let result = products.filter(p => (!category || (categoryId && p.categoryId === categoryId)) && p.price >= priceRange[0] && p.price <= priceRange[1] && words.every(word => `${p.name} ${p.brand} ${p.categoryName || ''} ${p.description}`.toLocaleLowerCase().includes(word)));
 if (sort === 'discount') result = result.filter(p => p.originalPrice && p.originalPrice > p.price).sort((a,b) => ((b.originalPrice || b.price)-b.price)/(b.originalPrice || b.price) - ((a.originalPrice || a.price)-a.price)/(a.originalPrice || a.price));
 if (sort === 'price-asc') result.sort((a,b)=>a.price-b.price);
 if (sort === 'price-desc') result.sort((a,b)=>b.price-a.price);
 // The source is already ordered by merchandising and creation date. Do not infer dates from badges.
 return result;
}
