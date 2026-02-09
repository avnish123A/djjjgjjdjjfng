import { motion } from 'framer-motion';
import { products } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export const FeaturedProducts = () => {
  const featured = products.slice(0, 8);

  return (
    <section className="py-16 lg:py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Trending Now</h2>
            <p className="text-muted-foreground">Discover what's popular this week</p>
          </div>
        </motion.div>

        <Carousel
          opts={{ align: 'start', slidesToScroll: 1 }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {featured.map((product, index) => (
              <CarouselItem key={product.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 lg:-left-5 h-10 w-10 border-border shadow-card" />
          <CarouselNext className="-right-4 lg:-right-5 h-10 w-10 border-border shadow-card" />
        </Carousel>
      </div>
    </section>
  );
};