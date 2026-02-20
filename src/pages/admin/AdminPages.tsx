import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Eye, EyeOff, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const AdminPages: React.FC = () => {
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['admin-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_pages')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pages</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage policy pages and site content</p>
        </div>
        <Button variant="accent" asChild>
          <Link to="/admin/pages/new" className="gap-2">
            <Plus className="h-4 w-4" /> New Page
          </Link>
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Page</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Slug</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Last Updated</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page: any) => (
              <tr key={page.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{page.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <code className="text-xs bg-secondary px-2 py-1 rounded">{page.slug}</code>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${page.is_published ? 'text-success' : 'text-muted-foreground'}`}>
                    {page.is_published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    {page.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {format(new Date(page.updated_at), 'dd MMM yyyy, HH:mm')}
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/admin/pages/edit/${page.id}`}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground inline-flex"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No pages yet. Create your first page!
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPages;
