"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addToCart as addToCartStorage,
  clearCart as clearCartStorage,
  getCartItemCount,
  getCartSubtotal,
  loadCart,
  removeCartLine,
  saveCart,
  updateCartQuantity,
} from "@/lib/cart/cart-storage";
import type { AddToCartInput, CartLine } from "@/lib/cart/types";

type CartContextValue = {
  items: CartLine[];
  ready: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (input: AddToCartInput) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveCart(items);
  }, [items, ready]);

  const addItem = useCallback((input: AddToCartInput) => {
    setItems((prev) => addToCartStorage(prev, input));
  }, []);

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    setItems((prev) => updateCartQuantity(prev, lineId, quantity));
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => removeCartLine(prev, lineId));
  }, []);

  const clear = useCallback(() => {
    setItems(clearCartStorage());
  }, []);

  const value = useMemo(
    () => ({
      items,
      ready,
      itemCount: getCartItemCount(items),
      subtotal: getCartSubtotal(items),
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [items, ready, addItem, setQuantity, removeItem, clear]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
