import React, { useState } from 'react';
import { useSiteMode } from '@/contexts/SiteModeContext';
import { Globe, Wrench, Rocket, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const modes = [
  { id: 'live' as const, label: 'Live', desc: 'Site is fully accessible to all visitors', icon: Globe, color: 'text-green-600 bg-green-50 border-green-200' },
  { id: 'maintenance' as const, label: 'Maintenance', desc: 'Shows maintenance page to visitors. Admins can still access the panel.', icon: Wrench, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { id: 'coming_soon' as const, label: 'Coming Soon', desc: 'Shows a coming soon page with email signup. Admins can still access the panel.', icon: Rocket, color: 'text-primary bg-primary/10 border-primary/20' },
] as const;

const AdminSiteSettings: React.FC = () => {
  const { siteMode, setSiteMode } = useSiteMode();
  const [selected, setSelected] = useState(siteMode);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (selected === siteMode) return;
    setSaving(true);
    try {
      await setSiteMode(selected);
      toast.success(`Site mode changed to ${selected}`);
    } catch {
      toast.error('Failed to update site mode');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Control your storefront visibility</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Site Mode</h2>
        <div className="space-y-3">
          {modes.map((mode) => (
            <label
              key={mode.id}
              className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                selected === mode.id ? `${mode.color} border-2` : 'border-border hover:border-muted-foreground/30'
              }`}
            >
              <input
                type="radio"
                name="siteMode"
                value={mode.id}
                checked={selected === mode.id}
                onChange={() => setSelected(mode.id)}
                className="mt-1 accent-primary"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <mode.icon className="h-4 w-4" />
                  <span className="font-medium text-sm">{mode.label}</span>
                  {siteMode === mode.id && (
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-foreground/10 px-2 py-0.5 rounded-full">Current</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{mode.desc}</p>
              </div>
            </label>
          ))}
        </div>

        <Button
          onClick={handleSave}
          disabled={saving || selected === siteMode}
          className="w-full"
        >
          {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default AdminSiteSettings;
