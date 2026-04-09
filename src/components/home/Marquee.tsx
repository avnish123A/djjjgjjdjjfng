export const Marquee = () => {
  const items = [
    '100% TRACEABLE',
    'SINGLE ESTATE',
    'COLD PRESSED',
    'HAND HARVESTED',
    'SMALL BATCH',
    'ARTISAN CRAFTED',
    'ETHICALLY SOURCED',
    'ZERO ADDITIVES',
  ];

  return (
    <section className="py-6 border-y border-foreground/8 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="font-utility text-[11px] tracking-[0.3em] text-foreground/25 mx-8 flex items-center gap-8">
            {item}
            <span className="text-foreground/10">◆</span>
          </span>
        ))}
      </div>
    </section>
  );
};
