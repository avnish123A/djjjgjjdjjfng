import React, { Component, ErrorInfo } from 'react';
import { AlertTriangle, RotateCw, LayoutDashboard, Store } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /** 'page' renders inline inside an existing shell; 'screen' fills the viewport (last resort). */
  variant?: 'page' | 'screen';
  /** Show "Go to Dashboard" (admin areas). */
  admin?: boolean;
  /** Changing this value resets the boundary (e.g. route path). */
  resetKey?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const CHUNK_RELOAD_KEY = 'cz_chunk_reload_at';

/** Lazy-loaded files go missing after a new deploy; a single reload fetches the fresh build. */
export const isChunkLoadError = (e: unknown) =>
  e instanceof Error &&
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError|Loading chunk .* failed/i.test(e.message);

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Real error stays in the console for debugging; shoppers never see stack traces
    console.error('[ErrorBoundary]', error, info.componentStack);
    if (isChunkLoadError(error)) {
      const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
      if (Date.now() - last > 30_000) {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
        window.location.reload();
      }
    }
  }

  componentDidUpdate(prev: Props) {
    if (this.state.hasError && prev.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleRetry = () => {
    if (this.state.error && isChunkLoadError(this.state.error)) {
      window.location.reload();
      return;
    }
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    const { variant = 'screen', admin } = this.props;
    const chunk = isChunkLoadError(this.state.error);

    return (
      <div className={variant === 'screen' ? 'min-h-screen flex items-center justify-center bg-background p-4' : 'flex items-center justify-center py-16 px-4'}>
        <div role="alert" className="w-full max-w-md rounded-2xl border border-border bg-card p-6 sm:p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-warning/10 text-warning">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            {chunk ? 'A new version is available' : 'This section didn’t load'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {chunk
              ? 'We updated CartZebra. Reload to get the latest version.'
              : 'Something on this page failed to load. Your data is safe — please try again.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 transition-colors"
            >
              <RotateCw className="h-4 w-4" /> {chunk ? 'Reload' : 'Retry'}
            </button>
            {admin && (
              <a href="/admin/dashboard" className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </a>
            )}
            <a href="/" className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
              <Store className="h-4 w-4" /> {admin ? 'Store' : 'Back to store'}
            </a>
          </div>
        </div>
      </div>
    );
  }
}
