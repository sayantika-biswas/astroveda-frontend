// context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from '../utils/axios';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { isLoggedIn } = useAuth();

  // Fetch initial counts
  useEffect(() => {
    if (isLoggedIn) {
      fetchCartCount();
      fetchWishlistCount();
    } else {
      // For guest users, you might want to use localStorage or sessionStorage
      const savedCartCount = localStorage.getItem('cartItemsCount');
      const savedWishlistCount = localStorage.getItem('wishlistItemsCount');
      if (savedCartCount) setCartCount(parseInt(savedCartCount));
      if (savedWishlistCount) setWishlistCount(parseInt(savedWishlistCount));
    }
  }, [isLoggedIn]);

  const fetchCartCount = async () => {
    try {
      const response = await axios.get('/cart');
      let count = 0;
      
      if (response.data.success) {
        count = response.data.cart?.items?.length || 0;
      } else if (response.data.items) {
        count = response.data.items.length || 0;
      }
      
      setCartCount(count);
      localStorage.setItem('cartItemsCount', count.toString());
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const fetchWishlistCount = async () => {
    try {
      const response = await axios.get('/wishlist');
      let count = 0;
      
      if (response.data.success) {
        count = response.data.wishlist?.products?.length || 0;
      } else if (response.data.products) {
        count = response.data.products.length || 0;
      }
      
      setWishlistCount(count);
      localStorage.setItem('wishlistItemsCount', count.toString());
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
    }
  };

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
    localStorage.setItem('cartItemsCount', newCount.toString());
  };

  const updateWishlistCount = (newCount) => {
    setWishlistCount(newCount);
    localStorage.setItem('wishlistItemsCount', newCount.toString());
  };

  const incrementCartCount = () => {
    setCartCount(prev => {
      const newCount = prev + 1;
      localStorage.setItem('cartItemsCount', newCount.toString());
      return newCount;
    });
  };

  const decrementCartCount = () => {
    setCartCount(prev => {
      const newCount = Math.max(0, prev - 1);
      localStorage.setItem('cartItemsCount', newCount.toString());
      return newCount;
    });
  };

  const incrementWishlistCount = () => {
    setWishlistCount(prev => {
      const newCount = prev + 1;
      localStorage.setItem('wishlistItemsCount', newCount.toString());
      return newCount;
    });
  };

  const decrementWishlistCount = () => {
    setWishlistCount(prev => {
      const newCount = Math.max(0, prev - 1);
      localStorage.setItem('wishlistItemsCount', newCount.toString());
      return newCount;
    });
  };

  const value = {
    cartCount,
    wishlistCount,
    updateCartCount,
    updateWishlistCount,
    incrementCartCount,
    decrementCartCount,
    incrementWishlistCount,
    decrementWishlistCount,
    refreshCartCount: fetchCartCount,
    refreshWishlistCount: fetchWishlistCount,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};