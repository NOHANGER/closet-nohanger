import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Shirt, Sparkles, User, Plus } from 'lucide-react';

export const NavBar: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) => 
    `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-black' : 'text-gray-400'}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-16 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-full px-2">
        <NavLink to="/" className={linkClass}>
          <Calendar size={22} strokeWidth={2} />
          <span className="text-[10px] font-medium">Planner</span>
        </NavLink>
        
        <NavLink to="/wardrobe" className={linkClass}>
          <Shirt size={22} strokeWidth={2} />
          <span className="text-[10px] font-medium">Wardrobe</span>
        </NavLink>

        {/* Floating Action Button for Add */}
        <div className="relative -top-5">
            <NavLink to="/add" className="flex items-center justify-center w-14 h-14 bg-black rounded-full shadow-lg text-white">
                <Plus size={28} />
            </NavLink>
        </div>

        <NavLink to="/stylist" className={linkClass}>
          <Sparkles size={22} strokeWidth={2} />
          <span className="text-[10px] font-medium">Styling</span>
        </NavLink>

        <NavLink to="/profile" className={linkClass}>
          <User size={22} strokeWidth={2} />
          <span className="text-[10px] font-medium">Profile</span>
        </NavLink>
      </div>
    </div>
  );
};