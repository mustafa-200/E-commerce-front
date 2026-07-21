import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  fetchCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
} from "../api/cart";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCart();
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (variantId, qty = 1) => {
    const data = await addItemToCart(variantId, qty);
    setCart(data);
    return data;
  };

  const updateQty = async (cartItemId, qty) => {
    if (qty < 1) {
      return removeFromCart(cartItemId);
    }
    const data = await updateCartItem(cartItemId, qty);
    setCart(data);
    return data;
  };

  const removeFromCart = async (cartItemId) => {
    await removeCartItem(cartItemId);
    await loadCart();
  };

  const clearCart = () => {
    setCart(null);
  };

  const items = cart?.items ?? [];
  const count = cart?.items_count ?? 0;
  const total = cart?.total ?? 0;

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        total,
        loading,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}