import { cn } from '@/lib/utils';
interface LogoProps { className?: string; variant?: 'dark' | 'light'; showWordmark?: boolean }
/** Forward-sweeping zebra ribbons form a shopping basket, without an enclosing badge. */
export const LogoMark = ({ className, variant = 'dark' }: { className?: string; variant?: 'dark' | 'light' }) => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={cn('h-9 w-9 shrink-0', className)}>
    <g className={variant === 'light' ? 'fill-current' : 'fill-primary'}>
      <path d="M4 9h8c3 0 5 2 6 5l2 6-7 4-3-9H4zM22 10h10L17 33l-3-8zM38 10h11L19 40l-3-5zM55 10h6L24 44H14zM24 46l36-21-4 13-29 12zM17 51h37l-3 5H19z"/>
      <circle cx="23" cy="61" r="3"/><circle cx="48" cy="61" r="3"/>
    </g>
  </svg>
);
export const Logo = ({ className, variant = 'dark', showWordmark = true }: LogoProps) => (
  <span className={cn('inline-flex items-center gap-2', variant === 'light' ? 'text-structure-foreground' : 'text-foreground', className)}>
    <LogoMark variant={variant} />
    {showWordmark && <span className="font-display text-xl sm:text-2xl leading-none">Cart<span className={variant === 'light' ? 'text-brand-lavender' : 'text-primary'}>Zebra</span></span>}
  </span>
);
