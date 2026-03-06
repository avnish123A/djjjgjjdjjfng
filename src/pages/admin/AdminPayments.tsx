import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreditCard, Eye, EyeOff, Loader2, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle2, Webhook, Banknote, IndianRupee, ShieldAlert, Info, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GatewayConfig {
  id: string;
  gateway_name: string;
  is_enabled: boolean;
  environment: string;
  has_key_id: boolean;
  has_key_secret: boolean;
  has_webhook_secret: boolean;
  priority: number;
  cod_extra_charge: number;
  cod_min_order: number;
}

interface EditFields {
  is_enabled?: boolean;
  environment?: string;
  key_id?: string;
  key_secret?: string;
  webhook_secret?: string;
  cod_extra_charge?: number;
  cod_min_order?: number;
}

const gatewayMeta: Record<string, { label: string; desc: string; icon: React.ElementType; color: string }> = {
  razorpay: { label: 'Razorpay', desc: 'Accept UPI, Cards, Net Banking, Wallets', icon: CreditCard, color: 'text-blue-600' },
  cashfree: { label: 'Cashfree', desc: 'Accept UPI, Cards, Net Banking, EMI', icon: CreditCard, color: 'text-purple-600' },
  cod: { label: 'Cash on Delivery', desc: 'Collect payment on delivery', icon: Banknote, color: 'text-green-600' },
};

const AdminPayments: React.FC = () => {
  const [gateways, setGateways] = useState<GatewayConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [editState, setEditState] = useState<Record<string, EditFields>>({});

  useEffect(() => {
    fetchGateways();
  }, []);

  const callEdgeFunction = async (method: 'GET' | 'PUT', body?: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Please log in again');
      return null;
    }

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-payment-settings`;
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Request failed');
    }

    return res.json();
  };

  const fetchGateways = async () => {
    setLoading(true);
    try {
      const data = await callEdgeFunction('GET');
      setGateways(data || []);
    } catch {
      toast.error('Failed to load payment settings');
    }
    setLoading(false);
  };

  const getEditValue = (gw: GatewayConfig, field: string) => {
    const edit = editState[gw.id];
    if (edit && field in edit) return (edit as any)[field];
    if (field in gw) return (gw as any)[field];
    return '';
  };

  const setEditField = (id: string, field: string, value: any) => {
    setEditState(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleToggleEnabled = async (gw: GatewayConfig) => {
    const isCod = gw.gateway_name === 'cod';
    const newVal = !gw.is_enabled;

    if (newVal && !isCod) {
      const hasKeyId = editState[gw.id]?.key_id ? true : gw.has_key_id;
      const hasKeySecret = editState[gw.id]?.key_secret ? true : gw.has_key_secret;
      if (!hasKeyId || !hasKeySecret) {
        toast.error(`Please add API keys before enabling ${gatewayMeta[gw.gateway_name]?.label}`);
        return;
      }
    }

    try {
      await callEdgeFunction('PUT', { id: gw.id, changes: { is_enabled: newVal } });
      toast.success(`${gatewayMeta[gw.gateway_name]?.label} ${newVal ? 'enabled' : 'disabled'}`);
      await fetchGateways();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update');
    }
  };

  const validateGateway = (gw: GatewayConfig, changes: EditFields): string | null => {
    const isCod = gw.gateway_name === 'cod';

    if (isCod) {
      const extraCharge = Number(changes.cod_extra_charge ?? gw.cod_extra_charge);
      if (extraCharge < 0) return 'COD extra charge cannot be negative';
      if (extraCharge > 9999) return 'COD extra charge too high';
      const minOrder = Number(changes.cod_min_order ?? gw.cod_min_order);
      if (minOrder < 0) return 'COD minimum order cannot be negative';
      return null;
    }

    const env = (changes.environment ?? gw.environment) as string;
    const newKeyId = changes.key_id?.trim();

    // Check test/live key mismatch for Razorpay
    if (gw.gateway_name === 'razorpay' && newKeyId) {
      if (env === 'test' && !newKeyId.startsWith('rzp_test_')) {
        return 'Test mode requires keys starting with "rzp_test_". Are you using live keys in test mode?';
      }
      if (env === 'live' && !newKeyId.startsWith('rzp_live_')) {
        return 'Live mode requires keys starting with "rzp_live_". Are you using test keys in live mode?';
      }
    }

    if (gw.is_enabled) {
      const hasKeyId = newKeyId ? true : gw.has_key_id;
      const hasKeySecret = changes.key_secret?.trim() ? true : gw.has_key_secret;
      if (!hasKeyId || !hasKeySecret) {
        return 'API keys are required while gateway is enabled';
      }
    }

    return null;
  };

  const handleSave = async (gw: GatewayConfig) => {
    const changes = editState[gw.id];
    if (!changes || Object.keys(changes).length === 0) return;

    const validationError = validateGateway(gw, changes);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSaving(gw.id);
    try {
      await callEdgeFunction('PUT', { id: gw.id, changes });
      // Re-fetch from server to ensure immediate accurate reflection
      setEditState(prev => { const n = { ...prev }; delete n[gw.id]; return n; });
      toast.success(`${gatewayMeta[gw.gateway_name]?.label} settings saved`);
      await fetchGateways();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save');
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
        <p className="text-sm text-muted-foreground mt-1">Configure payment methods for your store. Changes apply to checkout instantly.</p>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-xs">
        <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Security Notice</p>
          <p>API keys are stored securely and never exposed to the frontend. Only server-side functions use them for payment processing.</p>
        </div>
      </div>

      {gateways.map((gw) => {
        const meta = gatewayMeta[gw.gateway_name] || { label: gw.gateway_name, desc: '', icon: CreditCard, color: '' };
        const IconComp = meta.icon;
        const isCod = gw.gateway_name === 'cod';
        const env = (getEditValue(gw, 'environment') as string) || 'test';
        const isLive = env === 'live';

        return (
          <div key={gw.id} className={`bg-card border rounded-xl overflow-hidden transition-all ${
            gw.is_enabled ? 'border-primary/30 shadow-sm' : 'border-border opacity-80'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  gw.is_enabled ? 'bg-primary/10' : 'bg-secondary'
                }`}>
                  <IconComp className={`h-4.5 w-4.5 ${gw.is_enabled ? meta.color : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{meta.label}</h3>
                    {!isCod && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isLive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
                      }`}>
                        {isLive ? '🚀 LIVE' : '🧪 TEST'}
                      </span>
                    )}
                  </div>
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

            {/* COD Configuration */}
            {isCod && (
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                      <IndianRupee className="h-3.5 w-3.5" /> Extra Charge
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={getEditValue(gw, 'cod_extra_charge') as number}
                        onChange={(e) => setEditField(gw.id, 'cod_extra_charge', Math.max(0, Number(e.target.value)))}
                        className="w-full pl-7 pr-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="0"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">Set to 0 for no extra charge</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Minimum Order for COD</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={getEditValue(gw, 'cod_min_order') as number}
                        onChange={(e) => setEditField(gw.id, 'cod_min_order', Math.max(0, Number(e.target.value)))}
                        className="w-full pl-7 pr-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="0"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">Set to 0 for no minimum</p>
                  </div>
                </div>

                {Number(getEditValue(gw, 'cod_extra_charge')) > 0 && (
                  <div className="flex items-start gap-2 bg-secondary/70 rounded-lg p-3 text-xs">
                    <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Customers will see "Cash on Delivery (+₹{Number(getEditValue(gw, 'cod_extra_charge'))}&nbsp;fee)" at checkout. This charge is added to their order total.
                    </span>
                  </div>
                )}

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

            {/* Gateway Configuration (Razorpay / Cashfree) */}
            {!isCod && (
              <div className="px-6 py-5 space-y-4">
                {/* Environment Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Environment</label>
                    <p className="text-xs text-muted-foreground">Switch between test and production</p>
                  </div>
                  <div className="flex items-center gap-0">
                    <button
                      type="button"
                      onClick={() => setEditField(gw.id, 'environment', 'test')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-l-lg border transition-colors ${
                        !isLive ? 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/40 dark:border-yellow-700 dark:text-yellow-400' : 'border-border text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      🧪 Test
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditField(gw.id, 'environment', 'live')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-r-lg border-y border-r transition-colors ${
                        isLive ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/40 dark:border-green-700 dark:text-green-400' : 'border-border text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      🚀 Live
                    </button>
                  </div>
                </div>

                {isLive && (
                  <div className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-xs">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span><strong>Warning:</strong> Live mode uses production keys. Real payments will be processed. Ensure keys are correct before enabling.</span>
                  </div>
                )}

                {/* Key ID */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    {gw.gateway_name === 'razorpay' ? 'Key ID' : 'App ID'}
                  </label>
                  <input
                    type="text"
                    value={(editState[gw.id]?.key_id as string) ?? ''}
                    onChange={(e) => setEditField(gw.id, 'key_id', e.target.value)}
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                    placeholder={gw.has_key_id ? '••••••••  (saved — enter new value to change)' : (gw.gateway_name === 'razorpay' ? (isLive ? 'rzp_live_...' : 'rzp_test_...') : 'your_app_id')}
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
                      value={(editState[gw.id]?.key_secret as string) ?? ''}
                      onChange={(e) => setEditField(gw.id, 'key_secret', e.target.value)}
                      className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                      placeholder={gw.has_key_secret ? '••••••••  (saved — enter new value to change)' : '••••••••••'}
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
                      value={(editState[gw.id]?.webhook_secret as string) ?? ''}
                      onChange={(e) => setEditField(gw.id, 'webhook_secret', e.target.value)}
                      className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                      placeholder={gw.has_webhook_secret ? '••••••••  (saved — enter new value to change)' : 'Optional — for webhook signature verification'}
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
                <div className="bg-secondary/70 rounded-lg p-3 text-xs space-y-2">
                  <p className="font-medium flex items-center gap-1.5"><Webhook className="h-3.5 w-3.5" /> Webhook URL</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-[11px] break-all text-muted-foreground font-mono bg-background/50 rounded px-2 py-1.5">
                      {`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${gw.gateway_name}-webhook`}
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${gw.gateway_name}-webhook`);
                        toast.success('Webhook URL copied!');
                      }}
                      className="shrink-0 p-1.5 rounded-md hover:bg-background border border-border text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy webhook URL"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-muted-foreground">Add this URL in your {meta.label} Dashboard → Settings → Webhooks.</p>
                </div>

                {/* Validation warning */}
                {gw.is_enabled && !gw.has_key_id && !editState[gw.id]?.key_id?.trim() && (
                  <div className="flex items-start gap-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-3 text-xs">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>Gateway is enabled but missing API keys. Payments will fail until keys are configured.</span>
                  </div>
                )}

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
