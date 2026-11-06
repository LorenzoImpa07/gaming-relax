"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Service } from "@/data/services";

export type CartItem = {
  service: Service;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (service: Service) => void;
  removeItem: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("gr-cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {}
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("gr-cart", JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = (service: Service) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.service.id === service.id);
      if (existing) {
        return prev.map((i) =>
          i.service.id === service.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { service, quantity: 1 }];
    });
  };

  const removeItem = (serviceId: string) => {
    setItems((prev) => prev.filter((i) => i.service.id !== serviceId));
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(serviceId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.service.id === serviceId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.service.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
