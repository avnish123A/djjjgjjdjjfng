import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Mail, CheckCircle2, AlertTriangle, Minus, Loader2, RotateCw, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Mode = 'retry' | 'test';

const OrderEmailStatus: React.FC<{ orderId: string }> = ({ orderId }) => {
  const qc = useQueryClient();
  const { data: events = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['order-email-events', orderId],
    queryFn: async () => {
      const { data, error } = await supabase.from('email_events').select('*').eq('order_id', orderId);
      if (error) throw error;
      return data;
    },
  });

  const send = useMutation({
    mutationFn: async (mode: Mode) => {
      const { data, error } = await supabase.functions.invoke('send-order-confirmation', { body: { orderId, mode } });
      if (error) {
        let msg = error.message;
        if (error instanceof FunctionsHttpError) {
          try { const b = await error.context.json(); msg = b?.error || b?.reason || msg; } catch { /* keep */ }
        }
        throw new Error(msg);
      }
      return data as { status: string; reason?: string; error?: string };
    },
    onSuccess: (r) => {
      if (r.status === 'sent') toast.success('Email sent');
      else if (r.status === 'skipped') toast.info(r.reason || 'Not sent');
      else toast.error(r.error || 'Email failed');
    },
    onError: (e: Error) => toast.error(e.message),
    onSettled: () => qc.invalidateQueries({ queryKey: ['order-email-events', orderId] }),
  });

  const conf = events.find((e) => e.email_type === 'ORDER_CONFIRMATION');
  const test = events.find((e) => e.email_type === 'ORDER_CONFIRMATION_TEST');
  const fmt = (d?: string | null) => (d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—');

  const badge = !conf
    ? <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Minus className="h-3.5 w-3.5" /> Not sent</span>
    : conf.status === 'sent'
      ? <span className="inline-flex items-center gap-1 text-xs text-success font-medium"><CheckCircle2 className="h-3.5 w-3.5" /> Sent</span>
      : conf.status === 'failed'
        ? <span className="inline-flex items-center gap-1 text-xs text-destructive font-medium"><AlertTriangle className="h-3.5 w-3.5" /> Failed</span>
        : <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending</span>;

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <h2 className="font-semibold flex items-center gap-2"><Mail className="h-4 w-4" /> Notifications</h2>
      {isLoading ? (
        <div className="h-16 rounded-lg bg-secondary animate-pulse" />
      ) : isError ? (
        <div className="text-sm text-destructive flex items-center justify-between">
          Couldn't load email status <Button variant="ghost" size="sm" onClick={() => refetch()}>Retry</Button>
        </div>
      ) : (
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">Order Confirmation Email</span>{badge}
          </div>
          {conf && (
            <dl className="text-xs space-y-1 text-muted-foreground">
              <div className="flex justify-between gap-2"><dt>Recipient</dt><dd className="text-foreground truncate">{conf.recipient}</dd></div>
              <div className="flex justify-between gap-2"><dt>Sent</dt><dd className="text-foreground">{fmt(conf.sent_at)}</dd></div>
              <div className="flex justify-between gap-2"><dt>Attempts</dt><dd className="text-foreground">{conf.attempt_count}</dd></div>
              {conf.provider_message_id && <div className="flex justify-between gap-2"><dt>Message ID</dt><dd className="text-foreground truncate font-mono">{conf.provider_message_id}</dd></div>}
              {conf.status === 'failed' && conf.error_message && <p className="text-destructive pt-1 break-words">{conf.error_message}</p>}
            </dl>
          )}
          {test && (
            <p className="text-xs text-muted-foreground pt-1">Last test: {test.status} · {fmt(test.sent_at || test.updated_at)}{test.status === 'failed' && test.error_message ? ` — ${test.error_message}` : ''}</p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Button
          variant="outline" size="sm" className="gap-2"
          disabled={send.isPending || conf?.status === 'sent'}
          onClick={() => send.mutate('retry')}
          title={conf?.status === 'sent' ? 'Already delivered — duplicates are blocked' : undefined}
        >
          <RotateCw className="h-3.5 w-3.5" /> Resend Confirmation Email
        </Button>
        <Button variant="ghost" size="sm" className="gap-2" disabled={send.isPending} onClick={() => send.mutate('test')}>
          <Send className="h-3.5 w-3.5" /> Send test to customer's address
        </Button>
      </div>
    </div>
  );
};

export default OrderEmailStatus;
