
-- Add estimated delivery date to orders table for admin management
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS estimated_delivery_date date;
