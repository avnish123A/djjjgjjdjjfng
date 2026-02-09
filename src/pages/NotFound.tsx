import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full text-center"
      >
        {/* Branded Illustration */}
        <div className="relative mb-8">
          <div className="text-[120px] lg:text-[160px] font-extrabold leading-none tracking-tighter text-foreground/5">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
              <Search className="h-8 w-8 text-accent" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-3">Page not found</h1>
        <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="gap-2 rounded-full bg-foreground text-background hover:bg-foreground/90 px-6">
            <Link to="/">
              <Home className="h-4 w-4" /> Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2 rounded-full px-6">
            <Link to="/products">
              Browse Products <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Popular Categories */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4 font-medium">Popular Categories</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Electronics', 'Fashion', 'Home & Living', 'Beauty'].map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat.toLowerCase().replace(/ & /g, '-')}`}
                className="px-4 py-2 bg-secondary rounded-full text-sm hover:bg-muted transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default NotFound;
