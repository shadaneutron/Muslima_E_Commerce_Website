import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { API } from '@/config';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : null;

  const fetchWishlist = useCallback(async () => {
    if (!token) { setWishlistItems([]); return; }
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/api/wishlist/`, config);
      setWishlistItems(data);
    } catch {
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isWishlisted = (productId) =>
    wishlistItems.some((item) => item.product?._id === productId);

  const toggleWishlist = async (productId) => {
    if (!token) return { requiresAuth: true };
    try {
      const { data } = await axios.post(
        `${API}/api/wishlist/${productId}/`,
        {},
        config
      );
      await fetchWishlist();
      return { wishlisted: data.wishlisted };
    } catch (err) {
      console.error('Wishlist toggle failed:', err);
      return { error: true };
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount: wishlistItems.length,
      isWishlisted,
      toggleWishlist,
      fetchWishlist,
      loading,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) return {
    wishlistItems: [], wishlistCount: 0,
    isWishlisted: () => false,
    toggleWishlist: async () => ({ requiresAuth: true }),
    loading: false,
  };
  return ctx;
};
