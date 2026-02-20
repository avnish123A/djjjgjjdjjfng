
-- Add product_type to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_type text NOT NULL DEFAULT 'standard';

-- Create product_attributes table
CREATE TABLE public.product_attributes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  attribute_name text NOT NULL,
  attribute_label text NOT NULL,
  attribute_type text NOT NULL DEFAULT 'select', -- select, radio, dropdown, text
  is_required boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create product_attribute_values table
CREATE TABLE public.product_attribute_values (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attribute_id uuid NOT NULL REFERENCES public.product_attributes(id) ON DELETE CASCADE,
  value text NOT NULL,
  price_modifier numeric NOT NULL DEFAULT 0,
  stock_quantity integer NOT NULL DEFAULT 0,
  sku text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_product_attributes_product_id ON public.product_attributes(product_id);
CREATE INDEX idx_product_attribute_values_attribute_id ON public.product_attribute_values(attribute_id);
CREATE INDEX idx_products_product_type ON public.products(product_type);

-- Enable RLS
ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attribute_values ENABLE ROW LEVEL SECURITY;

-- RLS policies for product_attributes
CREATE POLICY "Anyone can read product attributes"
ON public.product_attributes FOR SELECT USING (true);

CREATE POLICY "Admins can insert product attributes"
ON public.product_attributes FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update product attributes"
ON public.product_attributes FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete product attributes"
ON public.product_attributes FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for product_attribute_values
CREATE POLICY "Anyone can read attribute values"
ON public.product_attribute_values FOR SELECT USING (true);

CREATE POLICY "Admins can insert attribute values"
ON public.product_attribute_values FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update attribute values"
ON public.product_attribute_values FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete attribute values"
ON public.product_attribute_values FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for instant updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.product_attributes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.product_attribute_values;
