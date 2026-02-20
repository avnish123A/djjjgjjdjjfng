
-- 1. Create atomic stock decrement function to prevent race conditions
CREATE OR REPLACE FUNCTION public.decrement_product_stock(
  p_product_id UUID,
  p_quantity INTEGER
)
RETURNS TABLE (success BOOLEAN, new_stock INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_stock INTEGER;
BEGIN
  -- Lock the row and get current stock
  SELECT stock INTO current_stock
  FROM products
  WHERE id = p_product_id
  FOR UPDATE;

  -- Check if sufficient stock
  IF current_stock IS NULL THEN
    RETURN QUERY SELECT FALSE, 0;
    RETURN;
  END IF;

  IF current_stock < p_quantity THEN
    RETURN QUERY SELECT FALSE, current_stock;
    RETURN;
  END IF;

  -- Update stock atomically
  UPDATE products
  SET stock = stock - p_quantity
  WHERE id = p_product_id;

  RETURN QUERY SELECT TRUE, (current_stock - p_quantity);
END;
$$;

-- 2. Tighten the customer_queries INSERT policy 
-- The current policy uses WITH CHECK (true) which is flagged
-- Replace with a more specific policy that still allows anonymous submissions
-- but validates that required fields are provided
DROP POLICY IF EXISTS "Anyone can submit queries" ON public.customer_queries;
CREATE POLICY "Anyone can submit queries"
ON public.customer_queries
FOR INSERT
WITH CHECK (
  email IS NOT NULL AND email != '' AND
  message IS NOT NULL AND message != ''
);
