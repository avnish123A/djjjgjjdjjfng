import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Ananya R.',
    location: 'Mumbai',
    text: 'The Tuscan olive oil is extraordinary — it tastes like sunshine and fresh grass. I\'ve never experienced anything like it from an online store.',
    initials: 'AR',
  },
  {
    name: 'Rohan K.',
    location: 'Bangalore',
    text: 'The Darjeeling first flush is legitimately the best tea I\'ve ever had. You can taste the altitude and the care. My pantry is now entirely Terroir & Co.',
    initials: 'RK',
  },
  {
    name: 'Priya S.',
    location: 'Delhi',
    text: 'I gifted the Kashmir saffron to my mother and she couldn\'t believe the quality. The packaging is beautiful too — it felt like receiving something precious.',
    initials: 'PS',
  },
];

export const Testimonials = () => {
  return (
    <section className="py-16 lg:py-24 border-t border-foreground/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="font-utility text-[10px] tracking-[0.3em] text-foreground/40 mb-3">VOICES</p>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tighter">From Our Community</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="text-center"
            >
              <p className="font-display-italic text-sm text-foreground/70 leading-relaxed mb-8">
                "{t.text}"
              </p>
              <div>
                <p className="font-utility text-[10px] tracking-[0.15em] text-foreground/70">{t.name.toUpperCase()}</p>
                <p className="font-display-italic text-xs text-foreground/30 mt-0.5">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
