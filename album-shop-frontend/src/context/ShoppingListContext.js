'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const ShoppingListContext = createContext();

export function ShoppingListProvider({ children }) {
  const [shoppingList, setShoppingList] = useState([]);

  // Load shopping list from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('shoppingList');
    if (stored) setShoppingList(JSON.parse(stored));
  }, []);

  // Save shopping list to localStorage on change
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

  // Add album to shopping list
  const addToShoppingList = (album, quantity = 1) => {
    setShoppingList((prev) => {
      const existing = prev.find(item => item.id === album.id);
      if (existing) {
        return prev.map(item =>
          item.id === album.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prev, { ...album, quantity }];
      }
    });
  };

  // Update quantity
  const updateQuantity = (albumId, quantity) => {
    setShoppingList((prev) =>
      prev.map(item =>
        item.id === albumId ? { ...item, quantity } : item
      )
    );
  };

  // Remove from shopping list
  const removeFromShoppingList = (albumId) => {
    setShoppingList((prev) => prev.filter(item => item.id !== albumId));
  };

  // Clear shopping list
  const clearShoppingList = () => setShoppingList([]);

  return (
    <ShoppingListContext.Provider value={{ shoppingList, addToShoppingList, updateQuantity, removeFromShoppingList, clearShoppingList }}>
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  return useContext(ShoppingListContext);
} 