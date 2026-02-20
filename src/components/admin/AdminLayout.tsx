import React, { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderOpen,
  Ticket,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronDown,
  PlusCircle,
  List,
  Settings,
  MessageSquare,
} from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useInactivityLogout } from '@/hooks/useInactivityLogout';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: { label: string; path: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  {
    label: 'Products',
    icon: Package,
    children: [
      { label: 'All Products', path: '/admin/products', icon: List },
      { label: 'Add Product', path: '/admin/products/add', icon: PlusCircle },
    ],
  },
  { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { label: 'Customers', icon: Users, path: '/admin/customers' },
  { label: 'Categories', icon: FolderOpen, path: '/admin/categories' },
  { label: 'Coupons', icon: Ticket, path: '/admin/coupons' },
  { label: 'Queries', icon: MessageSquare, path: '/admin/queries' },
  { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

const AdminLayout: React.FC = () => {
  const { adminEmail, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Products']);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  }, [logout, navigate]);

  // Auto-logout after 30 min of inactivity
  useInactivityLogout(() => {
    toast({ title: 'Session expired', description: 'You were logged out due to inactivity.' });
    handleLogout();
  }, 30 * 60 * 1000);

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (children: { path: string }[]) =>
    children.some(c => location.pathname.startsWith(c.path));

  return (
    <div className="flex h-screen bg-secondary/50">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Link to="/admin/dashboard" className="text-xl font-bold tracking-tight">
            EkamGift <span className="text-accent">Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X className="h-5 w-5" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(item => {
            if (item.children) {
              const expanded = expandedMenus.includes(item.label);
              const parentActive = isParentActive(item.children);
              return (
                <div key={item.label}>
                  <button onClick={() => toggleMenu(item.label)} className={cn(
                    'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    parentActive ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}>
                    <span className="flex items-center gap-3"><item.icon className="h-5 w-5" />{item.label}</span>
                    <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
                  </button>
                  {expanded && (
                    <div className="mt-1 ml-4 space-y-1">
                      {item.children.map(child => (
                        <Link key={child.path} to={child.path} onClick={() => setSidebarOpen(false)} className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                          isActive(child.path) ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        )}>
                          <child.icon className="h-4 w-4" />{child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link key={item.path} to={item.path!} onClick={() => setSidebarOpen(false)} className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive(item.path!) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}>
                <item.icon className="h-5 w-5" />{item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4 space-y-3">
          <div className="text-xs text-muted-foreground truncate px-1">{adminEmail}</div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-secondary rounded-lg">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">View Store →</Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6"><Outlet /></main>
      </div>
    </div>
  );
};

export default AdminLayout;
