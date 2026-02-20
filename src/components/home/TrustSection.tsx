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
    <section className="py-20 lg:py-24 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-[11px] font-medium uppercase tracking-[4px] text-primary mb-3 block">Why EkamGift</span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight">The EkamGift Promise</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-4">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl border border-primary/20 group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
