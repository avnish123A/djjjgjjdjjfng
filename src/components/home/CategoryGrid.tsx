import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { ArrowRight } from 'lucide-react';
import electronics from '@/assets/experience/tile-electronics.jpg';
import fashion from '@/assets/experience/tile-fashion.jpg';
import beauty from '@/assets/experience/tile-beauty.jpg';
import home from '@/assets/experience/tile-home.jpg';
import gifts from '@/assets/experience/tile-gifts.jpg';
import accessories from '@/assets/experience/tile-accessories.jpg';
const illustrations:Record<string,string>={electronics,fashion,beauty,home,'home-living':home,'home-and-living':home,gifts,accessories};
export const CategoryGrid=()=>{
 const {data:categories=[],isLoading}=useCategories(); const {data:products=[]}=useProducts();
 const visible=categories.filter(c=>products.some(p=>p.categoryId===c.id));
 if(!isLoading&&!visible.length)return null;
 return <section id="categories" className="py-10 lg:py-14 scroll-mt-6"><div className="container px-4">
  <div className="flex items-center justify-between gap-4 mb-6"><h2 className="section-heading">Shop by category</h2><Link to="/products" className="text-primary text-sm font-semibold flex items-center gap-1 shrink-0">View all <ArrowRight className="h-4 w-4"/></Link></div>
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
   {isLoading?Array.from({length:6},(_,i)=><div key={i} className="aspect-square shimmer rounded-lg"/>):visible.slice(0,6).map(cat=><Link key={cat.id} to={`/products?category=${cat.slug}`} className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors">
    <div className="aspect-[6/5] overflow-hidden"><img src={illustrations[cat.slug]||cat.image} alt="" loading="lazy" width={512} height={512} className="w-full h-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"/></div>
    <div className="p-3 text-center"><h3 className="text-sm font-bold">{cat.name}</h3><p className="text-xs text-muted-foreground mt-1">Explore collection</p></div>
   </Link>)}
  </div>
 </div></section>;
};
