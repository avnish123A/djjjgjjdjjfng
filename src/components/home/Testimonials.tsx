import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rahul M.',
    location: 'Mumbai',
    text: 'Ordered the MacBook Air M4 and it arrived in just 2 days. Genuine product, sealed packaging, and the price was better than other online stores. EkamTech is now my go-to for electronics!',
    rating: 5,
    initials: 'RM',
  },
  {
    name: 'Sneha P.',
    location: 'Bangalore',
    text: 'Bought the Samsung Galaxy S25 Ultra. The delivery was fast, the product is 100% authentic, and the customer support team helped me with the setup. Highly recommend!',
    rating: 5,
    initials: 'SP',
  },
  {
    name: 'Vikram S.',
    location: 'Delhi',
    text: 'Great experience buying my ASUS ROG gaming laptop. Competitive pricing, genuine warranty card included, and the packaging was solid. Will definitely shop here again.',
    rating: 5,
    initials: 'VS',
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 lg:py-28 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[11px] font-medium uppercase tracking-[5px] text-accent mb-4 block">Reviews</span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight">What Our Customers Say</h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm">
            Trusted by thousands of tech enthusiasts across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <div
              key={testimonial.name}
              className="bg-card border border-border/60 rounded-2xl p-8 relative hover:shadow-card-hover transition-shadow duration-500 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <Quote className="h-8 w-8 text-accent/15 mb-5" />
              <p className="text-sm text-foreground/80 leading-relaxed mb-8">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-semibold">
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
