
-- Payment settings table for gateway configuration
CREATE TABLE public.payment_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_name text NOT NULL UNIQUE CHECK (gateway_name IN ('razorpay', 'cashfree', 'cod')),
  is_enabled boolean NOT NULL DEFAULT false,
  environment text NOT NULL DEFAULT 'test' CHECK (environment IN ('test', 'live')),
  key_id text DEFAULT '',
  key_secret text DEFAULT '',
  webhook_secret text DEFAULT '',
  priority integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage payment settings
CREATE POLICY "Admins can read payment settings"
  ON public.payment_settings FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert payment settings"
  ON public.payment_settings FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update payment settings"
  ON public.payment_settings FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete payment settings"
  ON public.payment_settings FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can read (for edge functions)
CREATE POLICY "Service role can read payment settings"
  ON public.payment_settings FOR SELECT
  USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_payment_settings_updated_at
  BEFORE UPDATE ON public.payment_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default gateway entries
INSERT INTO public.payment_settings (gateway_name, is_enabled, environment, priority)
VALUES 
  ('razorpay', false, 'test', 1),
  ('cashfree', false, 'test', 2),
  ('cod', true, 'test', 3);

-- Payment transactions log for tracking & idempotency
CREATE TABLE public.payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id),
  gateway text NOT NULL,
  gateway_order_id text,
  gateway_payment_id text,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'pending', 'paid', 'failed', 'refunded')),
  raw_response jsonb DEFAULT '{}',
  verified boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read payment transactions"
  ON public.payment_transactions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage payment transactions"
  ON public.payment_transactions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
