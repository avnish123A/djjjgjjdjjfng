import { motion } from 'framer-motion';

const trustItems = [
  { title: 'Single Estate', description: 'Direct from producer' },
  { title: '100% Traceable', description: 'Origin verified' },
  { title: 'Cold Chain', description: 'Temperature controlled' },
  { title: 'No Additives', description: 'Pure ingredients' },
  { title: 'Small Batch', description: 'Limited production' },
  { title: 'Expert Curated', description: 'Sommelier selected' },
];

export const TrustSection = () => {
  return (
    <section className="py-16 lg:py-20 border-t border-foreground/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-4">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <h3 className="font-utility text-[10px] tracking-[0.15em] text-foreground/70 mb-1">{item.title.toUpperCase()}</h3>
              <p className="font-display-italic text-xs text-foreground/35">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
