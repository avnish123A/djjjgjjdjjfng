import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Rahul M.',
    location: 'Mumbai',
    text: 'Ordered the MacBook Air M4 and it arrived in just 2 days. Genuine product, sealed packaging, and the price was better than other stores. Highly recommended!',
    rating: 5,
    initials: 'RM',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Sneha P.',
    location: 'Bangalore',
    text: 'Bought the Samsung Galaxy S25 Ultra. The delivery was fast, product is 100% authentic, and customer support helped me with setup. Great experience!',
    rating: 5,
    initials: 'SP',
    color: 'from-violet-500 to-blue-500',
  },
  {
    name: 'Vikram S.',
    location: 'Delhi',
    text: 'Great experience buying my ASUS ROG gaming laptop. Competitive pricing, genuine warranty card included, and solid packaging. Will shop here again.',
    rating: 5,
    initials: 'VS',
    color: 'from-emerald-500 to-teal-500',
  },
];

export const Testimonials = () => {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-2xl sm:text-3xl tracking-tight">What Our Customers Say</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Trusted by thousands of tech enthusiasts across India
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-border/60 rounded-2xl p-6 card-3d relative overflow-hidden"
            >
              {/* Subtle gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${t.color}`} />
              
              <Quote className="h-8 w-8 text-primary/10 mb-3" />
              <div className="flex items-center gap-1 mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
