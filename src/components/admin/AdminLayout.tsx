import React, { useState, useCallback, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, FolderOpen, Ticket, BarChart3, LogOut, Menu,
  Settings, FileText, CreditCard, ArrowRightLeft, Presentation, PanelLeftClose, PanelLeftOpen,
  Search, ExternalLink, PlusCircle, Power,
} from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useSiteMode } from '@/contexts/SiteModeContext';
import { useInactivityLogout } from '@/hooks/useInactivityLogout';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Logo, LogoMark } from '@/components/brand/Logo';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from '@/components/ui/command';

interface NavItem { label: string; icon: React.ElementType; path: string; match?: string }
interface NavGroup { title: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  { title: 'Overview', items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' }] },
  {
    title: 'Catalog',
    items: [
      { label: 'Products', icon: Package, path: '/admin/products' },
      { label: 'Categories', icon: FolderOpen, path: '/admin/categories' },
    ],
  },
  {
    title: 'Orders',
    items: [
      { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
      { label: 'Customers', icon: Users, path: '/admin/customers' },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { label: 'Coupons', icon: Ticket, path: '/admin/coupons' },
      { label: 'Hero Banners', icon: Presentation, path: '/admin/hero-slides' },
    ],
  },
  { title: 'Content', items: [{ label: 'Pages', icon: FileText, path: '/admin/pages' }] },
  {
    title: 'Operations',
    items: [
      { label: 'Payments', icon: CreditCard, path: '/admin/payments' },
      { label: 'Transactions', icon: ArrowRightLeft, path: '/admin/transactions' },
    ],
  },
  { title: 'Analytics', items: [{ label: 'Analytics', icon: BarChart3, path: '/admin/analytics' }] },
  { title: 'System', items: [{ label: 'Site & Availability', icon: Settings, path: '/admin/settings' }] },
];

const allItems = navGroups.flatMap((g) => g.items.map((i) => ({ ...i, group: g.title })));

const quickActions = [
  { label: 'Create Product', icon: PlusCircle, path: '/admin/products/add' },
  { label: 'Create Coupon', icon: Ticket, path: '/admin/coupons' },
  { label: 'Create Page', icon: FileText, path: '/admin/pages/new' },
  { label: 'Add Hero Banner', icon: Presentation, path: '/admin/hero-slides' },
  { label: 'Site Availability', icon: Power, path: '/admin/settings' },
];

const modeMeta: Record<string, { label: string; dot: string }> = {
  live: { label: 'Live', dot: 'bg-success' },
  maintenance: { label: 'Maintenance', dot: 'bg-warning' },
  coming_soon: { label: 'Coming Soon', dot: 'bg-accent' },
};

const AdminLayout: React.FC = () => {
  const { adminEmail, logout } = useAdminAuth();
  const { siteMode } = useSiteMode();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('cz_admin_sidebar') === 'collapsed');
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cz_admin_sidebar', collapsed ? 'collapsed' : 'expanded');
  }, [collapsed]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  }, [logout, navigate]);

  useInactivityLogout(() => {
    toast({ title: 'Session expired', description: 'You were logged out due to inactivity.' });
    handleLogout();
  }, 30 * 60 * 1000);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  const current = allItems.find((i) => isActive(i.path));
  const mode = modeMeta[siteMode] || modeMeta.live;
  const go = (path: string) => { setCmdOpen(false); navigate(path); };

  const sidebar = (isCollapsed: boolean) => (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className={cn('h-16 flex items-center border-b border-sidebar-border shrink-0', isCollapsed ? 'justify-center px-2' : 'justify-between px-5')}>
        <Link to="/admin/dashboard" aria-label="CartZebra Command Center">
          {isCollapsed ? <LogoMark variant="light" /> : <Logo variant="light" />}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5" aria-label="Admin navigation">
        {navGroups.map((group) => (
          <div key={group.title}>
            {!isCollapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/40">{group.title}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.path);
                const link = (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative flex items-center gap-3 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                      isCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 py-2',
                      active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
                    )}
                  >
                    {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-sidebar-primary" />}
                    <item.icon className={cn('h-[18px] w-[18px] shrink-0', active && 'text-sidebar-primary')} strokeWidth={1.75} />
                    {!isCollapsed && item.label}
                  </Link>
                );
                return isCollapsed ? (
                  <Tooltip key={item.path} delayDuration={100}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ) : link;
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className={cn('flex items-center gap-3', isCollapsed && 'flex-col')}>
          <div className="h-9 w-9 shrink-0 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center text-sm font-bold uppercase">
            {(adminEmail || 'A')[0]}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{adminEmail}</p>
              <p className="text-[11px] text-sidebar-foreground/50">Administrator</p>
            </div>
          )}
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <button onClick={handleLogout} aria-label="Log out" className="p-2 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Log out</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className={cn('hidden lg:block shrink-0 transition-[width] duration-300 ease-out', collapsed ? 'w-[72px]' : 'w-64')}>
        {sidebar(collapsed)}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && <div className="fixed inset-0 bg-primary/60 z-40 lg:hidden animate-fade-in" onClick={() => setMobileOpen(false)} />}
      <aside className={cn('fixed inset-y-0 left-0 z-50 w-72 lg:hidden transition-transform duration-300', mobileOpen ? 'translate-x-0' : '-translate-x-full')}>
        {sidebar(false)}
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 bg-card/80 backdrop-blur border-b border-border flex items-center gap-3 px-4 lg:px-6 shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-secondary" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden lg:inline-flex p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>

          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground leading-none mb-1 hidden sm:block">
              Command Center{current ? ` / ${current.group}` : ''}
            </p>
            <h1 className="text-base font-bold leading-none truncate">{current?.label || 'Command Center'}</h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setCmdOpen(true)}
              className="hidden md:flex items-center gap-2 h-9 w-64 rounded-lg border border-border bg-secondary/60 px-3 text-sm text-muted-foreground hover:border-foreground/20 transition-colors"
            >
              <Search className="h-4 w-4" /> Search or jump to…
              <kbd className="ml-auto text-[10px] font-semibold rounded border border-border bg-card px-1.5 py-0.5">Ctrl K</kbd>
            </button>
            <button onClick={() => setCmdOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-secondary" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/admin/settings"
              className="hidden sm:inline-flex items-center gap-2 h-9 rounded-full border border-border px-3 text-xs font-semibold hover:bg-secondary transition-colors"
              title="Site availability"
            >
              <span className="relative flex h-2 w-2">
                <span className={cn('absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping', mode.dot)} />
                <span className={cn('relative inline-flex h-2 w-2 rounded-full', mode.dot)} />
              </span>
              {mode.label}
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-9 rounded-full bg-primary text-primary-foreground px-4 text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              <span className="hidden sm:inline">View Store</span> <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <ErrorBoundary variant="page" admin resetKey={location.pathname}>
            <div key={location.pathname} className="animate-fade-in"><Outlet /></div>
          </ErrorBoundary>
        </main>
      </div>

      <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
        <CommandInput placeholder="Search pages and actions…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick actions">
            {quickActions.map((a) => (
              <CommandItem key={a.label} onSelect={() => go(a.path)}>
                <a.icon className="mr-2 h-4 w-4" /> {a.label}
              </CommandItem>
            ))}
            <CommandItem onSelect={() => { setCmdOpen(false); window.open('/', '_blank'); }}>
              <ExternalLink className="mr-2 h-4 w-4" /> View Store
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Go to">
            {allItems.map((i) => (
              <CommandItem key={i.path} value={`${i.group} ${i.label}`} onSelect={() => go(i.path)}>
                <i.icon className="mr-2 h-4 w-4" /> {i.label}
                <span className="ml-auto text-xs text-muted-foreground">{i.group}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default AdminLayout;
