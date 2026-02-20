-- Create hero_slides table
CREATE TABLE public.hero_slides (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  subtitle text DEFAULT '',
  description text DEFAULT '',
  image_url text DEFAULT '',
  cta_primary_text text DEFAULT '',
  cta_primary_link text DEFAULT '/products',
  cta_secondary_text text DEFAULT '',
  cta_secondary_link text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active hero slides"
ON public.hero_slides FOR SELECT
USING (true);

CREATE POLICY "Admins can insert hero slides"
ON public.hero_slides FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update hero slides"
ON public.hero_slides FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete hero slides"
ON public.hero_slides FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_hero_slides_updated_at
BEFORE UPDATE ON public.hero_slides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed a default slide from current settings
INSERT INTO public.hero_slides (title, subtitle, description, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, sort_order)
VALUES (
  'Gifts That Speak Louder',
  'The Art of Gifting',
  'Thoughtfully curated, beautifully wrapped. Discover premium gifts for every moment that matters.',
  'Explore Collection',
  '/products',
  'Personalize a Gift',
  '/products?category=personalized-gifts',
  0
);