import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // التأكد من استرجاع البيانات بأمان
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, color) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find(x => x._id === product._id && x.size === size && x.color === color);
      if (existItem) {
        return prevItems.map(x => x._id === product._id && x.size === size && x.color === color 
          ? { ...existItem, quantity: existItem.quantity + 1 } : x);
      }
      return [...prevItems, { ...product, size, color, quantity: 1 }];
    });
  };

  const removeFromCart = (id, size, color) => {
    setCartItems(prev => prev.filter(x => !(x._id === id && x.size === size && x.color === color)));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems: cartItems || [], addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) return { cartItems: [], addToCart: () => {}, removeFromCart: () => {}, clearCart: () => {} };
  return context;
};