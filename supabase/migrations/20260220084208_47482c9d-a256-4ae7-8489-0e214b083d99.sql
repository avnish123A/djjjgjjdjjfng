
-- Create site_pages CMS table
CREATE TABLE public.site_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  seo_title text,
  seo_description text,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

-- Anyone can read published pages
CREATE POLICY "Anyone can read published pages"
ON public.site_pages FOR SELECT
USING (is_published = true);

-- Admins can do everything
CREATE POLICY "Admins can read all pages"
ON public.site_pages FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert pages"
ON public.site_pages FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update pages"
ON public.site_pages FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete pages"
ON public.site_pages FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_site_pages_updated_at
BEFORE UPDATE ON public.site_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add inventory management fields to products
ALTER TABLE public.products
ADD COLUMN low_stock_threshold integer NOT NULL DEFAULT 5,
ADD COLUMN track_inventory boolean NOT NULL DEFAULT true;

-- Enable realtime for products
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;

-- Seed existing policy pages so they appear in admin immediately
INSERT INTO public.site_pages (slug, title, content, seo_title, seo_description, is_published)
VALUES
  ('privacy-policy', 'Privacy Policy', '', 'Privacy Policy - EkamGift', 'Read about how EkamGift handles your personal data and privacy.', true),
  ('terms-conditions', 'Terms & Conditions', '', 'Terms & Conditions - EkamGift', 'Read the terms and conditions for using EkamGift.', true),
  ('return-policy', 'Return & Refund Policy', '', 'Return Policy - EkamGift', 'Learn about EkamGift return and refund policies.', true),
  ('shipping-policy', 'Shipping Policy', '', 'Shipping Policy - EkamGift', 'Learn about EkamGift shipping and delivery options.', true);
