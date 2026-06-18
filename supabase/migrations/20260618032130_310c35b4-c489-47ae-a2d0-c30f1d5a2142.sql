CREATE POLICY "Admins can read payment settings"
  ON public.payment_settings FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));