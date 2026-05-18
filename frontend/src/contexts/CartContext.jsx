import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('muslima_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('muslima_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size = 'Standard', color = 'Default') => {
    setCartItems((prev) => {
      const exists = prev.find(
        (x) => x._id === product._id && x.size === size && x.color === color
      );
      if (exists) {
        return prev.map((x) =>
          x._id === product._id && x.size === size && x.color === color
            ? { ...x, quantity: x.quantity + 1 }
            : x
        );
      }
      return [...prev, { ...product, size, color, quantity: 1 }];
    });
  };

  const removeFromCart = (id, size, color) => {
    setCartItems((prev) =>
      prev.filter((x) => !(x._id === id && x.size === size && x.color === color))
    );
  };

  const updateQuantity = (id, size, color, qty) => {
    if (qty < 1) {
      removeFromCart(id, size, color);
      return;
    }
    setCartItems((prev) =>
      prev.map((x) =>
        x._id === id && x.size === size && x.color === color
          ? { ...x, quantity: qty }
          : x
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const itemsPrice = cartItems.reduce((acc, x) => acc + x.price * x.quantity, 0);
  const shippingPrice = itemsPrice >= 1000 ? 0 : 50;
  const totalPrice = itemsPrice + shippingPrice;
  const itemCount = cartItems.reduce((acc, x) => acc + x.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems: cartItems || [],
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemsPrice,
      shippingPrice,
      totalPrice,
      itemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) return {
    cartItems: [], addToCart: () => {}, removeFromCart: () => {},
    updateQuantity: () => {}, clearCart: () => {},
    itemsPrice: 0, shippingPrice: 50, totalPrice: 0, itemCount: 0,
  };
  return ctx;
};