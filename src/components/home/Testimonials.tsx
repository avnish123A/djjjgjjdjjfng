import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya S.',
    location: 'Mumbai',
    text: 'The Anarkali I ordered was absolutely stunning. The fabric quality and embroidery work exceeded my expectations. Perfect for my cousin\'s wedding!',
    rating: 5,
    initials: 'PS',
  },
  {
    name: 'Arjun K.',
    location: 'Bangalore',
    text: 'Finally found a brand that makes premium ethnic wear for men that fits perfectly. The Nehru jacket I bought gets compliments every time.',
    rating: 5,
    initials: 'AK',
  },
  {
    name: 'Meera R.',
    location: 'Delhi',
    text: 'I\'ve ordered kurta sets three times now. The quality is consistent, the colors are vibrant, and delivery is always on time. My go-to ethnic brand.',
    rating: 5,
    initials: 'MR',
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[11px] font-medium uppercase tracking-[5px] text-primary mb-4 block">Reviews</span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight">What Our Customers Say</h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm">
            Loved by thousands of fashion enthusiasts across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <div
              key={testimonial.name}
              className="bg-card border border-border/60 rounded-2xl p-8 relative hover:shadow-card-hover transition-shadow duration-500 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <Quote className="h-8 w-8 text-primary/15 mb-5" />
              <p className="text-sm text-foreground/80 leading-relaxed mb-8">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
