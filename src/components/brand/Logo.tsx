import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  showWordmark?: boolean;
}

/** CartZebra mark: a geometric "Z" built like a cart path, with zebra-stripe accents and wheels. */
export const LogoMark = ({ className, variant = 'dark' }: { className?: string; variant?: 'dark' | 'light' }) => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={cn('h-8 w-8 shrink-0', className)}>
    <rect width="64" height="64" rx="14" className={variant === 'dark' ? 'fill-primary' : 'fill-primary-foreground'} />
    <path
      d="M14 18h36L22 46h28"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={variant === 'dark' ? 'stroke-primary-foreground' : 'stroke-primary'}
    />
    <path d="M33 25l-7 7M41 25l-11 11" strokeWidth="3" strokeLinecap="round" className="stroke-accent" />
    <circle cx="25" cy="53" r="2.5" className={variant === 'dark' ? 'fill-primary-foreground' : 'fill-primary'} />
    <circle cx="45" cy="53" r="2.5" className={variant === 'dark' ? 'fill-primary-foreground' : 'fill-primary'} />
  </svg>
);

export const Logo = ({ className, variant = 'dark', showWordmark = true }: LogoProps) => (
  <span className={cn('inline-flex items-center gap-2.5', className)}>
    <LogoMark variant={variant} />
    {showWordmark && (
      <span
        className={cn(
          'font-display text-lg sm:text-xl tracking-[0.08em] leading-none',
          variant === 'dark' ? 'text-foreground' : 'text-primary-foreground'
        )}
      >
        CART<span className="text-accent">Z</span>EBRA
      </span>
    )}
  </span>
);
