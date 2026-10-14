import { describe, it, expect } from 'vitest';
import { discoverProducts } from '@/lib/catalog-discovery';
import type { Product } from '@/types/product';
const base: Product={id:'a',name:'Arc headphones',brand:'CartZebra',price:1000,image:'',images:[],rating:0,reviewCount:0,inStock:true,stock:3,description:'Wireless audio',features:[],specifications:{},categoryId:'e',categoryName:'Electronics'};
const products=[base,{...base,id:'b',name:'Home lamp',categoryId:'h',categoryName:'Home',price:2000,originalPrice:2500,description:'Warm lighting'}];
const categories=[{id:'e',name:'Electronics',slug:'electronics',image:''},{id:'h',name:'Home',slug:'home',image:''}];
describe('catalog discovery',()=>{
 it('search filters the actual catalog case-insensitively',()=>expect(discoverProducts(products,categories,'WIRELESS',null,[0,50000],'relevance').map(p=>p.id)).toEqual(['a']));
 it('category and search apply together',()=>expect(discoverProducts(products,categories,'headphones','home',[0,50000],'relevance')).toEqual([]));
 it('deals require a genuine higher stored compare price',()=>expect(discoverProducts(products,categories,'',null,[0,50000],'discount').map(p=>p.id)).toEqual(['b']));
 it('an unknown category does not expose every product',()=>expect(discoverProducts(products,categories,'','missing',[0,50000],'relevance')).toEqual([]));
});
