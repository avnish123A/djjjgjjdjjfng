export const Marquee = () => {
  const items = [
    'GENUINE PRODUCTS',
    'SECURE PAYMENTS',
    'FAST DELIVERY',
    'EASY RETURNS',
    'EXCLUSIVE DEALS',
    'CASH ON DELIVERY',
    'TRUSTED BY SHOPPERS',
    'SHOP SMART. DISCOVER MORE.',
  ];

  return (
    <section className="py-6 border-y border-foreground/8 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="font-utility text-[11px] tracking-[0.3em] text-foreground/50 mx-8 flex items-center gap-8">
            {item}
            <span className="text-accent">◆</span>
          </span>
        ))}
      </div>
    </section>
  );
};
