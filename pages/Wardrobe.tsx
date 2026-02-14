import React, { useState } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { Category } from '../types';
import { Search, Heart, SlidersHorizontal, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Wardrobe: React.FC = () => {
  const { items, outfits } = useWardrobe();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter(item => {
    // Exact match for category or 'All'
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    
    // Search in subCategory or tags
    const matchesSearch = 
        (item.subCategory?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
        (item.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', ...Object.values(Category)];

  return (
    <div className="p-4 pt-6 max-w-md mx-auto w-full min-h-screen pb-24">
      {/* Header Profile Snippet */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">My Wardrobe</h1>
        <div className="flex gap-2">
            <button className="p-2 bg-white rounded-full shadow-sm text-gray-600 hover:text-red-500"><Heart size={20} /></button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="flex justify-between px-4 mb-6 text-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
            <p className="font-bold text-lg">{items.length}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Items</p>
        </div>
        <div className="w-[1px] bg-gray-100"></div>
        <div>
            <p className="font-bold text-lg">{outfits.length}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Outfits</p>
        </div>
        <div className="w-[1px] bg-gray-100"></div>
        <div>
            <p className="font-bold text-lg">$0</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Value</p>
        </div>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar mb-6 pb-2">
        {categories.map(cat => (
            <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex flex-col items-center min-w-[60px] space-y-2 group flex-shrink-0`}
            >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${activeCategory === cat ? 'border-black bg-black text-white' : 'border-transparent bg-gray-100 text-gray-400'}`}>
                    <span className="text-[10px] font-bold">
                        {cat === 'All' ? 'ALL' : cat.substring(0, 2).toUpperCase()}
                    </span>
                </div>
                <span className={`text-xs ${activeCategory === cat ? 'font-bold text-black' : 'text-gray-500'}`}>{cat}</span>
            </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search your closet..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-black transition-colors"
            />
        </div>
        <button className="bg-white border border-gray-200 rounded-lg w-12 flex items-center justify-center text-gray-500 hover:border-black hover:text-black transition-colors">
            <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Add New Button always visible as first option or separate? Let's keep it separate if filtered, or integrated if All */}
        <Link to="/add" className="aspect-[4/5] bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all group">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 mb-2 shadow-sm group-hover:scale-110 transition-transform">
                <Plus size={24} />
            </div>
            <span className="text-xs font-medium text-gray-500">Add Item</span>
        </Link>

        {filteredItems.map(item => (
            <div key={item.id} className="relative aspect-[4/5] bg-white rounded-xl shadow-sm overflow-hidden group border border-gray-100">
                <img src={item.imageUrl} alt={item.subCategory} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                <button className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart size={16} fill="currentColor" />
                </button>
                {/* Tag overlay */}
                <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded-md shadow-sm backdrop-blur-sm">
                    <p className="text-[10px] font-bold text-gray-800 uppercase">{item.subCategory || item.category}</p>
                </div>
            </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="py-10 text-center text-gray-400">
            <p>No items found in this category.</p>
        </div>
      )}
    </div>
  );
};