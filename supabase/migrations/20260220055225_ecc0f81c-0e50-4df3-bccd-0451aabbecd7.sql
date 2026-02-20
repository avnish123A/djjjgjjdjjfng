-- Composite index for fast order tracking lookups by email + phone
CREATE INDEX IF NOT EXISTS idx_orders_email_phone ON public.orders (customer_email, customer_phone);
