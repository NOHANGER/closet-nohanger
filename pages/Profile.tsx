import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWardrobe } from '../context/WardrobeContext';
import { 
  Settings, Edit3, Camera, LogOut, Bell, Shield, 
  HelpCircle, ChevronRight, Ruler, 
  Wallet, Sparkles, Check, X
} from 'lucide-react';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { items, outfits } = useWardrobe();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock User State
  const [user, setUser] = useState({
    name: 'Fashionista',
    handle: '@style_icon',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    bio: 'Minimalist style lover. Sustainable fashion advocate.',
    sizes: {
      top: 'M',
      bottom: '28',
      shoe: '39'
    },
    preferences: ['Minimalist', 'Streetwear', 'Vintage', 'Sustainable']
  });

  const [editForm, setEditForm] = useState(user);

  // Calculate stats
  const totalValue = items.length * 45; // Estimated $45 per item avg
  
  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSizeChange = (key: string, value: string) => {
    setEditForm(prev => ({ 
      ...prev, 
      sizes: { ...prev.sizes, [key]: value } 
    }));
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
        alert("Logged out successfully");
        navigate('/');
    }
  };

  return (
    <div className="pb-24 min-h-screen bg-white">
      {/* Header / Cover */}
      <div className="h-32 bg-gray-100 w-full relative">
         <div className="absolute top-4 right-4 flex gap-2 z-20">
            <button 
                type="button"
                onClick={() => navigate('/profile/settings')}
                className="p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm cursor-pointer"
            >
                <Settings size={20} />
            </button>
         </div>
      </div>

      {/* Profile Info */}
      <div className="px-6 relative -mt-12 mb-6 z-10">
        <div className="flex justify-between items-end mb-4">
            <div className="relative group cursor-pointer" onClick={() => !isEditing && setIsEditing(true)}>
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                    <img src={isEditing ? editForm.avatar : user.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-black text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                        <Camera size={14} />
                    </button>
                )}
            </div>
            
            {!isEditing ? (
                <button 
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gray-100 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer"
                >
                    <Edit3 size={14} /> Edit Profile
                </button>
            ) : (
                <div className="flex gap-2">
                    <button onClick={handleCancel} className="p-2 bg-red-50 text-red-500 rounded-full cursor-pointer"><X size={18} /></button>
                    <button onClick={handleSave} className="p-2 bg-green-50 text-green-500 rounded-full cursor-pointer"><Check size={18} /></button>
                </div>
            )}
        </div>

        <div>
            {isEditing ? (
                <div className="space-y-3 mb-2">
                    <input 
                        value={editForm.name} 
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full text-2xl font-bold border-b border-gray-300 focus:border-black outline-none bg-transparent"
                    />
                    <input 
                        value={editForm.handle} 
                        onChange={(e) => handleChange('handle', e.target.value)}
                        className="w-full text-sm text-gray-500 border-b border-gray-300 focus:border-black outline-none bg-transparent"
                    />
                     <textarea 
                        value={editForm.bio} 
                        onChange={(e) => handleChange('bio', e.target.value)}
                        className="w-full text-sm text-gray-600 border border-gray-200 rounded-lg p-2 focus:border-black outline-none bg-transparent"
                        rows={2}
                    />
                </div>
            ) : (
                <div onClick={() => setIsEditing(true)} className="cursor-pointer">
                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                    <p className="text-gray-500 text-sm font-medium mb-2">{user.handle}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{user.bio}</p>
                </div>
            )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 px-6 mb-8">
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <span className="block text-xl font-bold text-gray-900">{items.length}</span>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Items</span>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <span className="block text-xl font-bold text-gray-900">{outfits.length}</span>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Outfits</span>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <span className="block text-xl font-bold text-gray-900">${totalValue}</span>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Value</span>
        </div>
      </div>

      <div className="px-6 space-y-6">
          {/* Sizes Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Ruler size={18} /></div>
                  <h3 className="font-bold text-gray-900">My Sizes</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                  {['Top', 'Bottom', 'Shoe'].map((type) => (
                      <div key={type} className="flex flex-col gap-1">
                          <span className="text-xs text-gray-400 font-bold uppercase">{type}</span>
                          {isEditing ? (
                              <input 
                                value={editForm.sizes[type.toLowerCase() as keyof typeof editForm.sizes]}
                                onChange={(e) => handleSizeChange(type.toLowerCase(), e.target.value)}
                                className="w-full font-semibold border-b border-gray-200 focus:border-black outline-none"
                              />
                          ) : (
                              <span className="font-semibold text-gray-800">{user.sizes[type.toLowerCase() as keyof typeof user.sizes]}</span>
                          )}
                      </div>
                  ))}
              </div>
          </div>

          {/* Style Preferences */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Sparkles size={18} /></div>
                  <h3 className="font-bold text-gray-900">Style Preferences</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                  {(isEditing ? editForm.preferences : user.preferences).map((pref, idx) => (
                      <div key={idx} className="bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 flex items-center gap-1">
                          {pref}
                          {isEditing && <button className="hover:text-red-500"><X size={12} /></button>}
                      </div>
                  ))}
                  {isEditing && (
                      <button className="px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-xs font-bold text-gray-400 hover:border-gray-400 hover:text-gray-500">
                          + Add
                      </button>
                  )}
              </div>
          </div>

          {/* Premium Banner */}
          <div 
            onClick={() => navigate('/profile/premium')}
            className="bg-black rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-xl transform transition-transform active:scale-[0.98]"
          >
              <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="text-[#ccff00]" size={20} />
                      <h3 className="font-bold text-lg">DigiStyle Premium</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 pr-12">Get unlimited AI styling suggestions and advanced wardrobe analytics.</p>
                  <button className="bg-[#ccff00] text-black px-5 py-2 rounded-full text-xs font-bold hover:bg-white transition-colors pointer-events-auto">
                      Upgrade Now
                  </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00] rounded-full blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          </div>

          {/* Settings List */}
          <div className="space-y-1">
              <SettingsItem 
                icon={<Bell size={18} />} 
                label="Notifications" 
                onClick={() => navigate('/profile/notifications')}
              />
              <SettingsItem 
                icon={<Wallet size={18} />} 
                label="Billing & Subscription" 
                onClick={() => navigate('/profile/billing')}
              />
              <SettingsItem 
                icon={<Shield size={18} />} 
                label="Privacy & Security" 
                onClick={() => navigate('/profile/privacy')}
              />
              <SettingsItem 
                icon={<HelpCircle size={18} />} 
                label="Help & Support" 
                onClick={() => navigate('/profile/help')}
              />
              
              <button 
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-red-500 cursor-pointer"
              >
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                      <LogOut size={18} />
                  </div>
                  <span className="font-medium">Log Out</span>
              </button>
          </div>
      </div>
    </div>
  );
};

const SettingsItem: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void }> = ({ icon, label, onClick }) => (
    <button 
        type="button"
        onClick={onClick} 
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group cursor-pointer active:bg-gray-100"
    >
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                {icon}
            </div>
            <span className="font-medium text-gray-700">{label}</span>
        </div>
        <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-600" />
    </button>
);