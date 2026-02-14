import React, { useState } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { Plus, Check, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import { Outfit } from '../types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Planner: React.FC = () => {
  const { outfits, deleteOutfit } = useWardrobe();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMonthView, setIsMonthView] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Filter outfits for the selected date
  const todaysOutfits = outfits.filter(o => {
      const outfitDate = new Date(o.scheduledDate || o.dateCreated);
      return outfitDate.toDateString() === selectedDate.toDateString();
  });

  // Generate Week Strip (7 days around selected date or just next 7 days)
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    // Start from today if selected date is far off, or center around selected?
    // Let's keep it simple: Start from -2 days of "today" so we see a bit of history
    const base = new Date(); 
    d.setDate(base.getDate() + i - 2); 
    return d;
  });

  // Generate Month Grid
  const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const days = [];
      
      // Pad empty days at start
      for (let i = 0; i < firstDay.getDay(); i++) {
          days.push(null);
      }
      
      // Actual days
      for (let i = 1; i <= lastDay.getDate(); i++) {
          days.push(new Date(year, month, i));
      }
      return days;
  };

  const monthDays = getDaysInMonth(currentMonth);

  const handleMonthChange = (offset: number) => {
      const newMonth = new Date(currentMonth);
      newMonth.setMonth(newMonth.getMonth() + offset);
      setCurrentMonth(newMonth);
  };

  return (
    <div className="p-4 pt-8 max-w-md mx-auto w-full pb-24">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div onClick={() => setIsMonthView(!isMonthView)} className="cursor-pointer group">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">
                {isMonthView 
                    ? currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
                }
            </h1>
            {isMonthView ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          <p className="text-gray-500">
            {isMonthView 
                ? "Select a date to view outfits" 
                : selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
            }
          </p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => {
                    const now = new Date();
                    setSelectedDate(now);
                    setCurrentMonth(now);
                }}
                className="p-2 rounded-full bg-gray-100 text-gray-600"
            >
                <CalendarIcon size={18} />
            </button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="mb-8 transition-all duration-300">
        {isMonthView ? (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => handleMonthChange(-1)} className="p-1"><ChevronLeft size={20} /></button>
                    <span className="font-bold text-sm">{currentMonth.toLocaleDateString('en-US', { month: 'long' })}</span>
                    <button onClick={() => handleMonthChange(1)} className="p-1"><ChevronRight size={20} /></button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                    {DAYS.map(d => <span key={d} className="text-xs text-gray-400 font-medium mb-2">{d.charAt(0)}</span>)}
                    {monthDays.map((date, idx) => (
                        <button 
                            key={idx}
                            disabled={!date}
                            onClick={() => {
                                if (date) {
                                    setSelectedDate(date);
                                    setIsMonthView(false);
                                }
                            }}
                            className={`
                                h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium
                                ${!date ? 'invisible' : ''}
                                ${date && date.toDateString() === selectedDate.toDateString() ? 'bg-black text-[#ccff00]' : 'hover:bg-gray-50'}
                                ${date && date.toDateString() === new Date().toDateString() ? 'border border-[#ccff00]' : ''}
                            `}
                        >
                            {date?.getDate()}
                        </button>
                    ))}
                </div>
            </div>
        ) : (
            <div className="flex justify-between overflow-x-auto no-scrollbar pb-2">
                {weekDates.map((date, idx) => {
                const isSelected = date.getDate() === selectedDate.getDate();
                return (
                    <button
                    key={idx}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center justify-center min-w-[48px] h-16 rounded-xl transition-all ${
                        isSelected 
                        ? 'bg-[#ccff00] text-black shadow-md scale-105' 
                        : 'bg-transparent text-gray-400 hover:bg-gray-50'
                    }`}
                    >
                    <span className="text-xs font-medium mb-1">{DAYS[date.getDay()]}</span>
                    <span className={`text-base font-bold ${isSelected ? 'text-black' : 'text-gray-800'}`}>
                        {date.getDate()}
                    </span>
                    </button>
                );
                })}
            </div>
        )}
      </div>

      {/* Planned Outfits Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Planned for today
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{todaysOutfits.length}</span>
        </h2>

        {todaysOutfits.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-100 rounded-2xl p-8 text-center">
                <p className="text-gray-400 text-sm mb-4">No outfits planned yet.</p>
                <div className="grid grid-cols-2 gap-3">
                     <ActionCard icon="wardrobe" label="Browse Wardrobe" color="bg-blue-50" iconColor="text-blue-500" />
                     <ActionCard icon="sparkles" label="Create Styling" color="bg-purple-50" iconColor="text-purple-500" />
                </div>
            </div>
        ) : (
            <div className="space-y-4">
                {todaysOutfits.map(outfit => (
                    <div key={outfit.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative group">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                            {outfit.items.map(item => (
                                <div key={item.id} className="w-20 h-24 flex-shrink-0 bg-gray-50 rounded-lg p-1 border border-gray-100">
                                    <img src={item.imageUrl} className="w-full h-full object-contain" alt="item" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                            <span className="text-xs text-gray-500 font-medium">
                                {outfit.tags.length > 0 ? `#${outfit.tags[0]}` : 'Casual Outfit'}
                            </span>
                            <span className="text-xs text-gray-400">
                                {new Date(outfit.dateCreated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                         <button 
                            onClick={() => deleteOutfit(outfit.id)}
                            className="absolute top-2 right-2 p-1.5 bg-gray-100 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>

       {/* Events Section */}
       <div className="w-full bg-purple-100 rounded-xl p-4 flex items-center justify-center mb-6 cursor-pointer hover:bg-purple-200 transition-colors">
            <span className="text-purple-900 font-medium text-sm flex items-center gap-2">
                <Plus size={16} /> Add event to calendar
            </span>
       </div>
    </div>
  );
};

const ActionCard: React.FC<{ icon: string, label: string, color: string, iconColor: string }> = ({ icon, label, color, iconColor }) => {
    // Mapping icons for simplicity
    const IconComponent = () => {
        if (icon === 'wardrobe') return <div className="border-2 border-current rounded-md p-1 w-6 h-6 flex items-center justify-center">W</div>;
        if (icon === 'shirt') return <div className="border-2 border-current rounded-md p-1 w-6 h-6 flex items-center justify-center">S</div>;
        if (icon === 'sparkles') return <div className="border-2 border-current rounded-full p-1 w-6 h-6 flex items-center justify-center">D</div>;
        return <div className="border-2 border-current rounded-md p-1 w-6 h-6 flex items-center justify-center">P</div>;
    }

    return (
        <button className={`${color} h-24 rounded-2xl flex flex-col items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-sm w-full`}>
            <div className={`${iconColor} text-xl`}>
                <IconComponent />
            </div>
            <span className="text-gray-700 font-medium text-xs px-2 leading-tight">{label}</span>
        </button>
    )
}