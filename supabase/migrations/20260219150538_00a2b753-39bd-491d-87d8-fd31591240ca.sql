
-- Drop restrictive SELECT policies and recreate as permissive
DROP POLICY "Anyone can read active categories" ON public.categories;
CREATE POLICY "Anyone can read active categories" ON public.categories FOR SELECT USING (true);

DROP POLICY "Anyone can read products" ON public.products;
CREATE POLICY "Anyone can read products" ON public.products FOR SELECT USING (true);

DROP POLICY "Anyone can read active coupons" ON public.coupons;
CREATE POLICY "Anyone can read active coupons" ON public.coupons FOR SELECT USING (true);
