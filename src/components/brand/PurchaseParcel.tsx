import { motion, useReducedMotion } from 'framer-motion';
import parcel from '@/assets/checkout-parcel.jpg';

/** Shared purchase artwork; decorative only, never a statement of order status. */
export function PurchaseParcel({ compact = false }: { compact?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <div className={compact ? 'purchase-parcel purchase-parcel-compact' : 'purchase-parcel'} aria-hidden="true">
      {!compact && (
        <svg className="purchase-orbits" viewBox="0 0 480 320" fill="none">
          <motion.path d="M40 180C85 280 408 270 438 128" className="purchase-orbit-coral" strokeWidth="2" strokeDasharray="5 9" initial={reduced ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: reduced ? 0 : 0.7 }} />
          <motion.path d="M72 75C160 5 440 42 427 201" className="purchase-orbit-indigo" strokeWidth="1.5" initial={reduced ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.1 }} />
        </svg>
      )}
      <motion.img src={parcel} width={1024} height={768} alt="" initial={reduced ? false : { opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: reduced ? 0 : 0.35 }} />
    </div>
  );
}