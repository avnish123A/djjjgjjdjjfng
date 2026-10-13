import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useReducedMotion } from 'framer-motion';
import hero from '@/assets/experience/hero-shopping.jpg';
export const HeroCarousel = () => {
 const reduced=useReducedMotion();
 return <section className="hero-surface relative overflow-hidden">
  <img src={hero} alt="" width={1920} height={1088} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-right hidden md:block"/>
  <div className="container relative px-4 py-10 md:py-16 lg:py-20">
   <motion.div initial={reduced?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.3}} className="md:w-[48%] lg:max-w-[520px]">
    <p className="text-xs font-semibold text-primary mb-4">A little more everyday delight</p>
    <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] mb-5">Everyday Essentials,<br/><span className="text-primary">Extraordinary</span><br/>Value.</h1>
    <p className="text-sm sm:text-base text-muted-foreground max-w-sm leading-relaxed mb-7">Discover products for everyday living, with a simpler and smarter shopping experience.</p>
    <div className="flex flex-wrap gap-3"><Button asChild className="h-12 px-6"><Link to="/products">Shop now <ArrowRight/></Link></Button><Button asChild variant="outline" className="h-12 px-5 bg-card/70"><a href="#categories">Explore categories</a></Button></div>
   </motion.div>
  </div>
  <div className="md:hidden h-56 sm:h-72 overflow-hidden"><img src={hero} alt="Decorative shopping parcel with everyday essentials" className="h-full w-full object-cover object-right" width={1920} height={1088}/></div>
 </section>;
};
