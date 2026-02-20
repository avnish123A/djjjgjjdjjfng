import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreditCard, Eye, EyeOff, Loader2, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle2, Webhook } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GatewayConfig {
  id: string;
  gateway_name: string;
  is_enabled: boolean;
  environment: 'test' | 'live';
  key_id: string;
  key_secret: string;
  webhook_secret: string;
  priority: number;
}

const gatewayMeta: Record<string, { label: string; desc: string; color: string }> = {
  razorpay: { label: 'Razorpay', desc: 'Accept UPI, Cards, Net Banking, Wallets', color: 'text-blue-600' },
  cashfree: { label: 'Cashfree', desc: 'Accept UPI, Cards, Net Banking, EMI', color: 'text-purple-600' },
  cod: { label: 'Cash on Delivery', desc: 'No online payment required', color: 'text-green-600' },
};

const AdminPayments: React.FC = () => {
  const [gateways, setGateways] = useState<GatewayConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [editState, setEditState] = useState<Record<string, Partial<GatewayConfig>>>({});

  useEffect(() => {
    fetchGateways();
  }, []);

  const fetchGateways = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payment_settings')
      .select('*')
      .order('priority', { ascending: true });
    if (error) {
      toast.error('Failed to load payment settings');
    } else {
      setGateways((data as any[]) || []);
    }
    setLoading(false);
  };

  const getEditValue = (gw: GatewayConfig, field: keyof GatewayConfig) => {
    return editState[gw.id]?.[field] ?? gw[field];
  };

  const setEditField = (id: string, field: string, value: any) => {
    setEditState(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleToggleEnabled = async (gw: GatewayConfig) => {
    const newVal = !gw.is_enabled;
    const { error } = await supabase
      .from('payment_settings')
      .update({ is_enabled: newVal })
      .eq('id', gw.id);
    if (error) {
      toast.error('Failed to update');
    } else {
      setGateways(prev => prev.map(g => g.id === gw.id ? { ...g, is_enabled: newVal } : g));
      toast.success(`${gatewayMeta[gw.gateway_name]?.label} ${newVal ? 'enabled' : 'disabled'}`);
    }
  };

  const handleSave = async (gw: GatewayConfig) => {
    const changes = editState[gw.id];
    if (!changes || Object.keys(changes).length === 0) return;

    setSaving(gw.id);
    const { error } = await supabase
      .from('payment_settings')
      .update(changes)
      .eq('id', gw.id);

    if (error) {
      toast.error('Failed to save');
    } else {
      setGateways(prev => prev.map(g => g.id === gw.id ? { ...g, ...changes } as GatewayConfig : g));
      setEditState(prev => { const n = { ...prev }; delete n[gw.id]; return n; });
      toast.success(`${gatewayMeta[gw.gateway_name]?.label} settings saved`);
    }
    setSaving(null);
  };

  const hasChanges = (id: string) => {
    const changes = editState[id];
    return changes && Object.keys(changes).length > 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payment Gateways</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure payment methods for your store</p>
      </div>

      {gateways.map((gw) => {
        const meta = gatewayMeta[gw.gateway_name] || { label: gw.gateway_name, desc: '', color: '' };
        const isCod = gw.gateway_name === 'cod';
        const env = (getEditValue(gw, 'environment') as string) || 'test';
        const isLive = env === 'live';

        return (
          <div key={gw.id} className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <CreditCard className={`h-5 w-5 ${meta.color}`} />
                <div>
                  <h3 className="font-semibold">{meta.label}</h3>
                  <p className="text-xs text-muted-foreground">{meta.desc}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggleEnabled(gw)}
                className="flex items-center gap-2"
              >
                {gw.is_enabled ? (
                  <ToggleRight className="h-8 w-8 text-primary" />
                ) : (
                  <ToggleLeft className="h-8 w-8 text-muted-foreground" />
                )}
                <span className={`text-xs font-medium ${gw.is_enabled ? 'text-primary' : 'text-muted-foreground'}`}>
                  {gw.is_enabled ? 'Enabled' : 'Disabled'}
                </span>
              </button>
            </div>

            {/* Body — only show config for non-COD */}
            {!isCod && (
              <div className="px-6 py-5 space-y-4">
                {/* Environment Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Environment</label>
                    <p className="text-xs text-muted-foreground">Switch between test and production</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditField(gw.id, 'environment', 'test')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-l-lg border transition-colors ${
                        !isLive ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'border-border text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      🧪 Test
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditField(gw.id, 'environment', 'live')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-r-lg border transition-colors ${
                        isLive ? 'bg-green-100 border-green-300 text-green-800' : 'border-border text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      🚀 Live
                    </button>
                  </div>
                </div>

                {isLive && (
                  <div className="flex items-start gap-2 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg p-3 text-xs">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>Live mode uses production keys. Real payments will be processed.</span>
                  </div>
                )}

                {/* Key ID */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    {gw.gateway_name === 'razorpay' ? 'Key ID' : 'App ID'}
                  </label>
                  <input
                    type="text"
                    value={getEditValue(gw, 'key_id') as string}
                    onChange={(e) => setEditField(gw.id, 'key_id', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder={gw.gateway_name === 'razorpay' ? 'rzp_test_...' : 'your_app_id'}
                  />
                </div>

                {/* Key Secret */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    {gw.gateway_name === 'razorpay' ? 'Key Secret' : 'Secret Key'}
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets[`${gw.id}_secret`] ? 'text' : 'password'}
                      value={getEditValue(gw, 'key_secret') as string}
                      onChange={(e) => setEditField(gw.id, 'key_secret', e.target.value)}
                      className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecrets(p => ({ ...p, [`${gw.id}_secret`]: !p[`${gw.id}_secret`] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showSecrets[`${gw.id}_secret`] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Webhook Secret */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                    <Webhook className="h-3.5 w-3.5" /> Webhook Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets[`${gw.id}_webhook`] ? 'text' : 'password'}
                      value={getEditValue(gw, 'webhook_secret') as string}
                      onChange={(e) => setEditField(gw.id, 'webhook_secret', e.target.value)}
                      className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Optional — for webhook signature verification"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecrets(p => ({ ...p, [`${gw.id}_webhook`]: !p[`${gw.id}_webhook`] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showSecrets[`${gw.id}_webhook`] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Webhook URL info */}
                <div className="bg-secondary/70 rounded-lg p-3 text-xs space-y-1">
                  <p className="font-medium">Webhook URL:</p>
                  <code className="block text-[11px] break-all text-muted-foreground">
                    {`https://rwrznilwfczmichtfyyo.supabase.co/functions/v1/${gw.gateway_name}-webhook`}
                  </code>
                  <p className="text-muted-foreground">Add this URL in your {meta.label} dashboard webhook settings.</p>
                </div>

                {/* Save */}
                <div className="flex justify-end pt-1">
                  <Button
                    onClick={() => handleSave(gw)}
                    disabled={!hasChanges(gw.id) || saving === gw.id}
                    size="sm"
                    className="gap-1.5"
                  >
                    {saving === gw.id ? (
                      <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...</>
                    ) : (
                      <><CheckCircle2 className="h-3.5 w-3.5" /> Save Changes</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AdminPayments;
