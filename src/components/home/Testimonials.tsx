import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya S.',
    location: 'Mumbai',
    text: 'The packaging was exquisite. My mother was moved to tears when she opened her birthday gift from EkamGift.',
    rating: 5,
  },
  {
    name: 'Arjun K.',
    location: 'Bangalore',
    text: 'Finally, a gifting brand that understands quality without being ostentatious. Every detail is considered.',
    rating: 5,
  },
  {
    name: 'Meera R.',
    location: 'Delhi',
    text: 'I\'ve ordered three times now. The quality is consistent, delivery is prompt, and the curation is impeccable.',
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-[11px] font-medium uppercase tracking-[4px] text-primary mb-3 block">Testimonials</span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight">What Our Clients Say</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-background border border-border rounded-xl p-8 relative"
            >
              <Quote className="h-6 w-6 text-primary/30 mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm font-medium">{testimonial.name}</p>
              <p className="text-xs text-muted-foreground">{testimonial.location}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
