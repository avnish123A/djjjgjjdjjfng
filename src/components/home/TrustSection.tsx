import { Truck, ShieldCheck, RotateCcw, CreditCard, Headphones, Award } from 'lucide-react';

const trustItems = [
  { icon: Truck, title: 'Free Delivery', description: 'On orders above ₹4999' },
  { icon: ShieldCheck, title: '100% Genuine', description: 'Authorized products' },
  { icon: RotateCcw, title: '7-Day Returns', description: 'Easy return policy' },
  { icon: CreditCard, title: 'Secure Payments', description: 'SSL encrypted' },
  { icon: Award, title: 'Brand Warranty', description: 'Official warranty' },
  { icon: Headphones, title: '24/7 Support', description: 'Expert help anytime' },
];

export const TrustSection = () => {
  return (
    <section className="py-8 border-t border-b border-border bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-xs">{item.title}</h3>
                <p className="text-[10px] text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
