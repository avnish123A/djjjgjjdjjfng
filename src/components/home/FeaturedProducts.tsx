import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
export const FeaturedProducts=()=>{
 const {data:products=[],isLoading,error,refetch}=useProducts();
 const featured=products.filter(p=>p.isFeatured); const visible=(featured.length?featured:products).slice(0,8);
 return <section className="pb-12 lg:pb-16"><div className="container px-4">
 <div className="flex items-center justify-between gap-4 mb-6"><div><p className="text-primary text-xs font-semibold mb-2">Something worth discovering</p><h2 className="section-heading">The everyday edit</h2></div><Link to="/products" className="text-primary text-sm font-semibold flex items-center gap-1 shrink-0">View all <ArrowRight className="h-4 w-4"/></Link></div>
 {error?<div role="alert" className="py-8 text-center"><p className="text-muted-foreground mb-3">We couldn't load the collection.</p><Button variant="outline" onClick={()=>refetch()}>Try again</Button></div>:isLoading?<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({length:4},(_,i)=><div key={i} className="aspect-[3/4] shimmer rounded-lg"/>)}</div>:visible.length?<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">{visible.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<div className="py-10 text-center text-muted-foreground">The collection is being updated.</div>}
 </div></section>;
};
