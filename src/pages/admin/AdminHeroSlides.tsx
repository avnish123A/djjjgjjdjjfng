import React, { useState } from 'react';
import { useHeroSlides, useUpsertHeroSlide, useDeleteHeroSlide, HeroSlide } from '@/hooks/useHeroSlides';
import { HeroImageUpload } from '@/components/admin/HeroImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Plus, Pencil, Trash2, GripVertical, Image } from 'lucide-react';
import { toast } from 'sonner';

const emptySlide: Partial<HeroSlide> = {
  title: '', subtitle: '', description: '', image_url: '',
  cta_primary_text: '', cta_primary_link: '/products',
  cta_secondary_text: '', cta_secondary_link: '',
  is_active: true, sort_order: 0,
};

const AdminHeroSlides: React.FC = () => {
  const { data: slides = [], isLoading } = useHeroSlides();
  const upsert = useUpsertHeroSlide();
  const remove = useDeleteHeroSlide();
  const [editing, setEditing] = useState<Partial<HeroSlide> | null>(null);

  const openNew = () => setEditing({ ...emptySlide, sort_order: slides.length });
  const openEdit = (s: HeroSlide) => setEditing({ ...s });

  const handleSave = async () => {
    if (!editing) return;
    try {
      await upsert.mutateAsync(editing);
      toast.success(editing.id ? 'Slide updated' : 'Slide created');
      setEditing(null);
    } catch {
      toast.error('Failed to save slide');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slide?')) return;
    try {
      await remove.mutateAsync(id);
      toast.success('Slide deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const toggleActive = async (slide: HeroSlide) => {
    try {
      await upsert.mutateAsync({ id: slide.id, is_active: !slide.is_active });
      toast.success(`Slide ${slide.is_active ? 'hidden' : 'activated'}`);
    } catch {
      toast.error('Failed to update');
    }
  };

  const updateField = (key: string, value: any) => {
    setEditing(prev => prev ? { ...prev, [key]: value } : null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hero Slides</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage the rotating banner carousel on your homepage</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" /> Add Slide
        </Button>
      </div>

      {slides.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Image className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No slides yet. Add your first hero slide.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, i) => (
            <div key={slide.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <GripVertical className="h-5 w-5 text-muted-foreground shrink-0 cursor-grab" />
              <div className="w-24 h-14 rounded-lg overflow-hidden bg-secondary shrink-0">
                {slide.image_url ? (
                  <img src={slide.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Image className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{slide.title || 'Untitled'}</p>
                <p className="text-xs text-muted-foreground truncate">{slide.subtitle}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Switch checked={slide.is_active} onCheckedChange={() => toggleActive(slide)} />
                <Button size="icon" variant="ghost" onClick={() => openEdit(slide)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(slide.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Edit Slide' : 'New Slide'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 pt-2">
              <HeroImageUpload
                currentUrl={editing.image_url || ''}
                onUploaded={(url) => updateField('image_url', url)}
              />
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Subtitle Tag</Label>
                <Input value={editing.subtitle || ''} onChange={e => updateField('subtitle', e.target.value)} placeholder="e.g. The Art of Gifting" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Main Title</Label>
                <Input value={editing.title || ''} onChange={e => updateField('title', e.target.value)} placeholder="e.g. Gifts That Speak Louder" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Description</Label>
                <Textarea value={editing.description || ''} onChange={e => updateField('description', e.target.value)} placeholder="Hero description" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Primary CTA Text</Label>
                  <Input value={editing.cta_primary_text || ''} onChange={e => updateField('cta_primary_text', e.target.value)} placeholder="Explore Collection" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Primary CTA Link</Label>
                  <Input value={editing.cta_primary_link || ''} onChange={e => updateField('cta_primary_link', e.target.value)} placeholder="/products" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Secondary CTA Text</Label>
                  <Input value={editing.cta_secondary_text || ''} onChange={e => updateField('cta_secondary_text', e.target.value)} placeholder="Personalize a Gift" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Secondary CTA Link</Label>
                  <Input value={editing.cta_secondary_link || ''} onChange={e => updateField('cta_secondary_link', e.target.value)} placeholder="/products?category=..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Sort Order</Label>
                  <Input type="number" value={editing.sort_order ?? 0} onChange={e => updateField('sort_order', parseInt(e.target.value) || 0)} />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <Switch checked={editing.is_active ?? true} onCheckedChange={v => updateField('is_active', v)} />
                  <Label className="text-xs">Active</Label>
                </div>
              </div>
              <Button onClick={handleSave} disabled={upsert.isPending} className="w-full">
                {upsert.isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : 'Save Slide'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminHeroSlides;
