import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Save, Loader2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import RichTextEditor from '@/components/admin/RichTextEditor';

const AdminPageEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = !id || id === 'new';
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: existing, isLoading } = useQuery({
    queryKey: ['admin-page', id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase.from('site_pages').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    enabled: !isNew,
  });

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    seo_title: '',
    seo_description: '',
    is_published: false,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title || '',
        slug: existing.slug || '',
        content: existing.content || '',
        seo_title: existing.seo_title || '',
        seo_description: existing.seo_description || '',
        is_published: existing.is_published ?? false,
      });
    }
  }, [existing]);

  // Unsaved changes warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasChanges]);

  const updateField = useCallback((field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  }, []);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleTitleChange = (value: string) => {
    updateField('title', value);
    if (isNew) {
      updateField('slug', generateSlug(value));
    }
  };

  const handleSave = async (publish?: boolean) => {
    if (!form.title || !form.slug) {
      toast.error('Title and slug are required');
      return;
    }

    setSaving(true);
    try {
      const pageData = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        content: form.content,
        seo_title: form.seo_title.trim() || form.title.trim(),
        seo_description: form.seo_description.trim() || '',
        is_published: publish !== undefined ? publish : form.is_published,
      };

      if (isNew) {
        const { error } = await supabase.from('site_pages').insert(pageData);
        if (error) throw error;
        toast.success('Page created');
      } else {
        const { error } = await supabase.from('site_pages').update(pageData).eq('id', id);
        if (error) throw error;
        toast.success('Page saved');
      }

      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
      queryClient.invalidateQueries({ queryKey: ['site-page'] });
      navigate('/admin/pages');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!isNew && isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => {
            if (hasChanges && !confirm('You have unsaved changes. Discard?')) return;
            navigate('/admin/pages');
          }} className="p-2 hover:bg-secondary rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{isNew ? 'New Page' : 'Edit Page'}</h1>
            {existing && (
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {new Date(existing.updated_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && form.is_published && (
            <Button variant="outline" size="sm" asChild className="gap-1.5">
              <a href={`/page/${form.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" /> Preview
              </a>
            </Button>
          )}
          {hasChanges && (
            <span className="text-xs text-amber-500 font-medium">Unsaved changes</span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Title & Slug */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Page Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Page Title *</Label>
              <Input id="title" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="e.g. Privacy Policy" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input id="slug" value={form.slug} onChange={(e) => updateField('slug', e.target.value)} placeholder="e.g. privacy-policy" />
              <p className="text-xs text-muted-foreground">URL: /page/{form.slug || '...'}</p>
            </div>
            <div className="space-y-2 flex items-end">
              <Button
                type="button"
                variant={form.is_published ? 'default' : 'outline'}
                onClick={() => updateField('is_published', !form.is_published)}
                className="gap-2"
              >
                {form.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {form.is_published ? 'Published' : 'Draft'}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Content</h2>
          <RichTextEditor
            content={form.content}
            onChange={(html) => updateField('content', html)}
            placeholder="Write your page content here..."
          />
        </div>

        {/* SEO */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">SEO Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seo_title">SEO Title</Label>
              <Input id="seo_title" value={form.seo_title} onChange={(e) => updateField('seo_title', e.target.value)} placeholder="Page title for search engines" maxLength={60} />
              <p className="text-xs text-muted-foreground">{form.seo_title.length}/60 characters</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo_desc">Meta Description</Label>
              <Textarea id="seo_desc" value={form.seo_description} onChange={(e) => updateField('seo_description', e.target.value)} placeholder="Brief description for search results" maxLength={160} rows={2} />
              <p className="text-xs text-muted-foreground">{form.seo_description.length}/160 characters</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button onClick={() => handleSave()} variant="accent" className="px-8 gap-2" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Page'}
          </Button>
          {!form.is_published && (
            <Button onClick={() => handleSave(true)} variant="default" className="gap-2" disabled={saving}>
              <Eye className="h-4 w-4" /> Save & Publish
            </Button>
          )}
          <Button type="button" variant="outline" onClick={() => navigate('/admin/pages')}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPageEditor;
