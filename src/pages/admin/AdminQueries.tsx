import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import {
  Search,
  Inbox,
  Mail,
  MailOpen,
  Trash2,
  ChevronLeft,
  Filter,
  MessageSquare,
  Phone,
  Globe,
  Clock,
  User,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Query {
  id: string;
  customer_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  source_form: string;
  status: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

const PAGE_SIZE = 30;

const sourceLabels: Record<string, string> = {
  contact: 'Contact Form',
  newsletter: 'Newsletter',
  support: 'Support',
};

const statusColors: Record<string, string> = {
  new: 'bg-primary/15 text-primary border-primary/20',
  read: 'bg-muted text-muted-foreground border-border',
  replied: 'bg-green-500/15 text-green-700 border-green-500/20',
};

const AdminQueries = () => {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [page, setPage] = useState(0);

  // Fetch queries
  const { data: queries = [], isLoading } = useQuery({
    queryKey: ['admin-queries', statusFilter, sourceFilter, page],
    queryFn: async () => {
      let q = (supabase
        .from('customer_queries' as any) as any)
        .select('*')
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (statusFilter !== 'all') q = q.eq('status', statusFilter);
      if (sourceFilter !== 'all') q = q.eq('source_form', sourceFilter);

      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as Query[];
    },
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('admin-queries-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customer_queries' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['admin-queries'] });
          if (payload.eventType === 'INSERT') {
            toast({
              title: '📩 New query received',
              description: `From ${(payload.new as Query).email}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Mutations
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await (supabase
        .from('customer_queries' as any) as any)
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-queries'] }),
  });

  const deleteQuery = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase
        .from('customer_queries' as any) as any)
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      setSelectedId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-queries'] });
      toast({ title: 'Query deleted' });
    },
  });

  // Filter by search
  const filtered = useMemo(() => {
    if (!search.trim()) return queries;
    const q = search.toLowerCase();
    return queries.filter(
      (item) =>
        item.email.toLowerCase().includes(q) ||
        item.customer_name.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q) ||
        item.subject?.toLowerCase().includes(q)
    );
  }, [queries, search]);

  const selected = useMemo(
    () => filtered.find((q) => q.id === selectedId) || null,
    [filtered, selectedId]
  );

  // Auto-mark as read
  const handleSelect = useCallback(
    (query: Query) => {
      setSelectedId(query.id);
      if (query.status === 'new') {
        updateStatus.mutate({ id: query.id, status: 'read' });
      }
    },
    [updateStatus]
  );

  const newCount = queries.filter((q) => q.status === 'new').length;

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60_000) return 'Just now';
    if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}h ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Customer Queries</h1>
          {newCount > 0 && (
            <Badge className="bg-primary text-primary-foreground">{newCount} new</Badge>
          )}
        </div>
      </div>

      <div className="flex h-[calc(100%-3rem)] border border-border rounded-xl overflow-hidden bg-card">
        {/* Left Panel — List */}
        <div
          className={cn(
            'w-full md:w-[380px] md:min-w-[320px] border-r border-border flex flex-col',
            selected ? 'hidden md:flex' : 'flex'
          )}
        >
          {/* Filters */}
          <div className="p-3 border-b border-border space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search queries…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-xs flex-1">
                  <Filter className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="h-8 text-xs flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Query List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm">
                <Inbox className="h-8 w-8 mb-2 opacity-30" />
                No queries found
              </div>
            ) : (
              filtered.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSelect(q)}
                  className={cn(
                    'w-full text-left px-4 py-3 border-b border-border hover:bg-secondary/50 transition-colors',
                    selectedId === q.id && 'bg-secondary',
                    q.status === 'new' && 'bg-primary/[0.03]'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {q.status === 'new' ? (
                        <Mail className="h-4 w-4 text-primary shrink-0" />
                      ) : (
                        <MailOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span
                        className={cn(
                          'text-sm truncate',
                          q.status === 'new' ? 'font-semibold text-foreground' : 'text-foreground'
                        )}
                      >
                        {q.customer_name || q.email}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                      {formatDate(q.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-1 pl-6">
                    {q.subject || q.message.substring(0, 80)}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 pl-6">
                    <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', statusColors[q.status])}>
                      {q.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {sourceLabels[q.source_form] || q.source_form}
                    </span>
                  </div>
                </button>
              ))
            )}
            {/* Pagination */}
            {queries.length === PAGE_SIZE && (
              <div className="p-3 flex justify-center">
                <Button variant="ghost" size="sm" onClick={() => setPage((p) => p + 1)}>
                  Load more
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel — Detail */}
        <div className={cn('flex-1 flex flex-col', !selected ? 'hidden md:flex' : 'flex')}>
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm">Select a query to view details</p>
            </div>
          ) : (
            <>
              {/* Detail Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <button
                  onClick={() => setSelectedId(null)}
                  className="md:hidden flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <div className="flex items-center gap-2 ml-auto">
                  <Select
                    value={selected.status}
                    onValueChange={(val) => updateStatus.mutate({ id: selected.id, status: val })}
                  >
                    <SelectTrigger className="h-8 text-xs w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (confirm('Delete this query?')) deleteQuery.mutate(selected.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Detail Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Subject */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {selected.subject || 'No Subject'}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={cn('text-xs', statusColors[selected.status])}>
                      {selected.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {sourceLabels[selected.source_form] || selected.source_form}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-secondary/50 rounded-lg p-4 space-y-2.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer Info</h4>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-primary" />
                      <span>{selected.customer_name || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <a href={`mailto:${selected.email}`} className="text-primary hover:underline">
                        {selected.email}
                      </a>
                    </div>
                    {selected.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        <span>{selected.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>
                        {new Date(selected.created_at).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Message</h4>
                  <div className="bg-background border border-border rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </div>
                </div>

                {/* Meta */}
                {(selected.ip_address || selected.user_agent) && (
                  <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
                    {selected.ip_address && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-3 w-3" /> IP: {selected.ip_address}
                      </div>
                    )}
                    {selected.user_agent && (
                      <p className="truncate">UA: {selected.user_agent}</p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminQueries;
