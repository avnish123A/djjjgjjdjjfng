import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { BackToTop } from "@/components/layout/BackToTop";
import Index from "./pages/Index";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";

// Policy pages
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import TermsConditions from "./pages/policies/TermsConditions";
import ReturnPolicy from "./pages/policies/ReturnPolicy";
import ShippingPolicy from "./pages/policies/ShippingPolicy";

// Admin pages
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCoupons from "./pages/admin/AdminCoupons";

const queryClient = new QueryClient();

// Protected route wrapper for admin pages
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Storefront routes */}
              <Route path="/" element={<StorefrontLayout><Index /></StorefrontLayout>} />
              <Route path="/products" element={<StorefrontLayout><ProductListing /></StorefrontLayout>} />
              <Route path="/product/:id" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
              <Route path="/cart" element={<StorefrontLayout><Cart /></StorefrontLayout>} />
              <Route path="/checkout" element={<StorefrontLayout><Checkout /></StorefrontLayout>} />
              <Route path="/order-success" element={<StorefrontLayout><OrderSuccess /></StorefrontLayout>} />

              {/* Policy pages */}
              <Route path="/policies/privacy" element={<StorefrontLayout><PrivacyPolicy /></StorefrontLayout>} />
              <Route path="/policies/terms" element={<StorefrontLayout><TermsConditions /></StorefrontLayout>} />
              <Route path="/policies/returns" element={<StorefrontLayout><ReturnPolicy /></StorefrontLayout>} />
              <Route path="/policies/shipping" element={<StorefrontLayout><ShippingPolicy /></StorefrontLayout>} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <AdminLayout />
                  </AdminGuard>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/add" element={<AdminProductForm />} />
                <Route path="products/edit/:id" element={<AdminProductForm />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:id" element={<AdminOrderDetail />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="coupons" element={<AdminCoupons />} />
              </Route>

              <Route path="*" element={<StorefrontLayout><NotFound /></StorefrontLayout>} />
            </Routes>
          </BrowserRouter>
        </AdminAuthProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
