import { lazy, Suspense } from "react";
import { useZoomPrevention } from "@/hooks/useZoomPrevention";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { BackToTop } from "@/components/layout/BackToTop";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import Index from "./pages/Index";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import TrackOrder from "./pages/TrackOrder";
import NotFound from "./pages/NotFound";

// Policy pages
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import TermsConditions from "./pages/policies/TermsConditions";
import ReturnPolicy from "./pages/policies/ReturnPolicy";
import ShippingPolicy from "./pages/policies/ShippingPolicy";

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

const queryClient = new QueryClient();

// Admin loading fallback
const AdminLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-white/40">Loading…</p>
    </div>
  </div>
);

// Protected route wrapper — redirects to login, preserves intended path
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isAdmin, isLoading, user } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return <AdminLoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
        <div className="glass-strong rounded-2xl p-8 max-w-md text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
            <span className="text-destructive text-xl font-bold">✕</span>
          </div>
          <h2 className="text-xl font-bold text-white">Access Denied</h2>
          <p className="text-sm text-white/50">You don't have admin privileges. Contact a super admin to get access.</p>
          <button
            onClick={() => window.location.href = '/admin/login'}
            className="text-accent text-sm hover:underline"
          >
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

const App = () => {
  useZoomPrevention(true);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Storefront routes */}
              <Route path="/" element={<StorefrontLayout><Index /></StorefrontLayout>} />
              <Route path="/products" element={<StorefrontLayout><ProductListing /></StorefrontLayout>} />
              <Route path="/product/:id" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
              <Route path="/cart" element={<StorefrontLayout><Cart /></StorefrontLayout>} />
              <Route path="/checkout" element={<StorefrontLayout><Checkout /></StorefrontLayout>} />
              <Route path="/order-success" element={<StorefrontLayout><OrderSuccess /></StorefrontLayout>} />
              <Route path="/track-order" element={<StorefrontLayout><TrackOrder /></StorefrontLayout>} />

              {/* Policy pages */}
              <Route path="/policies/privacy" element={<StorefrontLayout><PrivacyPolicy /></StorefrontLayout>} />
              <Route path="/policies/terms" element={<StorefrontLayout><TermsConditions /></StorefrontLayout>} />
              <Route path="/policies/returns" element={<StorefrontLayout><ReturnPolicy /></StorefrontLayout>} />
              <Route path="/policies/shipping" element={<StorefrontLayout><ShippingPolicy /></StorefrontLayout>} />

              {/* Redirect old auth routes */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/signup" element={<Navigate to="/" replace />} />
              <Route path="/account/*" element={<Navigate to="/track-order" replace />} />

              {/* Admin routes */}
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
              </Route>

              <Route path="*" element={<StorefrontLayout><NotFound /></StorefrontLayout>} />
            </Routes>
          </BrowserRouter>
        </AdminAuthProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
