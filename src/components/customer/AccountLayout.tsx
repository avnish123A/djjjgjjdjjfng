import { NavLink, Outlet } from 'react-router-dom';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { LayoutDashboard, Package, UserCircle, LogOut } from 'lucide-react';

const sidebarLinks = [
  { to: '/account', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/account/orders', icon: Package, label: 'My Orders' },
  { to: '/account/profile', icon: UserCircle, label: 'Profile' },
];

const AccountLayout = () => {
  const { customer, logout } = useCustomerAuth();

  return (
    <main className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-background border border-border rounded-2xl p-6 space-y-6 sticky top-24">
              {/* User Info */}
              <div className="text-center lg:text-left">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto lg:mx-0 mb-3">
                  <span className="text-accent text-xl font-bold">
                    {customer?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <h2 className="font-bold text-lg">{customer?.name || 'Customer'}</h2>
                <p className="text-sm text-muted-foreground">{customer?.email}</p>
              </div>

              {/* Nav Links */}
              <nav className="space-y-1">
                {sidebarLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-accent/10 text-accent'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`
                    }
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </NavLink>
                ))}
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccountLayout;
