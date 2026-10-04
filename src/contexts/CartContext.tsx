import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  brand: string;
  variantSelections?: Record<string, string>;
  variantKey?: string; // unique key for variant combo
}

interface AppliedCoupon {
  code: string;
  discount: number; // percentage
  minOrder: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  appliedCoupon: AppliedCoupon | null;
  discountAmount: number;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  /** Re-checks prices/stock against the store. Returns a message if anything changed. */
  refreshCart: () => Promise<string | null>;
}

const STORAGE_KEY = 'cz_cart_v1';
const CartContext = createContext<CartContextType | undefined>(undefined);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Only keep well-formed entries; prices are re-verified before checkout
    return parsed.filter(
      (i: any) => i && typeof i.id === 'string' && typeof i.name === 'string' &&
        typeof i.price === 'number' && i.price >= 0 &&
        Number.isInteger(i.quantity) && i.quantity > 0 && i.quantity <= 99
    ).slice(0, 50);
  } catch {
    return [];
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* storage full/blocked */ }
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const itemKey = item.variantKey || item.id;
      const existing = prev.find(i => (i.variantKey || i.id) === itemKey);
      if (existing) {
        return prev.map(i => (i.variantKey || i.id) === itemKey ? { ...i, quantity: Math.min(99, i.quantity + 1) } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => (i.variantKey || i.id) !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => (i.variantKey || i.id) !== id));
    } else {
      setItems(prev => prev.map(i => (i.variantKey || i.id) === id ? { ...i, quantity: Math.min(99, quantity) } : i));
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, []);

  const refreshCart = useCallback(async (): Promise<string | null> => {
    const current = items;
    const ids = [...new Set(current.map(i => i.id).filter(id => UUID_RE.test(id)))];
    if (current.length === 0) return null;
    const { data, error } = ids.length
      ? await supabase.from('products').select('id, price, stock, is_active, track_inventory').in('id', ids)
      : { data: [], error: null };
    if (error) return null; // network issue: server still re-validates at order time
    const map = new Map((data || []).map(p => [p.id, p]));
    let changed = false;
    const next: CartItem[] = [];
    for (const item of current) {
      const p = map.get(item.id);
      if (!p || !p.is_active) { changed = true; continue; }
      let qty = item.quantity;
      if (p.track_inventory !== false) {
        if (p.stock <= 0) { changed = true; continue; }
        if (qty > p.stock) { qty = p.stock; changed = true; }
      }
      // Base price changes only apply to items without variant modifiers
      let price = item.price;
      if (!item.variantKey && Math.abs(Number(p.price) - item.price) > 0.01) {
        price = Number(p.price); changed = true;
      }
      next.push({ ...item, quantity: qty, price });
    }
    if (!changed) return null;
    setItems(next);
    return 'Your cart was updated because product availability or pricing changed.';
  }, [items]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const discountAmount = appliedCoupon
    ? Math.round((totalPrice * appliedCoupon.discount) / 100)
    : 0;

  const applyCoupon = useCallback((coupon: AppliedCoupon) => {
    setAppliedCoupon(coupon);
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      totalItems, totalPrice,
      appliedCoupon, discountAmount, applyCoupon, removeCoupon, refreshCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
