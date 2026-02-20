
-- Add COD extra charge fields to payment_settings
ALTER TABLE public.payment_settings
ADD COLUMN IF NOT EXISTS cod_extra_charge numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS cod_min_order numeric NOT NULL DEFAULT 0;

-- Add cod_extra_charge to orders table for record keeping
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS cod_extra_charge numeric NOT NULL DEFAULT 0;

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_payment_settings_gateway_name ON public.payment_settings(gateway_name);
CREATE INDEX IF NOT EXISTS idx_payment_settings_is_enabled ON public.payment_settings(is_enabled);
