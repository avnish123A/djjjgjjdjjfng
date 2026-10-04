import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Mail, Phone, Package, Truck, CheckCircle2, MapPin, ClipboardCheck, Box, AlertCircle, Loader2, ArrowRight, XCircle, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface TrackedOrder {
  id: string;
  order_number: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  created_at: string;
  tracking_number: string | null;
  courier_name: string | null;
  estimated_delivery_date?: string | null;
  ship_to?: { city: string; state: string; pincode: string } | null;
  customer_name: string;
  items: { title: string; price: number; quantity: number; image: string; color: string | null; size: string | null }[];
}

const steps = [
  { key: 'placed', label: 'Order placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: ClipboardCheck },
  { key: 'packed', label: 'Packed', icon: Box },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for delivery', icon: MapPin },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
] as const;

// Maps real stored statuses (incl. legacy names) to a timeline position
const statusIndex: Record<string, number> = {
  placed: 0, pending: 0, confirmed: 1, processing: 1, packed: 2, shipped: 3, out_for_delivery: 4, delivered: 5,
};

const statusMessage = (s: string) => ({
  placed: { title: 'We’ve received your order', body: 'We’ll confirm it shortly.' },
  pending: { title: 'We’ve received your order', body: 'We’ll confirm it shortly.' },
  confirmed: { title: 'Your order is confirmed', body: 'We’re getting it ready.' },
  processing: { title: 'Your order is confirmed', body: 'We’re getting it ready.' },
  packed: { title: 'Your order is packed', body: 'It will be handed to our courier soon.' },
  shipped: { title: 'Your order is on its way', body: 'It has left our warehouse.' },
  out_for_delivery: { title: 'Arriving today', body: 'Your order is out for delivery.' },
  delivered: { title: 'Delivered', body: 'We hope you love it.' },
  cancelled: { title: 'This order was cancelled', body: 'If you were charged, contact support and we’ll help.' },
}[s] || { title: 'Order update', body: '' });

const fmtDate = (d?: string | null) => {
  if (!d) return null;
  const t = new Date(d);
  return isNaN(t.getTime()) ? null : t.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

/* Abstract route motif: dotted path, moving parcel, destination pin — pure SVG/CSS */
const RouteVisual = () => {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 320 120" className="w-full max-w-[320px] h-auto" aria-hidden="true">
      <path id="route" d="M20 90 C 90 90, 90 30, 160 30 S 240 90, 300 60" fill="none" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="4 6" />
      <circle cx="20" cy="90" r="6" fill="hsl(var(--foreground))" />
      <g transform="translate(300 60)">
        <circle r="14" fill="hsl(var(--accent) / 0.15)" />
        <circle r="5" fill="hsl(var(--accent))" />
      </g>
      <g>
        <rect x="-9" y="-9" width="18" height="18" rx="3" fill="hsl(var(--card))" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
        <path d="M-9 -2 H9 M0 -9 V9" stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.5" />
        {!reduce && <animateMotion dur="6s" repeatCount="indefinite" rotate="0"><mpath href="#route" /></animateMotion>}
        {reduce && <animateTransform attributeName="transform" type="translate" values="160 30" dur="1s" fill="freeze" />}
      </g>
    </svg>
  );
};

const Timeline = ({ current }: { current: number }) => {
  const reduce = useReducedMotion();
  return (
    <ol className="relative grid grid-cols-1 sm:grid-cols-6 gap-0 sm:gap-2" aria-label="Order progress">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const Icon = step.icon;
        return (
          <li key={step.key} className="relative flex sm:flex-col items-start sm:items-center gap-3 sm:gap-2 pb-6 sm:pb-0 last:pb-0" aria-current={active ? 'step' : undefined}>
            {/* connector */}
            {i < steps.length - 1 && (
              <>
                <span className="sm:hidden absolute left-[15px] top-8 bottom-0 w-0.5 bg-border" />
                <span className="hidden sm:block absolute top-4 left-[calc(50%+18px)] right-[calc(-50%+18px)] h-0.5 bg-border" />
                {done && (
                  <motion.span
                    className="absolute bg-foreground sm:hidden left-[15px] top-8 bottom-0 w-0.5 origin-top"
                    initial={{ scaleY: reduce ? 1 : 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.3, delay: i * 0.08 }}
                  />
                )}
                {done && (
                  <motion.span
                    className="absolute bg-foreground hidden sm:block top-4 left-[calc(50%+18px)] right-[calc(-50%+18px)] h-0.5 origin-left"
                    initial={{ scaleX: reduce ? 1 : 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.3, delay: i * 0.08 }}
                  />
                )}
              </>
            )}
            <motion.span
              initial={reduce ? false : { scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25, delay: i * 0.06 }}
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors',
                done && 'bg-foreground border-foreground text-background',
                active && 'bg-accent border-accent text-accent-foreground ring-4 ring-accent/20',
                !done && !active && 'bg-card border-border text-muted-foreground',
              )}
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              {active && !reduce && <span className="absolute inset-0 rounded-full ring-2 ring-accent/40 animate-ping" />}
            </motion.span>
            <span className={cn('pt-1.5 sm:pt-0 text-sm sm:text-xs sm:text-center font-medium', done || active ? 'text-foreground' : 'text-muted-foreground')}>
              {step.label}
              {active && <span className="sm:block sm:mt-0.5 ml-2 sm:ml-0 text-[11px] font-semibold text-accent">Current</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TrackOrder = () => {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [touched, setTouched] = useState({ email: false, phone: false });
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<TrackedOrder[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<{ kind: 'notfound' | 'failed' | 'invalid'; msg: string } | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const reqId = useRef(0);
  const refreshInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (refreshInterval.current) clearInterval(refreshInterval.current); reqId.current++; }, []);

  const emailErr = !email.trim() ? 'Enter the email you used at checkout' : !emailRe.test(email.trim()) ? 'That email looks incomplete' : null;
  const phoneDigits = phone.replace(/\D/g, '');
  const phoneErr = !phone.trim() ? 'Enter the mobile number you used at checkout' : phoneDigits.length < 10 ? 'Enter your 10-digit mobile number' : null;

  const fetchOrders = useCallback(async (emailVal: string, phoneVal: string, silent = false) => {
    const id = ++reqId.current;
    if (!silent) setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('track-order', { body: { email: emailVal, phone: phoneVal } });
      if (id !== reqId.current) return; // stale response
      // 404 from the function means "no match" — not a failure
      const status = (fnError as any)?.context?.status;
      if (status === 404 || (data?.error && /no orders/i.test(data.error))) {
        if (!silent) { setOrders(null); setError({ kind: 'notfound', msg: 'We couldn’t find an order with these details.' }); }
        return;
      }
      if (status === 429) { if (!silent) setError({ kind: 'failed', msg: 'Too many attempts. Please wait a minute and try again.' }); return; }
      if (fnError || data?.error) throw fnError || new Error(data.error);
      const list: TrackedOrder[] = Array.isArray(data?.orders) ? data.orders : [];
      if (list.length === 0) { if (!silent) setError({ kind: 'notfound', msg: 'We couldn’t find an order with these details.' }); return; }
      setOrders(list);
      setSelectedId(prev => (prev && list.some(o => o.id === prev) ? prev : list[0].id));
      if (!silent) setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }), 80);
    } catch (err) {
      console.error('[TrackOrder] lookup failed:', err);
      if (!silent && id === reqId.current) setError({ kind: 'failed', msg: 'We couldn’t reach our servers. Please try again.' });
    } finally {
      if (!silent && id === reqId.current) setLoading(false);
    }
  }, [reduce]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, phone: true });
    if (emailErr || phoneErr) return;
    setError(null);
    setOrders(null);
    const em = email.trim().toLowerCase();
    const ph = phone.trim();
    await fetchOrders(em, ph);
    if (refreshInterval.current) clearInterval(refreshInterval.current);
    refreshInterval.current = setInterval(() => fetchOrders(em, ph, true), 60_000);
  };

  const order = orders?.find(o => o.id === selectedId) || null;
  const cancelled = order?.order_status === 'cancelled';
  const current = order ? statusIndex[order.order_status] ?? 0 : 0;
  const msg = order ? statusMessage(order.order_status) : null;
  const eta = order && !cancelled && order.order_status !== 'delivered' ? fmtDate(order.estimated_delivery_date) : null;

  const inputCls = (bad: boolean) =>
    cn('w-full h-12 pl-11 pr-4 rounded-xl border bg-background text-base sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 transition-colors', bad ? 'border-destructive' : 'border-border');

  return (
    <main className="bg-secondary/40 min-h-[70vh]">
      {/* Compact header + form */}
      <section className="container mx-auto px-4 pt-8 pb-6 lg:pt-12 max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          <div>
            <p className="text-xs font-semibold text-accent mb-2">Order tracking</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Where’s my order?</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">Enter the email and mobile number you used at checkout to see live status.</p>
            <div className="hidden lg:block mt-8"><RouteVisual /></div>
          </div>

          <form onSubmit={handleTrack} noValidate className="bg-card border border-border rounded-2xl p-5 sm:p-7 space-y-4">
            <div>
              <label htmlFor="tr-email" className="block text-[13px] font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
                <input id="tr-email" type="email" inputMode="email" autoComplete="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} onBlur={() => email && setTouched(t => ({ ...t, email: true }))}
                  placeholder="e.g. priya@gmail.com" className={inputCls(touched.email && !!emailErr)}
                  aria-invalid={touched.email && !!emailErr} aria-describedby={touched.email && emailErr ? 'tr-email-err' : undefined} />
              </div>
              {touched.email && emailErr && <p id="tr-email-err" className="text-xs text-destructive mt-1.5">{emailErr}</p>}
            </div>
            <div>
              <label htmlFor="tr-phone" className="block text-[13px] font-medium mb-1.5">Mobile number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
                <input id="tr-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone}
                  onChange={(e) => setPhone(e.target.value)} onBlur={() => phone && setTouched(t => ({ ...t, phone: true }))}
                  placeholder="e.g. 98765 43210" className={inputCls(touched.phone && !!phoneErr)}
                  aria-invalid={touched.phone && !!phoneErr} aria-describedby={touched.phone && phoneErr ? 'tr-phone-err' : undefined} />
              </div>
              {touched.phone && phoneErr && <p id="tr-phone-err" className="text-xs text-destructive mt-1.5">{phoneErr}</p>}
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 rounded-full font-semibold">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Finding your order…</> : <>Track order <ArrowRight className="h-4 w-4 ml-1.5" /></>}
            </Button>
            <AnimatePresence>
              {error && (
                <motion.div role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm flex gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-destructive" />
                  <div>
                    <p className="font-medium">{error.msg}</p>
                    {error.kind === 'notfound' && <p className="text-muted-foreground text-xs mt-1">Check both details match your order confirmation exactly, or <Link to="/contact" className="underline">contact support</Link>.</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5"><Headphones className="h-3 w-3" /> Need help? <Link to="/contact" className="underline hover:text-foreground">Contact us</Link></p>
          </form>
        </div>
      </section>

      {/* Loading skeleton */}
      {loading && (
        <section className="container mx-auto px-4 pb-16 max-w-5xl" aria-busy="true">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 animate-pulse">
            <div className="h-6 w-56 bg-secondary rounded" />
            <div className="h-4 w-40 bg-secondary rounded" />
            <div className="h-16 bg-secondary rounded-xl" />
          </div>
        </section>
      )}

      {/* Results */}
      <AnimatePresence>
        {!loading && order && msg && (
          <motion.section
            ref={resultsRef}
            key={order.id}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="container mx-auto px-4 pb-16 max-w-5xl space-y-4 scroll-mt-24"
          >
            {orders && orders.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Your orders">
                {orders.map(o => (
                  <button key={o.id} role="tab" aria-selected={o.id === order.id} onClick={() => setSelectedId(o.id)}
                    className={cn('shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-colors',
                      o.id === order.id ? 'bg-foreground text-background border-foreground' : 'bg-card border-border text-muted-foreground hover:text-foreground')}>
                    {o.order_number}
                  </button>
                ))}
              </div>
            )}

            <div className="bg-card border border-border rounded-2xl p-5 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
                <div>
                  <h2 className={cn('text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2', cancelled && 'text-destructive')}>
                    {cancelled && <XCircle className="h-5 w-5" />} {msg.title}
                  </h2>
                  {msg.body && <p className="text-sm text-muted-foreground mt-1">{msg.body}</p>}
                </div>
                {eta && (
                  <div className="rounded-xl bg-secondary px-4 py-2.5 text-sm shrink-0">
                    <p className="text-[11px] text-muted-foreground">Estimated delivery</p>
                    <p className="font-semibold">{eta}</p>
                  </div>
                )}
              </div>

              {!cancelled && <Timeline current={current} />}

              <dl className="mt-6 pt-5 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><dt className="text-[11px] text-muted-foreground">Order</dt><dd className="font-semibold">{order.order_number}</dd></div>
                <div><dt className="text-[11px] text-muted-foreground">Placed</dt><dd className="font-medium">{fmtDate(order.created_at) || '—'}</dd></div>
                {order.ship_to?.city && (
                  <div><dt className="text-[11px] text-muted-foreground">Delivering to</dt><dd className="font-medium">{order.ship_to.city}{order.ship_to.pincode ? ` – ${order.ship_to.pincode}` : ''}</dd></div>
                )}
                {order.tracking_number && (
                  <div><dt className="text-[11px] text-muted-foreground">{order.courier_name || 'Tracking'}</dt><dd className="font-medium break-all">{order.tracking_number}</dd></div>
                )}
              </dl>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 sm:p-8">
              <h3 className="font-semibold mb-4">Items</h3>
              <ul className="space-y-3">
                {order.items.map((item, i) => (
                  <li key={i} className="flex gap-3 items-center">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary shrink-0">
                      {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" /> : <Package className="h-5 w-5 m-auto mt-4 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                      <p className="text-xs text-muted-foreground">Qty {item.quantity}{item.color ? ` · ${item.color}` : ''}{item.size ? ` · ${item.size}` : ''}</p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border mt-5 pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">{formatPrice(order.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{Number(order.shipping) === 0 ? 'Free' : formatPrice(order.shipping)}</span></div>
                {Number(order.discount) > 0 && <div className="flex justify-between text-success"><span>Discount</span><span className="tabular-nums">−{formatPrice(order.discount)}</span></div>}
                <div className="flex justify-between font-bold text-base pt-2 border-t border-border"><span>Total</span><span className="tabular-nums">{formatPrice(order.total)}</span></div>
                <p className="text-xs text-muted-foreground">
                  {order.payment_method === 'cod' ? 'Cash on delivery' : 'Paid online'} · Payment {order.payment_status}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <Button asChild className="rounded-full px-8"><Link to="/products">Continue shopping</Link></Button>
              <Button asChild variant="outline" className="rounded-full px-8"><Link to="/contact">Get help with this order</Link></Button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
};

export default TrackOrder;
