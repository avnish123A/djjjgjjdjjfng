import { lazy, Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useZoomPrevention } from "@/hooks/useZoomPrevention";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import { SiteModeProvider, useSiteMode } from "@/contexts/SiteModeContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { BackToTop } from "@/components/layout/BackToTop";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import PageLoader from "@/components/layout/PageLoader";
import Index from "./pages/Index";
import Maintenance from "./pages/Maintenance";
import NotFound from "./pages/NotFound";

// Lazy-loaded storefront pages
const ProductListing = lazy(() => import("./pages/ProductListing"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));

// Policy pages (lazy) - kept as fallback, dynamic CMS pages take priority
const PrivacyPolicy = lazy(() => import("./pages/policies/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/policies/TermsConditions"));
const ReturnPolicy = lazy(() => import("./pages/policies/ReturnPolicy"));
const ShippingPolicy = lazy(() => import("./pages/policies/ShippingPolicy"));
const DynamicPage = lazy(() => import("./pages/policies/DynamicPage"));


// Lazy-loaded admin pages
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminResetPassword = lazy(() => import("./pages/admin/AdminResetPassword"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminProductForm = lazy(() => import("./pages/admin/AdminProductForm"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminOrderDetail = lazy(() => import("./pages/admin/AdminOrderDetail"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminSiteSettings = lazy(() => import("./pages/admin/AdminSiteSettings"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));

const AdminPages = lazy(() => import("./pages/admin/AdminPages"));
const AdminPageEditor = lazy(() => import("./pages/admin/AdminPageEditor"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Prevent infinite loading — queries fail gracefully after retries
    },
    mutations: {
      retry: 1,
    },
  },
});

// Admin loading fallback
const AdminLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-white/40">Loading…</p>
    </div>
  </div>
);

// Storefront loading fallback
const StorefrontLoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

// Protected route wrapper
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isAdmin, isLoading, user } = useAdminAuth();
  const location = useLocation();

  if (isLoading) return <AdminLoadingFallback />;

  if (!user) return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;

  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
        <div className="glass-strong rounded-2xl p-8 max-w-md text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
            <span className="text-destructive text-xl font-bold">✕</span>
          </div>
          <h2 className="text-xl font-bold text-white">Access Denied</h2>
          <p className="text-sm text-white/50">You don't have admin privileges. Contact a super admin to get access.</p>
          <button onClick={() => window.location.href = '/admin/login'} className="text-accent text-sm hover:underline">
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Auto-redirect away from login if already authenticated
const AdminLoginGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) return <AdminLoadingFallback />;

  if (isLoggedIn) {
    const from = (location.state as { from?: string })?.from || '/admin/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

// Maintenance guard — blocks public routes when site isn't live
const MaintenanceGuard = ({ children }: { children: React.ReactNode }) => {
  const { siteMode, isLoading: isSiteLoading } = useSiteMode();
  const { isAdmin, isLoading: isAuthLoading } = useAdminAuth();

  // Wait for both contexts before deciding
  if (isSiteLoading || isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Admins always bypass
  if (isAdmin) return <>{children}</>;
  // If not live, show maintenance
  if (siteMode !== 'live') return <Maintenance />;
  return <>{children}</>;
};

// Storefront layout wrapper
const StorefrontLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen pb-[60px] lg:pb-0">
    <Header />
    <div className="flex-1">{children}</div>
    <Footer />
    <BottomNav />
    <BackToTop />
  </div>
);

// Storefront route with maintenance guard + suspense
const StorefrontRoute = ({ children }: { children: React.ReactNode }) => (
  <MaintenanceGuard>
    <StorefrontLayout>
      <Suspense fallback={<StorefrontLoadingFallback />}>
        {children}
      </Suspense>
    </StorefrontLayout>
  </MaintenanceGuard>
);

const App = () => {
  useZoomPrevention(true);

  return (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <AdminAuthProvider>
          <SiteModeProvider>
            <BrowserRouter>
              <ScrollToTop />
              <PageLoader />
              <Routes>
                {/* Storefront routes — guarded by maintenance mode */}
                <Route path="/" element={<StorefrontRoute><Index /></StorefrontRoute>} />
                <Route path="/products" element={<StorefrontRoute><ProductListing /></StorefrontRoute>} />
                <Route path="/product/:id" element={<StorefrontRoute><ProductDetail /></StorefrontRoute>} />
                <Route path="/cart" element={<StorefrontRoute><Cart /></StorefrontRoute>} />
                <Route path="/checkout" element={<StorefrontRoute><Checkout /></StorefrontRoute>} />
                <Route path="/order-success" element={<StorefrontRoute><OrderSuccess /></StorefrontRoute>} />
                <Route path="/track-order" element={<StorefrontRoute><TrackOrder /></StorefrontRoute>} />

                {/* Policy pages — legacy routes kept for backwards compatibility */}
                <Route path="/policies/privacy" element={<StorefrontRoute><PrivacyPolicy /></StorefrontRoute>} />
                <Route path="/policies/terms" element={<StorefrontRoute><TermsConditions /></StorefrontRoute>} />
                <Route path="/policies/returns" element={<StorefrontRoute><ReturnPolicy /></StorefrontRoute>} />
                <Route path="/policies/shipping" element={<StorefrontRoute><ShippingPolicy /></StorefrontRoute>} />
                

                {/* Dynamic CMS pages */}
                <Route path="/page/:slug" element={<StorefrontRoute><DynamicPage /></StorefrontRoute>} />

                {/* Redirect old auth routes */}
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/signup" element={<Navigate to="/" replace />} />
                <Route path="/account/*" element={<Navigate to="/track-order" replace />} />

                {/* Maintenance page (direct access) */}
                <Route path="/maintenance" element={<Maintenance />} />

                {/* Admin routes — never blocked by maintenance */}
                <Route path="/admin/login" element={
                  <Suspense fallback={<AdminLoadingFallback />}>
                    <AdminLoginGuard><AdminLogin /></AdminLoginGuard>
                  </Suspense>
                } />
                <Route path="/admin/reset-password" element={
                  <Suspense fallback={<AdminLoadingFallback />}>
                    <AdminResetPassword />
                  </Suspense>
                } />
                <Route
                  path="/admin"
                  element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <AdminGuard>
                        <AdminLayout />
                      </AdminGuard>
                    </Suspense>
                  }
                >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<Suspense fallback={<AdminLoadingFallback />}><AdminDashboard /></Suspense>} />
                  <Route path="products" element={<Suspense fallback={<AdminLoadingFallback />}><AdminProducts /></Suspense>} />
                  <Route path="products/add" element={<Suspense fallback={<AdminLoadingFallback />}><AdminProductForm /></Suspense>} />
                  <Route path="products/edit/:id" element={<Suspense fallback={<AdminLoadingFallback />}><AdminProductForm /></Suspense>} />
                  <Route path="orders" element={<Suspense fallback={<AdminLoadingFallback />}><AdminOrders /></Suspense>} />
                  <Route path="orders/:id" element={<Suspense fallback={<AdminLoadingFallback />}><AdminOrderDetail /></Suspense>} />
                  <Route path="customers" element={<Suspense fallback={<AdminLoadingFallback />}><AdminCustomers /></Suspense>} />
                  <Route path="categories" element={<Suspense fallback={<AdminLoadingFallback />}><AdminCategories /></Suspense>} />
                  <Route path="coupons" element={<Suspense fallback={<AdminLoadingFallback />}><AdminCoupons /></Suspense>} />
                  <Route path="analytics" element={<Suspense fallback={<AdminLoadingFallback />}><AdminAnalytics /></Suspense>} />
                  
                  <Route path="pages" element={<Suspense fallback={<AdminLoadingFallback />}><AdminPages /></Suspense>} />
                  <Route path="pages/new" element={<Suspense fallback={<AdminLoadingFallback />}><AdminPageEditor /></Suspense>} />
                  <Route path="pages/edit/:id" element={<Suspense fallback={<AdminLoadingFallback />}><AdminPageEditor /></Suspense>} />
                  <Route path="settings" element={<Suspense fallback={<AdminLoadingFallback />}><AdminSiteSettings /></Suspense>} />
                  <Route path="payments" element={<Suspense fallback={<AdminLoadingFallback />}><AdminPayments /></Suspense>} />
                </Route>

                <Route path="*" element={<StorefrontRoute><NotFound /></StorefrontRoute>} />
              </Routes>
            </BrowserRouter>
          </SiteModeProvider>
        </AdminAuthProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
  );
};

export default App;
