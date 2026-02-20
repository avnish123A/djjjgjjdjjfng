import React, { useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Loader2, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface HeroImageUploadProps {
  currentUrl: string;
  onUploaded: (url: string) => void;
}

export const HeroImageUpload: React.FC<HeroImageUploadProps> = ({ currentUrl, onUploaded }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `hero-banner-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      onUploaded(publicUrl);
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">Hero Background Image</Label>
      {currentUrl && (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img src={currentUrl} alt="Hero preview" className="w-full h-40 object-cover" />
          <button
            onClick={() => onUploaded('')}
            className="absolute top-2 right-2 bg-foreground/60 text-background rounded-full p-1 hover:bg-foreground/80 transition-colors"
            aria-label="Remove image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
      >
        {uploading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
        ) : (
          <><Upload className="h-4 w-4" /> {currentUrl ? 'Replace Image' : 'Upload Image'}</>
        )}
      </button>
      <p className="text-[10px] text-muted-foreground">Recommended: 1920×900px, JPEG/WebP, under 5MB</p>
    </div>
  );
};
