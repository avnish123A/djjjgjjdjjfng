import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RotateCcw, Headphones, BadgeCheck, CreditCard } from 'lucide-react';

const trustItems = [
  { icon: Truck, title: 'Free Delivery', description: 'On orders above ₹999' },
  { icon: ShieldCheck, title: '100% Genuine', description: 'Authentic products only' },
  { icon: RotateCcw, title: 'Easy Returns', description: '7-day return policy' },
  { icon: CreditCard, title: 'Secure Payment', description: 'SSL encrypted checkout' },
  { icon: BadgeCheck, title: 'Quality Assured', description: 'Handpicked products' },
  { icon: Headphones, title: 'Customer Support', description: 'Mon-Sat, 10AM-7PM' },
];

export const TrustSection = () => {
  return (
    <section className="py-16 lg:py-20 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-4">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-secondary mb-3">
                <item.icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-semibold text-sm mb-0.5">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
