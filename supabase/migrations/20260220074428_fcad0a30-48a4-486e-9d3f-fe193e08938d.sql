
-- Create customer_queries table
CREATE TABLE public.customer_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  source_form TEXT NOT NULL DEFAULT 'contact',
  status TEXT NOT NULL DEFAULT 'new',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.customer_queries ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (for guest form submissions)
CREATE POLICY "Anyone can submit queries"
  ON public.customer_queries
  FOR INSERT
  WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can read queries"
  ON public.customer_queries
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update (mark as read, reply, etc.)
CREATE POLICY "Admins can update queries"
  ON public.customer_queries
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Admins can delete queries"
  ON public.customer_queries
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Indexes for performance
CREATE INDEX idx_customer_queries_email ON public.customer_queries (email);
CREATE INDEX idx_customer_queries_created_at ON public.customer_queries (created_at DESC);
CREATE INDEX idx_customer_queries_status ON public.customer_queries (status);
CREATE INDEX idx_customer_queries_source_form ON public.customer_queries (source_form);

-- Trigger for updated_at
CREATE TRIGGER update_customer_queries_updated_at
  BEFORE UPDATE ON public.customer_queries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for instant admin updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_queries;
