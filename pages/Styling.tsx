import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWardrobe } from '../context/WardrobeContext';
import { Save, Share, RefreshCw, X, Check, Calendar, Clock } from 'lucide-react';

export const Styling: React.FC = () => {
  const navigate = useNavigate();
  const { items, createOutfit } = useWardrobe();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  
  // Save Modal State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [scheduleTime, setScheduleTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  // Filter items that are selected
  const activeItems = items.filter(item => selectedItems.includes(item.id));

  const toggleItem = (id: string) => {
    if (selectedItems.includes(id)) {
        setSelectedItems(prev => prev.filter(i => i !== id));
    } else {
        setSelectedItems(prev => [...prev, id]);
    }
  };

  const handleSaveClick = () => {
    if (activeItems.length === 0) return;
    setIsSaveModalOpen(true);
  };

  const confirmSave = () => {
    const dateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    const timestamp = dateTime.getTime();

    const newOutfit = {
        id: `outfit_${Date.now()}`,
        items: activeItems,
        dateCreated: Date.now(),
        scheduledDate: timestamp, 
        tags: ['Stylist']
    };

    createOutfit(newOutfit);
    setIsSaveModalOpen(false);
    
    // Provide feedback and navigation options
    if (window.confirm(`Outfit scheduled for ${dateTime.toLocaleDateString()} at ${scheduleTime}! Go to Planner?`)) {
        navigate('/');
    } else {
        setSelectedItems([]);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col pb-20 relative">
        {/* Header */}
        <div className="px-4 py-3 border-b flex justify-between items-center bg-white z-10">
            <h1 className="font-bold text-lg">Styling Canvas</h1>
            <button 
                onClick={handleSaveClick} 
                disabled={activeItems.length === 0} 
                className="bg-[#ccff00] text-black px-4 py-1.5 rounded-full text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-1"
            >
                <Check size={14} strokeWidth={3} /> Save
            </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] relative overflow-hidden p-4 touch-none">
             {activeItems.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <p className="text-sm font-medium">Tap "Add Items" to start styling</p>
                    <p className="text-xs mt-2 text-gray-300">Drag items around canvas</p>
                 </div>
             ) : (
                 <div className="w-full h-full relative">
                    {/* Simple scattered layout simulation */}
                    {activeItems.map((item, index) => (
                        <div 
                            key={item.id} 
                            className="absolute transition-all duration-300"
                            style={{ 
                                top: `${20 + (index * 10) % 50}%`,
                                left: `${10 + (index * 15) % 50}%`,
                                transform: `rotate(${index % 2 === 0 ? '-6deg' : '6deg'})`,
                                width: '45%',
                                zIndex: index
                            }}
                        >
                            <div className="relative group">
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.subCategory} 
                                    className="w-full h-auto drop-shadow-xl select-none pointer-events-none" 
                                />
                                <button 
                                    onClick={() => toggleItem(item.id)} 
                                    className="absolute -top-3 -right-3 bg-white text-red-500 rounded-full p-1.5 shadow-md opacity-100 active:scale-90 transition-transform"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                 </div>
             )}
        </div>

        {/* Toolbar */}
        <div className="bg-white border-t p-4 pb-2 z-20">
            <div className="flex justify-between items-center mb-4">
                <button 
                    onClick={() => setSelectedItems([])} 
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                    title="Clear Canvas"
                >
                    <RefreshCw size={20} />
                </button>
                
                <button 
                    onClick={() => setShowPicker(!showPicker)} 
                    className="bg-black text-white px-6 py-3 rounded-xl font-bold shadow-lg transform -translate-y-6 flex items-center gap-2 hover:scale-105 transition-transform"
                >
                    {showPicker ? 'Close Closet' : 'Add Items +'}
                </button>

                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <Share size={20} />
                </button>
            </div>
            
            {/* Inline Picker */}
            {showPicker && (
                <div className="h-56 overflow-y-auto no-scrollbar pb-4 border-t pt-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Wardrobe</p>
                        <button onClick={() => setShowPicker(false)}><X size={14} className="text-gray-400" /></button>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {items.map(item => (
                            <button 
                                key={item.id} 
                                onClick={() => toggleItem(item.id)}
                                className={`aspect-[4/5] rounded-lg border-2 overflow-hidden p-1 transition-all ${selectedItems.includes(item.id) ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-100 bg-white'}`}
                            >
                                <img src={item.imageUrl} className="w-full h-full object-contain" alt="wardrobe item" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Save Modal */}
        {isSaveModalOpen && (
            <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Schedule Outfit</h2>
                        <button onClick={() => setIsSaveModalOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={18} /></button>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="date" 
                                    value={scheduleDate}
                                    onChange={(e) => setScheduleDate(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 font-medium focus:outline-none focus:border-black transition-colors"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Time</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="time" 
                                    value={scheduleTime}
                                    onChange={(e) => setScheduleTime(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 font-medium focus:outline-none focus:border-black transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={confirmSave}
                        className="w-full bg-black text-[#ccff00] py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-lg flex items-center justify-center gap-2"
                    >
                        Confirm & Save <Check size={20} />
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};