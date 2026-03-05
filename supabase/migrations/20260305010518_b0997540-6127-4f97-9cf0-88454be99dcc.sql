
-- Add idempotency_key column to orders table for deduplication
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS idempotency_key text UNIQUE;

-- Create index for fast idempotency lookups
CREATE INDEX IF NOT EXISTS idx_orders_idempotency_key ON public.orders(idempotency_key) WHERE idempotency_key IS NOT NULL;
