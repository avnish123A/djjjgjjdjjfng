import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChevronRight, Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify';

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['site-page', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 60_000, // 1 min short cache for policies
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!page) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist or is unpublished.</p>
          <Link to="/" className="text-primary hover:underline">Go Home</Link>
        </div>
      </main>
    );
  }

  // Set SEO meta tags
  if (page.seo_title) document.title = page.seo_title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && page.seo_description) metaDesc.setAttribute('content', page.seo_description);

  const sanitizedContent = DOMPurify.sanitize(page.content, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'div', 'img'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style', 'id'],
  });

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{page.title}</span>
        </nav>
      </div>
      <div className="container mx-auto px-4 pb-16 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">{page.title}</h1>

        {sanitizedContent ? (
          <div
            className="prose prose-sm max-w-none text-muted-foreground [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_strong]:text-foreground [&_a]:text-primary [&_a]:hover:underline [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_hr]:my-6 [&_hr]:border-border [&_table]:w-full [&_table]:border-collapse [&_td]:p-3 [&_td]:border [&_td]:border-border [&_th]:p-3 [&_th]:border [&_th]:border-border [&_th]:bg-secondary [&_th]:font-medium [&_th]:text-foreground"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        ) : (
          <p className="text-muted-foreground">This page has no content yet.</p>
        )}

        <p className="text-xs text-muted-foreground mt-12 pt-6 border-t border-border">
          Last updated: {new Date(page.updated_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </main>
  );
};

export default DynamicPage;
