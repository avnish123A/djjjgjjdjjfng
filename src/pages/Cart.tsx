import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Cart = () => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
  const shipping = totalPrice >= 100 ? 0 : 9.99;
  const total = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items yet.
            </p>
            <Button variant="accent" asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Shopping Cart</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <h1 className="text-2xl lg:text-3xl font-bold mb-8">
          Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-4 p-4 border border-border rounded-xl"
                >
                  {/* Image */}
                  <Link to={`/product/${item.id}`} className="shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-secondary">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">{item.brand}</p>
                        <Link
                          to={`/product/${item.id}`}
                          className="font-medium text-sm sm:text-base hover:text-accent transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => {
                          removeItem(item.id);
                          toast('Item removed from cart');
                        }}
                        className="shrink-0 p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      {/* Quantity */}
                      <div className="inline-flex items-center border border-border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-secondary transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-sm font-medium tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-secondary transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 border border-border rounded-xl p-6 space-y-4">
              <h2 className="font-bold text-lg">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {/* Discount code */}
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code"
                      className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-xl">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Including taxes</p>
              </div>

              <Button variant="accent" size="lg" className="w-full gap-2">
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Button>

              <Link
                to="/products"
                className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Continue Shopping
              </Link>

              {shipping > 0 && (
                <p className="text-xs text-center text-muted-foreground">
                  Add ${(100 - totalPrice).toFixed(2)} more for free shipping
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;