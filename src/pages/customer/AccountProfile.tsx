import { useState, useEffect } from 'react';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { UserCircle, Save } from 'lucide-react';
import { formatPrice } from '@/lib/format';

const AccountProfile = () => {
  const { customer, refreshCustomer } = useCustomerAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setName(customer.name || '');
      setPhone(customer.phone || '');
    }
  }, [customer]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    setSaving(true);

    const { error } = await supabase
      .from('customers')
      .update({ name, phone })
      .eq('id', customer.id);

    setSaving(false);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update profile.', variant: 'destructive' });
    } else {
      await refreshCustomer();
      toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account details</p>
      </div>

      {/* Profile Card */}
      <div className="bg-background border border-border rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <UserCircle className="h-8 w-8 text-accent" />
          </div>
          <div>
            <h2 className="font-bold text-lg">{customer?.name}</h2>
            <p className="text-sm text-muted-foreground">{customer?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input value={customer?.email || ''} disabled className="bg-secondary" />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="bg-accent hover:bg-accent/90 text-white rounded-full"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </span>
            )}
          </Button>
        </form>
      </div>

      {/* Account Stats */}
      <div className="bg-background border border-border rounded-2xl p-6">
        <h3 className="font-bold mb-4">Account Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Orders</p>
            <p className="text-lg font-bold">{customer?.total_orders || 0}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="text-lg font-bold">{formatPrice(customer?.total_spent || 0)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Member Since</p>
            <p className="text-lg font-bold">2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;
