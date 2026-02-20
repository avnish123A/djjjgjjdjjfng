
-- Add auth_user_id to customers table to link Supabase Auth users to customer records
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS auth_user_id uuid UNIQUE;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_customers_auth_user_id ON public.customers(auth_user_id);

-- Allow authenticated customers to read their own customer record
CREATE POLICY "Customers can read own record"
ON public.customers
FOR SELECT
USING (auth.uid() = auth_user_id);

-- Allow authenticated customers to update their own profile
CREATE POLICY "Customers can update own record"
ON public.customers
FOR UPDATE
USING (auth.uid() = auth_user_id);

-- Allow customers to read their own orders (via customer_id linked to their customer record)
CREATE POLICY "Customers can read own orders"
ON public.orders
FOR SELECT
USING (
  customer_id IN (
    SELECT id FROM public.customers WHERE auth_user_id = auth.uid()
  )
);

-- Allow customers to update their own orders (for cancellation)
CREATE POLICY "Customers can update own orders"
ON public.orders
FOR UPDATE
USING (
  customer_id IN (
    SELECT id FROM public.customers WHERE auth_user_id = auth.uid()
  )
);

-- Allow customers to read their own order items
CREATE POLICY "Customers can read own order items"
ON public.order_items
FOR SELECT
USING (
  order_id IN (
    SELECT id FROM public.orders WHERE customer_id IN (
      SELECT id FROM public.customers WHERE auth_user_id = auth.uid()
    )
  )
);

-- Allow inserting customers during signup (service role handles this via edge function)
-- Also allow authenticated users to insert their own customer record
CREATE POLICY "Users can insert own customer record"
ON public.customers
FOR INSERT
WITH CHECK (auth.uid() = auth_user_id);
