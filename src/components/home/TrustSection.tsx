import { Truck, ShieldCheck, RotateCcw, CreditCard, Headphones, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const trustItems = [
  { icon: Truck, title: 'Free Delivery', description: 'On orders above ₹4999', color: 'text-blue-500' },
  { icon: ShieldCheck, title: '100% Genuine', description: 'Authorized products', color: 'text-emerald-500' },
  { icon: RotateCcw, title: '7-Day Returns', description: 'Easy return policy', color: 'text-violet-500' },
  { icon: CreditCard, title: 'Secure Payments', description: 'SSL encrypted', color: 'text-cyan-500' },
  { icon: Award, title: 'Brand Warranty', description: 'Official warranty', color: 'text-amber-500' },
  { icon: Headphones, title: '24/7 Support', description: 'Expert help anytime', color: 'text-pink-500' },
];

export const TrustSection = () => {
  return (
    <section className="py-10 lg:py-14 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl hover:bg-secondary/50 transition-colors group"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
