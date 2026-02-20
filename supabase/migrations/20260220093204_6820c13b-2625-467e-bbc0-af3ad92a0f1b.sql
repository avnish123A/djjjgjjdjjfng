
-- Fix: Remove overly permissive SELECT policy and replace with service-role scoped approach
-- The service role key already bypasses RLS, so the USING(true) policy is unnecessary
DROP POLICY "Service role can read payment settings" ON public.payment_settings;
