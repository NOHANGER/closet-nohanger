import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Wallet, Shield, HelpCircle, Sparkles, Settings } from 'lucide-react';

interface SettingsPageProps {
  title: string;
  icon: React.ReactNode;
}

const SettingsPageLayout: React.FC<SettingsPageProps> = ({ title, icon }) => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-black">
                  {icon}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-gray-400 text-sm font-medium mb-8">This feature is coming soon to DigiStyle.</p>
              <button 
                onClick={() => navigate(-1)} 
                className="px-8 py-3 bg-black text-white rounded-full font-bold text-sm hover:scale-105 transition-transform cursor-pointer"
              >
                  Go Back
              </button>
        </div>
    );
};

export const NotificationsPage = () => <SettingsPageLayout title="Notifications" icon={<Bell size={32} className="opacity-20" />} />;
export const BillingPage = () => <SettingsPageLayout title="Billing & Subscription" icon={<Wallet size={32} className="opacity-20" />} />;
export const PrivacyPage = () => <SettingsPageLayout title="Privacy & Security" icon={<Shield size={32} className="opacity-20" />} />;
export const HelpPage = () => <SettingsPageLayout title="Help & Support" icon={<HelpCircle size={32} className="opacity-20" />} />;
export const PremiumPage = () => <SettingsPageLayout title="DigiStyle Premium" icon={<Sparkles size={32} className="opacity-20" />} />;
export const GeneralSettingsPage = () => <SettingsPageLayout title="General Settings" icon={<Settings size={32} className="opacity-20" />} />;
