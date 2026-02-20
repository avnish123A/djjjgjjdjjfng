import React, { useState, useEffect, useRef } from 'react';
import { useSiteMode } from '@/contexts/SiteModeContext';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useQueryClient } from '@tanstack/react-query';
import { Globe, Wrench, Rocket, Loader2, Save, Image, Share2, Phone, Mail, MapPin, Megaphone, Upload, X, Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { HeroImageUpload } from '@/components/admin/HeroImageUpload';

const modes = [
  { id: 'live' as const, label: 'Live', desc: 'Site is fully accessible to all visitors', icon: Globe, color: 'text-green-600 bg-green-50 border-green-200' },
  { id: 'maintenance' as const, label: 'Maintenance', desc: 'Shows maintenance page to visitors.', icon: Wrench, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { id: 'coming_soon' as const, label: 'Coming Soon', desc: 'Shows a coming soon page with email signup.', icon: Rocket, color: 'text-primary bg-primary/10 border-primary/20' },
] as const;

const announcementFields = [
  { key: 'announcement_text', label: 'Banner Text', placeholder: 'e.g. Free shipping on orders above ₹999' },
];

const heroFields = [
  { key: 'hero_subtitle', label: 'Subtitle Tag', placeholder: 'e.g. The Art of Gifting' },
  { key: 'hero_title', label: 'Main Heading', placeholder: 'e.g. Gifts That Speak Louder' },
  { key: 'hero_description', label: 'Description', placeholder: 'Hero description text', multiline: true },
  { key: 'hero_cta_primary_text', label: 'Primary Button Text', placeholder: 'e.g. Explore Collection' },
  { key: 'hero_cta_primary_link', label: 'Primary Button Link', placeholder: '/products' },
  { key: 'hero_cta_secondary_text', label: 'Secondary Button Text', placeholder: 'e.g. Personalize a Gift' },
  { key: 'hero_cta_secondary_link', label: 'Secondary Button Link', placeholder: '/products?category=...' },
];

const socialFields = [
  { key: 'social_instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/yourpage' },
  { key: 'social_facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/yourpage' },
  { key: 'social_twitter', label: 'Twitter / X URL', placeholder: 'https://x.com/yourpage' },
  { key: 'social_youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/@yourchannel' },
];

const contactFields = [
  { key: 'contact_email', label: 'Email', placeholder: 'hello@ekamgift.com', icon: Mail },
  { key: 'contact_phone', label: 'Phone', placeholder: '+91 98765 43210', icon: Phone },
  { key: 'contact_location', label: 'Address', placeholder: 'India', icon: MapPin },
  { key: 'contact_page_title', label: 'Page Heading', placeholder: 'Get in Touch', icon: Mail },
  { key: 'contact_page_description', label: 'Page Description', placeholder: 'Have a question? We\'d love to hear from you.', icon: Mail },
  { key: 'contact_business_hours', label: 'Business Hours', placeholder: 'Mon – Sat: 10 AM – 7 PM IST', icon: Phone },
  { key: 'contact_off_day', label: 'Off Day', placeholder: 'Sunday: Closed', icon: Phone },
];

const AdminSiteSettings: React.FC = () => {
  const { siteMode, setSiteMode } = useSiteMode();
  const { data: settings = {}, isLoading } = useSiteSettings();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(siteMode);
  const [savingMode, setSavingMode] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => { setSelected(siteMode); }, [siteMode]);
  useEffect(() => { if (settings) setFormValues({ ...settings }); }, [settings]);

  const handleSaveMode = async () => {
    if (selected === siteMode) return;
    setSavingMode(true);
    try {
      await setSiteMode(selected);
      toast.success(`Site mode changed to ${selected}`);
    } catch {
      toast.error('Failed to update site mode');
    }
    setSavingMode(false);
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const updates = Object.entries(formValues)
        .filter(([key]) => key !== 'site_mode')
        .map(([key, value]) => ({ key, value: value || '' }));

      for (const item of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key: item.key, value: item.value }, { onConflict: 'key' });
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    }
    setSavingSettings(false);
  };

  const updateField = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your storefront content and configuration</p>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
          <TabsTrigger value="announcement" className="gap-1.5"><Megaphone className="h-3.5 w-3.5" /> Banner</TabsTrigger>
          <TabsTrigger value="hero" className="gap-1.5"><Image className="h-3.5 w-3.5" /> Hero</TabsTrigger>
          <TabsTrigger value="social" className="gap-1.5"><Share2 className="h-3.5 w-3.5" /> Social</TabsTrigger>
          <TabsTrigger value="contact" className="gap-1.5"><Phone className="h-3.5 w-3.5" /> Contact</TabsTrigger>
          <TabsTrigger value="pages" className="gap-1.5"><Clock className="h-3.5 w-3.5" /> Pages</TabsTrigger>
          <TabsTrigger value="mode" className="gap-1.5"><Globe className="h-3.5 w-3.5" /> Mode</TabsTrigger>
        </TabsList>

        {/* Announcement Bar */}
        <TabsContent value="announcement">
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <h2 className="font-semibold flex items-center gap-2"><Megaphone className="h-4 w-4 text-primary" /> Announcement Bar</h2>
            <p className="text-xs text-muted-foreground">The promotional banner shown at the top of every page</p>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <Label className="text-sm font-medium">Enable Banner</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Show or hide the announcement bar</p>
              </div>
              <Switch
                checked={formValues['announcement_enabled'] === 'true'}
                onCheckedChange={(checked) => updateField('announcement_enabled', checked ? 'true' : 'false')}
              />
            </div>
            {announcementFields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label className="text-xs font-medium">{field.label}</Label>
                <Input
                  value={formValues[field.key] || ''}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            <Button onClick={handleSaveSettings} disabled={savingSettings} className="w-full">
              {savingSettings ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : <><Save className="h-4 w-4 mr-2" /> Save Banner Settings</>}
            </Button>
          </div>
        </TabsContent>

        {/* Hero Section */}
        <TabsContent value="hero">
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <h2 className="font-semibold flex items-center gap-2"><Image className="h-4 w-4 text-primary" /> Hero Section</h2>
            <p className="text-xs text-muted-foreground">Edit the main banner content on your homepage</p>

            {/* Hero Image Upload */}
            <HeroImageUpload
              currentUrl={formValues['hero_image_url'] || ''}
              onUploaded={(url) => {
                updateField('hero_image_url', url);
                // Auto-save the image URL
                supabase
                  .from('site_settings')
                  .upsert({ key: 'hero_image_url', value: url }, { onConflict: 'key' })
                  .then(({ error }) => {
                    if (error) toast.error('Failed to save image URL');
                    else {
                      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
                      toast.success('Hero image updated');
                    }
                  });
              }}
            />

            {heroFields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label className="text-xs font-medium">{field.label}</Label>
                {field.multiline ? (
                  <Textarea
                    value={formValues[field.key] || ''}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                  />
                ) : (
                  <Input
                    value={formValues[field.key] || ''}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
            <Button onClick={handleSaveSettings} disabled={savingSettings} className="w-full">
              {savingSettings ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : <><Save className="h-4 w-4 mr-2" /> Save Hero Settings</>}
            </Button>
          </div>
        </TabsContent>

        {/* Social Media */}
        <TabsContent value="social">
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <h2 className="font-semibold flex items-center gap-2"><Share2 className="h-4 w-4 text-primary" /> Social Media Links</h2>
            <p className="text-xs text-muted-foreground">Add your social media profiles. Leave blank to hide.</p>
            {socialFields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label className="text-xs font-medium">{field.label}</Label>
                <Input
                  value={formValues[field.key] || ''}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            <Button onClick={handleSaveSettings} disabled={savingSettings} className="w-full">
              {savingSettings ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : <><Save className="h-4 w-4 mr-2" /> Save Social Links</>}
            </Button>
          </div>
        </TabsContent>

        {/* Contact Info */}
        <TabsContent value="contact">
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <h2 className="font-semibold flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> Contact Information</h2>
            <p className="text-xs text-muted-foreground">Displayed in the footer and contact page</p>
            {contactFields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <field.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  {field.label}
                </Label>
                <Input
                  value={formValues[field.key] || ''}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            <Button onClick={handleSaveSettings} disabled={savingSettings} className="w-full">
              {savingSettings ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : <><Save className="h-4 w-4 mr-2" /> Save Contact Info</>}
            </Button>
          </div>
        </TabsContent>

        {/* Maintenance & Coming Soon Messages */}
        <TabsContent value="pages">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div>
              <h2 className="font-semibold flex items-center gap-2"><Wrench className="h-4 w-4 text-primary" /> Maintenance Page</h2>
              <p className="text-xs text-muted-foreground mt-1">Customize the message visitors see when the site is in maintenance mode</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Heading</Label>
              <Input value={formValues['maintenance_title'] || ''} onChange={(e) => updateField('maintenance_title', e.target.value)} placeholder="We're Polishing Things Up" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Message</Label>
              <Textarea value={formValues['maintenance_message'] || ''} onChange={(e) => updateField('maintenance_message', e.target.value)} placeholder="We're making improvements..." rows={3} />
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="font-semibold flex items-center gap-2"><Rocket className="h-4 w-4 text-primary" /> Coming Soon Page</h2>
              <p className="text-xs text-muted-foreground mt-1">Customize the coming soon page with a countdown timer</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Heading</Label>
              <Input value={formValues['coming_soon_title'] || ''} onChange={(e) => updateField('coming_soon_title', e.target.value)} placeholder="Something Special is Coming" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Message</Label>
              <Textarea value={formValues['coming_soon_message'] || ''} onChange={(e) => updateField('coming_soon_message', e.target.value)} placeholder="Our curated gifting experience is almost ready..." rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Launch Date (for countdown timer)</Label>
              <Input type="datetime-local" value={formValues['coming_soon_date'] || ''} onChange={(e) => updateField('coming_soon_date', e.target.value)} />
              <p className="text-[10px] text-muted-foreground">Leave empty to hide the countdown timer</p>
            </div>

            <Button onClick={handleSaveSettings} disabled={savingSettings} className="w-full">
              {savingSettings ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : <><Save className="h-4 w-4 mr-2" /> Save Page Settings</>}
            </Button>
          </div>
        </TabsContent>

        {/* Site Mode */}
        <TabsContent value="mode">
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
                  <input type="radio" name="siteMode" value={mode.id} checked={selected === mode.id} onChange={() => setSelected(mode.id)} className="mt-1 accent-primary" />
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
            <Button onClick={handleSaveMode} disabled={savingMode || selected === siteMode} className="w-full">
              {savingMode ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : 'Save Changes'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSiteSettings;
