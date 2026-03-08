import { Truck, ShieldCheck, RotateCcw, CreditCard, Headphones, Award } from 'lucide-react';

const trustItems = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders above ₹4999 across India' },
  { icon: ShieldCheck, title: '100% Genuine', description: 'Authorized products with warranty' },
  { icon: RotateCcw, title: '7-Day Returns', description: 'Easy hassle-free return policy' },
  { icon: CreditCard, title: 'Secure Payments', description: 'SSL encrypted, PCI-DSS compliant' },
  { icon: Award, title: 'Brand Warranty', description: 'Official manufacturer warranty' },
  { icon: Headphones, title: '24/7 Support', description: 'Expert tech support anytime' },
];

export const TrustSection = () => {
  return (
    <section className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="perspective-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-4">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-start gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-0.5">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
