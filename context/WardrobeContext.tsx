import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClothingItem, Outfit, Category, Season } from '../types';

interface WardrobeContextType {
  items: ClothingItem[];
  outfits: Outfit[];
  addItem: (item: ClothingItem) => void;
  deleteItem: (id: string) => void;
  createOutfit: (outfit: Outfit) => void;
  deleteOutfit: (id: string) => void;
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

// Mock Data
const MOCK_ITEMS: ClothingItem[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
    category: Category.TOPS,
    subCategory: 'T-Shirt',
    color: ['White'],
    season: [Season.SUMMER, Season.SPRING],
    tags: ['Basic', 'Casual'],
    dateAdded: Date.now()
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=400&q=80',
    category: Category.BOTTOMS,
    subCategory: 'Jeans',
    color: ['Blue'],
    season: [Season.ALL_SEASON],
    tags: ['Denim', 'Vintage'],
    dateAdded: Date.now()
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80',
    category: Category.SHOES,
    subCategory: 'Boots',
    color: ['Blue'],
    season: [Season.WINTER, Season.AUTUMN],
    tags: ['Leather'],
    dateAdded: Date.now()
  }
];

export const WardrobeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ClothingItem[]>(() => {
    try {
      const saved = localStorage.getItem('digistyle_items');
      return saved ? JSON.parse(saved) : MOCK_ITEMS;
    } catch (e) {
      console.error("Failed to load items", e);
      return MOCK_ITEMS;
    }
  });
  
  const [outfits, setOutfits] = useState<Outfit[]>(() => {
    try {
      const saved = localStorage.getItem('digistyle_outfits');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load outfits", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('digistyle_items', JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save items to localStorage. Storage full?", e);
      // In a real app, we would show a toast notification here
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('digistyle_outfits', JSON.stringify(outfits));
    } catch (e) {
      console.error("Failed to save outfits to localStorage", e);
    }
  }, [outfits]);

  const addItem = (item: ClothingItem) => {
    setItems(prev => [item, ...prev]);
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const createOutfit = (outfit: Outfit) => {
    setOutfits(prev => [outfit, ...prev]);
  };

  const deleteOutfit = (id: string) => {
    setOutfits(prev => prev.filter(o => o.id !== id));
  };

  return (
    <WardrobeContext.Provider value={{ items, outfits, addItem, deleteItem, createOutfit, deleteOutfit }}>
      {children}
    </WardrobeContext.Provider>
  );
};

export const useWardrobe = () => {
  const context = useContext(WardrobeContext);
  if (!context) throw new Error("useWardrobe must be used within WardrobeProvider");
  return context;
};