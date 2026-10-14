import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Package, ShoppingBag, X, Menu, Grid2X2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { MobileMenu } from './MobileMenu';
import { Logo } from '@/components/brand/Logo';
export const Header = () => {
 const [mobileMenuOpen,setMobileMenuOpen]=useState(false);
 const [query,setQuery]=useState(''); const [category,setCategory]=useState('');
 const {totalItems}=useCart(); const {data:categories=[]}=useCategories(); const {data:products=[]}=useProducts(); const navigate=useNavigate();
 const shopCategories=categories.filter(c=>products.some(p=>p.categoryId===c.id));
 const submit=(e:React.FormEvent)=>{e.preventDefault();const params=new URLSearchParams();if(query.trim())params.set('search',query.trim());if(category)params.set('category',category);navigate(`/products?${params}`);};
 return <><header className="relative z-40 bg-card border-b border-border">
  <div className="container px-4 py-4 flex flex-wrap items-center gap-2 lg:gap-5">
   <Button variant="ghost" size="icon" aria-label="Open menu" onClick={()=>setMobileMenuOpen(true)} className="lg:hidden h-11 w-11 -ml-2"><Menu/></Button>
   <Link to="/" aria-label="CartZebra home" className="shrink-0"><Logo/></Link>
   <form role="search" onSubmit={submit} className="order-last lg:order-none flex w-full lg:flex-1 items-center rounded-lg border border-border bg-background h-12 overflow-hidden">
    <Search className="h-4 w-4 text-muted-foreground ml-3 shrink-0 lg:hidden"/>
    <input aria-label="Search products" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products, brands and categories…" className="w-0 flex-1 px-3 h-full bg-transparent text-sm outline-none"/>
    {query&&<Button type="button" variant="ghost" size="icon" aria-label="Clear search" onClick={()=>setQuery('')} className="h-11 w-11 shrink-0"><X/></Button>}
    <select aria-label="Search category" value={category} onChange={e=>setCategory(e.target.value)} className="hidden xl:block bg-transparent border-l border-border text-xs px-3 h-full max-w-40"><option value="">All categories</option>{shopCategories.map(c=><option key={c.id} value={c.slug}>{c.name}</option>)}</select>
    <Button type="submit" size="icon" aria-label="Submit search" className="rounded-none h-12 w-12 shrink-0"><Search/></Button>
   </form>
   <div className="ml-auto shrink-0 flex items-center gap-1 lg:gap-3">
    <Button asChild variant="ghost" className="h-11 px-2" title="Track your order"><Link to="/track-order" aria-label="Track order"><Package/><span className="hidden lg:inline text-xs">Track order</span></Link></Button>
    <Button asChild variant="ghost" size="icon" className="relative h-11 w-11"><Link to="/cart" aria-label={`Cart, ${totalItems} items`}><ShoppingBag/>{totalItems>0&&<span className="absolute top-0 right-0 rounded-full bg-primary text-primary-foreground text-[10px] min-w-4 h-4 px-1 flex items-center justify-center">{totalItems}</span>}</Link></Button>
   </div>
  </div>
  <nav aria-label="Shop navigation" className="hidden lg:block border-t border-border"><div className="container px-4 flex items-center gap-5 h-12 text-sm font-semibold">
   <Button asChild className="h-9 px-4"><Link to="/products"><Grid2X2/>Shop by category</Link></Button>
   {products.some(p=>p.originalPrice&&p.originalPrice>p.price)&&<Link to="/products?sort=discount" className="hover:text-primary">Today's deals</Link>}
   {shopCategories.slice(0,6).map(c=><Link key={c.id} to={`/products?category=${c.slug}`} className="hover:text-primary">{c.name}</Link>)}
  </div></nav>
 </header><MobileMenu open={mobileMenuOpen} onClose={()=>setMobileMenuOpen(false)}/></>;
};
