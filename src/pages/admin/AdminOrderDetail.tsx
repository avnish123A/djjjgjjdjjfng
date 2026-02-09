import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Truck, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockOrders } from '@/data/admin-mock-data';
import { toast } from 'sonner';

const allStatuses = ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

const statusColors: Record<string, string> = {
  placed: 'bg-muted text-muted-foreground',
  confirmed: 'bg-accent/10 text-accent',
  packed: 'bg-accent/20 text-accent',
  shipped: 'bg-success/10 text-success',
  delivered: 'bg-success/20 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

const paymentColors: Record<string, string> = {
  paid: 'bg-success/10 text-success',
  pending: 'bg-accent/10 text-accent',
  failed: 'bg-destructive/10 text-destructive',
  refunded: 'bg-muted text-muted-foreground',
};

const AdminOrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = mockOrders.find(o => o.id === id);

  const [status, setStatus] = useState<string>(order?.orderStatus || 'placed');
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || '');
  const [courierName, setCourierName] = useState(order?.courierName || '');

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Order not found</p>
        <Button variant="outline" onClick={() => navigate('/admin/orders')} className="mt-4">
          Back to Orders
        </Button>
      </div>
    );
  }

  const handleStatusUpdate = () => {
    // TODO: API call to update order status
    toast.success(`Order status updated to ${status}`);
  };

  const handleMarkPaid = () => {
    // TODO: API call to mark order as paid
    toast.success('Order marked as paid');
  };

  const handleAddTracking = () => {
    if (!trackingNumber) {
      toast.error('Enter a tracking number');
      return;
    }
    // TODO: API call
    toast.success('Tracking number added');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/orders')} className="p-2 hover:bg-secondary rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(order.orderDate).toLocaleDateString('en-IN', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-4">Order Information</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Order Number</p>
                <p className="font-medium mt-1">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium mt-1">{new Date(order.orderDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment</p>
                <div className="mt-1">
                  <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium capitalize ${paymentColors[order.paymentStatus]}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Method</p>
                <p className="font-medium mt-1 uppercase">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-4">Customer Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium mt-1">{order.customerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium mt-1">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium mt-1">{order.customerPhone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Shipping Address</p>
                <p className="font-medium mt-1">
                  {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-semibold">Items ({order.items.length})</h2>
            </div>
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
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-6 py-4 text-sm font-medium">{item.title}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {item.size || '—'} / {item.color ? (
                        <span className="inline-block w-3 h-3 rounded-full border border-border align-middle" style={{ backgroundColor: item.color }} />
                      ) : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">{item.quantity}</td>
                    <td className="px-6 py-4 text-sm">₹{item.price}</td>
                    <td className="px-6 py-4 text-sm font-medium">₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Update Status</h2>

            <div className="space-y-2">
              <Label>Current Status</Label>
              <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium capitalize ${statusColors[order.orderStatus]}`}>
                {order.orderStatus}
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Change Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-10 px-3 border border-input rounded-md bg-background text-sm capitalize"
              >
                {allStatuses.map(s => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
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
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleAddTracking}>
                  <Truck className="h-4 w-4" /> Add Tracking
                </Button>
              </div>
            )}

            <Button variant="accent" className="w-full" onClick={handleStatusUpdate}>
              Update Status
            </Button>
          </div>

          {/* Mark Paid */}
          {order.paymentStatus === 'pending' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <Button variant="outline" className="w-full gap-2" onClick={handleMarkPaid}>
                <CreditCard className="h-4 w-4" /> Mark as Paid
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
