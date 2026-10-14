import { motion, useReducedMotion } from 'framer-motion';
import parcel from '@/assets/experience/parcel-state.jpg';

/** Shared purchase artwork; decorative only, never a statement of order status. */
export function PurchaseParcel({ compact = false }: { compact?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <div className={compact ? 'purchase-parcel purchase-parcel-compact' : 'purchase-parcel'} aria-hidden="true">
      <motion.img src={parcel} width={1024} height={768} alt="" loading="lazy" initial={reduced ? false : { opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: reduced ? 0 : 0.35 }} />
    </div>
  );
}