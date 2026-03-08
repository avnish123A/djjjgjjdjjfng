import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rahul M.',
    location: 'Mumbai',
    text: 'Ordered the MacBook Air M4 and it arrived in just 2 days. Genuine product, sealed packaging, and the price was better than other stores. Highly recommended!',
    rating: 5,
    initials: 'RM',
  },
  {
    name: 'Sneha P.',
    location: 'Bangalore',
    text: 'Bought the Samsung Galaxy S25 Ultra. The delivery was fast, product is 100% authentic, and customer support helped me with setup. Great experience!',
    rating: 5,
    initials: 'SP',
  },
  {
    name: 'Vikram S.',
    location: 'Delhi',
    text: 'Great experience buying my ASUS ROG gaming laptop. Competitive pricing, genuine warranty card included, and solid packaging. Will shop here again.',
    rating: 5,
    initials: 'VS',
  },
];

export const Testimonials = () => {
  return (
    <section className="py-10 lg:py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-display text-xl sm:text-2xl tracking-tight">What Our Customers Say</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Trusted by thousands of tech enthusiasts across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
