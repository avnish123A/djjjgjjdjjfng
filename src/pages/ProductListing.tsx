import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Button } from '@/components/ui/button';
import { PurchaseParcel } from '@/components/brand/PurchaseParcel';
import { discoverProducts } from '@/lib/catalog-discovery';
const ProductListing=()=>{
 const [params,setParams]=useSearchParams(); const selectedCategory=params.get('category'); const search=params.get('search')||''; const sort=params.get('sort')||'relevance';
 const [priceRange,setPriceRange]=useState<[number,number]>([0,50000]);
 const {data:products=[],isLoading,error,refetch}=useProducts(); const {data:categories=[]}=useCategories();
 const changeParam=(key:string,value:string|null)=>{const next=new URLSearchParams(params);if(value)next.set(key,value);else next.delete(key);setParams(next);};
 const visible=useMemo(()=>discoverProducts(products,categories,search,selectedCategory,priceRange,sort),[products,categories,search,selectedCategory,priceRange,sort]);
 const label=search?`Results for “${search}”`:selectedCategory?categories.find(c=>c.slug===selectedCategory)?.name||'Collection':sort==='discount'?"Today's deals":'Explore the collection';
 const reset=()=>{setParams({});setPriceRange([0,50000]);};
 return <main className="min-h-[65vh] pb-14"><div className="container px-4 pt-5">
  <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-7"><Link to="/">Home</Link><ChevronRight className="h-3 w-3"/><span>Shop</span></nav>
  <div className="flex flex-wrap justify-between items-end gap-4 mb-8"><div className="min-w-0"><p className="text-xs text-primary font-semibold mb-2">Find your next everyday favourite</p><h1 className="section-heading break-words">{label}</h1><p role="status" className="text-sm text-muted-foreground mt-2">{isLoading?'Loading collection…':`${visible.length} ${visible.length===1?'product':'products'}`}</p></div>
   <select aria-label="Sort products" value={sort} onChange={e=>changeParam('sort',e.target.value)} className="h-11 px-3 border border-border rounded-lg bg-card text-sm"><option value="relevance">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="newest">Latest collection</option><option value="discount">Current offers</option></select>
  </div>
  <div className="flex flex-col lg:flex-row gap-6"><ProductFilters selectedCategory={selectedCategory} onCategoryChange={c=>changeParam('category',c)} priceRange={priceRange} onPriceChange={setPriceRange} categories={categories}/><div className="flex-1 min-w-0">
   {(search||selectedCategory||priceRange[1]<50000)&&<div className="flex flex-wrap gap-2 mb-5">{search&&<Button variant="secondary" onClick={()=>changeParam('search',null)} className="h-11 whitespace-normal text-left">{search}<X/></Button>}{selectedCategory&&<Button variant="secondary" onClick={()=>changeParam('category',null)} className="h-11">{categories.find(c=>c.slug===selectedCategory)?.name||'Category'}<X/></Button>}<Button variant="ghost" onClick={reset}>Clear all</Button></div>}
   {error?<div role="alert" className="py-16 text-center"><p className="mb-4 text-muted-foreground">We couldn't load products. Please try again.</p><Button onClick={()=>refetch()}>Retry</Button></div>:isLoading?<div className="grid grid-cols-2 md:grid-cols-3 gap-4">{Array.from({length:6},(_,i)=><div key={i} className="aspect-[3/4] shimmer rounded-lg"/>)}</div>:visible.length?<div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-5">{visible.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<div className="text-center py-8"><PurchaseParcel/><h2 className="text-xl font-bold mt-3 mb-2">No matches this time</h2><p className="text-sm text-muted-foreground mb-5">Try another search or explore the whole collection.</p><Button onClick={reset}>Explore all products</Button></div>}
  </div></div>
 </div></main>;
};
export default ProductListing;
