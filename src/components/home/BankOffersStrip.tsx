import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const bankOffers = [
  { bank: 'HDFC Bank', offer: 'Get up to ₹5,000 Instant Discount on Credit Card EMI', color: '#004B8D' },
  { bank: 'ICICI Bank', offer: 'Get up to ₹10,000 Instant Discount on Credit Cards', color: '#F37020' },
  { bank: 'SBI Card', offer: 'Get 10% Cashback up to ₹3,000 on SBI Credit Cards', color: '#22409A' },
  { bank: 'Axis Bank', offer: 'Get up to ₹7,500 Instant Discount on Axis Bank EMI', color: '#97144D' },
  { bank: 'Kotak Bank', offer: 'Get 5% Instant Discount up to ₹2,500 on Kotak Cards', color: '#ED1C24' },
  { bank: 'HSBC', offer: 'Get up to ₹8,000 Instant Discount on HSBC Bank Cards', color: '#DB0011' },
];

export const BankOffersStrip = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="py-3 bg-secondary/50 border-b border-border">
      <div className="container mx-auto px-4 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
          <button onClick={() => scroll('left')} className="p-1 bg-card rounded-full shadow border border-border hover:bg-secondary transition-colors">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
          <button onClick={() => scroll('right')} className="p-1 bg-card rounded-full shadow border border-border hover:bg-secondary transition-colors">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide sm:mx-6">
          {bankOffers.map((offer) => (
            <div
              key={offer.bank}
              className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-2.5 min-w-[280px] shrink-0 hover:shadow-sm transition-shadow cursor-pointer"
            >
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                style={{ backgroundColor: offer.color }}
              >
                {offer.bank.split(' ')[0].slice(0, 4)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-foreground leading-tight line-clamp-2">
                  {offer.offer}
                </p>
                <p className="text-[9px] text-muted-foreground mt-0.5">*T&C apply</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
