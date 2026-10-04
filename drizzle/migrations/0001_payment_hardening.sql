-- 1. Stock function: server-only
REVOKE EXECUTE ON FUNCTION public.decrement_product_stock(uuid, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_product_stock(uuid, integer) TO service_role;

-- 2. Server-issued checkout authorization + stock release flag
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS checkout_token uuid DEFAULT gen_random_uuid();
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stock_released boolean NOT NULL DEFAULT false;

-- 3. No duplicate gateway orders / payments
CREATE UNIQUE INDEX IF NOT EXISTS payment_transactions_gateway_order_uniq
  ON public.payment_transactions (gateway, gateway_order_id) WHERE gateway_order_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS payment_transactions_gateway_payment_uniq
  ON public.payment_transactions (gateway, gateway_payment_id) WHERE gateway_payment_id IS NOT NULL;

-- 4. Payment status state machine
CREATE OR REPLACE FUNCTION public.enforce_payment_status_transition()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.payment_status IS DISTINCT FROM OLD.payment_status THEN
    IF OLD.payment_status = 'paid' AND NEW.payment_status NOT IN ('refunded','partially_refunded') THEN
      RAISE EXCEPTION 'Invalid payment status change: % -> %', OLD.payment_status, NEW.payment_status;
    END IF;
    IF OLD.payment_status IN ('refunded','cancelled') THEN
      RAISE EXCEPTION 'Invalid payment status change: % -> %', OLD.payment_status, NEW.payment_status;
    END IF;
    IF OLD.payment_status = 'partially_refunded' AND NEW.payment_status <> 'refunded' THEN
      RAISE EXCEPTION 'Invalid payment status change: % -> %', OLD.payment_status, NEW.payment_status;
    END IF;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS orders_payment_status_transition ON public.orders;
CREATE TRIGGER orders_payment_status_transition BEFORE UPDATE OF payment_status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.enforce_payment_status_transition();

-- 5. Idempotent stock release for failed/cancelled online payments
CREATE OR REPLACE FUNCTION public.release_order_stock(p_order_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE released boolean;
BEGIN
  UPDATE orders SET stock_released = true
   WHERE id = p_order_id AND stock_released = false AND payment_status <> 'paid'
  RETURNING true INTO released;
  IF released IS NULL THEN RETURN false; END IF;
  UPDATE products p SET stock = p.stock + oi.quantity
    FROM order_items oi WHERE oi.order_id = p_order_id AND oi.product_id = p.id;
  RETURN true;
END $$;
REVOKE EXECUTE ON FUNCTION public.release_order_stock(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.release_order_stock(uuid) TO service_role;