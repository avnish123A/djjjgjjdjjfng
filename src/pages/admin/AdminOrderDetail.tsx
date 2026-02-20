import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Printer, CreditCard, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const allStatuses = ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

const statusColors: Record<string, string> = {
  placed: 'bg-muted text-muted-foreground',
  confirmed: 'bg-primary/10 text-primary',
  packed: 'bg-primary/20 text-primary',
  shipped: 'bg-success/10 text-success',
  delivered: 'bg-success/20 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

const paymentColors: Record<string, string> = {
  paid: 'bg-success/10 text-success',
  pending: 'bg-primary/10 text-primary',
  failed: 'bg-destructive/10 text-destructive',
  refunded: 'bg-muted text-muted-foreground',
};

/* ─── Copy Button Helper ─── */
const CopyButton: React.FC<{ text: string; label?: string }> = ({ text, label }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      title={`Copy ${label || ''}`}
    >
      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied' : ''}
    </button>
  );
};

/* ─── Format Address ─── */
const formatAddress = (addr: any): string => {
  if (!addr) return '—';
  const parts = [
    addr.address || addr.street || addr.address_line1,
    addr.address2 || addr.address_line2,
    addr.city,
    addr.state,
    addr.pincode || addr.postal_code,
    addr.country,
  ].filter(Boolean);
  return parts.join(', ') || '—';
};

const formatAddressLines = (addr: any): string[] => {
  if (!addr) return ['—'];
  const lines: string[] = [];
  if (addr.address || addr.street || addr.address_line1) lines.push(addr.address || addr.street || addr.address_line1);
  if (addr.address2 || addr.address_line2) lines.push(addr.address2 || addr.address_line2);
  const cityState = [addr.city, addr.state].filter(Boolean).join(', ');
  if (cityState) lines.push(cityState);
  if (addr.pincode || addr.postal_code) lines.push(addr.pincode || addr.postal_code);
  if (addr.country) lines.push(addr.country);
  return lines.length > 0 ? lines : ['—'];
};

const AdminOrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: orderItems = [] } = useQuery({
    queryKey: ['admin-order-items', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('order_items').select('*').eq('order_id', id!);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');

  React.useEffect(() => {
    if (order) {
      setStatus(order.order_status);
      setTrackingNumber(order.tracking_number || '');
      setCourierName(order.courier_name || '');
      setEstimatedDeliveryDate((order as any).estimated_delivery_date || '');
    }
  }, [order]);

  const updateStatusMutation = useMutation({
    mutationFn: async () => {
      const updateData: any = { order_status: status };
      if (status === 'shipped' && trackingNumber) {
        updateData.tracking_number = trackingNumber;
        updateData.courier_name = courierName;
      }
      if (estimatedDeliveryDate) {
        updateData.estimated_delivery_date = estimatedDeliveryDate;
      }
      const { error } = await supabase.from('orders').update(updateData).eq('id', id!);
      if (error) throw error;

      const eventMap: Record<string, string> = {
        shipped: 'order_shipped', delivered: 'order_delivered', cancelled: 'order_cancelled',
        confirmed: 'order_confirmed', packed: 'order_packed',
      };
      const event = eventMap[status];
      if (event) {
        supabase.functions.invoke('n8n-webhook', { body: { event, order_id: id } }).catch(() => {});
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success(`Order status updated to ${status}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const markPaidMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('orders').update({ payment_status: 'paid' }).eq('id', id!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      toast.success('Order marked as paid');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Order not found</p>
        <Button variant="outline" onClick={() => navigate('/admin/orders')} className="mt-4">Back to Orders</Button>
      </div>
    );
  }

  const address = order.shipping_address as any;
  const addressStr = formatAddress(address);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/orders')} className="p-2 hover:bg-secondary rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{order.order_number}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(order.order_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-4">Order Information</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Order Number</p>
                <p className="font-medium mt-1">{order.order_number}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium mt-1">{new Date(order.order_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment</p>
                <div className="mt-1">
                  <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium capitalize ${paymentColors[order.payment_status] || ''}`}>
                    {order.payment_status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Method</p>
                <p className="font-medium mt-1 uppercase">{order.payment_method}</p>
              </div>
              {(order as any).estimated_delivery_date && (
                <div>
                  <p className="text-muted-foreground">Est. Delivery</p>
                  <p className="font-medium mt-1 text-primary">{new Date((order as any).estimated_delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-4">Customer Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium mt-1">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center gap-2">
                  Email <CopyButton text={order.customer_email} label="email" />
                </p>
                <p className="font-medium mt-1">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center gap-2">
                  Phone <CopyButton text={order.customer_phone || ''} label="phone" />
                </p>
                <p className="font-medium mt-1">{order.customer_phone || '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center gap-2">
                  Shipping Address <CopyButton text={addressStr} label="address" />
                </p>
                <div className="font-medium mt-1 space-y-0.5">
                  {formatAddressLines(address).map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-semibold">Items ({orderItems.length})</h2>
            </div>
            {orderItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Product</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Size/Color</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Qty</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Price</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item: any) => (
                      <tr key={item.id} className="border-b border-border last:border-0">
                        <td className="px-6 py-4 text-sm font-medium">{item.title}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {item.size || '—'} / {item.color ? (
                            <span className="inline-block w-3 h-3 rounded-full border border-border align-middle" style={{ backgroundColor: item.color }} />
                          ) : '—'}
                        </td>
                        <td className="px-6 py-4 text-sm">{item.quantity}</td>
                        <td className="px-6 py-4 text-sm">₹{Number(item.price).toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm font-medium">₹{(Number(item.price) * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No items</div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            <h2 className="font-semibold">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{Number(order.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{Number(order.shipping) === 0 ? 'Free' : `₹${Number(order.shipping).toLocaleString()}`}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>-₹{Number(order.discount).toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>₹{Number(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Update Status</h2>
            <div className="space-y-2">
              <Label>Current Status</Label>
              <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium capitalize ${statusColors[order.order_status] || ''}`}>
                {order.order_status}
              </span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Change Status</Label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full h-10 px-3 border border-input rounded-md bg-background text-sm capitalize">
                {allStatuses.map(s => (<option key={s} value={s} className="capitalize">{s}</option>))}
              </select>
            </div>
            {/* Estimated Delivery Date */}
            <div className="space-y-2">
              <Label htmlFor="delivery-date">Estimated Delivery Date</Label>
              <Input
                id="delivery-date"
                type="date"
                value={estimatedDeliveryDate}
                onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">Set the expected delivery date for this order (shown to customer)</p>
            </div>

            {status === 'shipped' && (
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="space-y-2">
                  <Label htmlFor="tracking">Tracking Number</Label>
                  <Input id="tracking" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Enter tracking number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courier">Courier Name</Label>
                  <Input id="courier" value={courierName} onChange={(e) => setCourierName(e.target.value)} placeholder="e.g. BlueDart, Delhivery" />
                </div>
              </div>
            )}
            <Button className="w-full" onClick={() => updateStatusMutation.mutate()} disabled={updateStatusMutation.isPending}>
              {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
            </Button>
          </div>

          {/* Mark Paid */}
          {order.payment_status === 'pending' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <Button variant="outline" className="w-full gap-2" onClick={() => markPaidMutation.mutate()} disabled={markPaidMutation.isPending}>
                <CreditCard className="h-4 w-4" /> {markPaidMutation.isPending ? 'Processing...' : 'Mark as Paid'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
