import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

const trustItems = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders over $100' },
  { icon: ShieldCheck, title: 'Secure Payment', description: '256-bit SSL encryption' },
  { icon: RotateCcw, title: 'Easy Returns', description: '30-day return policy' },
  { icon: Headphones, title: '24/7 Support', description: 'Dedicated help center' },
];

export const TrustSection = () => {
  return (
    <section className="py-16 lg:py-20 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
                <item.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};