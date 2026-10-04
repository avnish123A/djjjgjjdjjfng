import { motion } from 'framer-motion';
import { ShieldCheck, Truck, RotateCcw, Lock, Sparkles, Headphones } from 'lucide-react';

const trustItems = [
  { icon: ShieldCheck, title: 'Genuine Products', description: 'Sourced from trusted brands' },
  { icon: Truck, title: 'Fast Delivery', description: 'Tracked shipping across India' },
  { icon: RotateCcw, title: 'Easy Returns', description: '7-day hassle-free returns' },
  { icon: Lock, title: 'Secure Payments', description: 'UPI, cards & Cash on Delivery' },
  { icon: Sparkles, title: 'Curated Picks', description: 'Only what is worth buying' },
  { icon: Headphones, title: 'Real Support', description: 'Friendly help when you need it' },
];

export const TrustSection = () => (
  <section className="py-16 lg:py-24 bg-primary text-primary-foreground relative overflow-hidden">
    <div className="absolute inset-0 zebra-stripes opacity-20 pointer-events-none" />
    <div className="container mx-auto px-4 relative">
      <div className="max-w-xl mb-12">
        <p className="font-utility text-accent mb-3">WHY CARTZEBRA</p>
        <h2 className="font-display text-3xl sm:text-4xl">Shopping, made smarter.</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
        {trustItems.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="rounded-2xl border border-primary-foreground/10 p-5 lg:p-7 hover:border-accent/50 transition-colors"
          >
            <item.icon className="h-6 w-6 text-accent mb-4" strokeWidth={1.5} />
            <h3 className="font-bold text-base mb-1">{item.title}</h3>
            <p className="text-sm text-primary-foreground/60">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
