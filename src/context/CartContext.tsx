"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Service, ServicePlan } from "@/data/services";

export type CartItem = {
  service: Service;
  quantity: number;
  planId?: string;
  planName?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (service: Service, plan?: ServicePlan | null) => void;
  removeItem: (serviceId: string, planId?: string) => void;
  updateQuantity: (serviceId: string, quantity: number, planId?: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function matches(i: CartItem, serviceId: string, planId?: string) {
  return i.service.id === serviceId && (i.planId || undefined) === (planId || undefined);
}

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

  const addItem = (service: Service, plan?: ServicePlan | null) => {
    const planId = plan?.id;
    const planName = plan?.name;
    const priced: Service = plan
      ? { ...service, price: plan.price, name: `${service.name} — ${plan.name}` }
      : service;

    setItems((prev) => {
      const existing = prev.find((i) => matches(i, service.id, planId));
      if (existing) {
        return prev.map((i) =>
          matches(i, service.id, planId) ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { service: priced, quantity: 1, planId, planName }];
    });
  };

  const removeItem = (serviceId: string, planId?: string) => {
    setItems((prev) => prev.filter((i) => !matches(i, serviceId, planId)));
  };

  const updateQuantity = (serviceId: string, quantity: number, planId?: string) => {
    if (quantity < 1) {
      removeItem(serviceId, planId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (matches(i, serviceId, planId) ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => {
    const disc = i.service.discountPercent || 0;
    const unit = disc > 0 ? i.service.price * (1 - disc / 100) : i.service.price;
    return sum + unit * i.quantity;
  }, 0);
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
