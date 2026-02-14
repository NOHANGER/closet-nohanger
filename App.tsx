import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { WardrobeProvider } from './context/WardrobeContext';
import { Layout } from './components/Layout';
import { Planner } from './pages/Planner';
import { Wardrobe } from './pages/Wardrobe';
import { AddItem } from './pages/AddItem';
import { Styling } from './pages/Styling';
import { Profile } from './pages/Profile';
import { 
  NotificationsPage, 
  BillingPage, 
  PrivacyPage, 
  HelpPage, 
  PremiumPage,
  GeneralSettingsPage
} from './pages/SettingsPages';

const App: React.FC = () => {
  return (
    <WardrobeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Planner />} />
            <Route path="wardrobe" element={<Wardrobe />} />
            <Route path="stylist" element={<Styling />} />
            <Route path="profile" element={<Profile />} />
            
            {/* Profile Sub-pages */}
            <Route path="profile/notifications" element={<NotificationsPage />} />
            <Route path="profile/billing" element={<BillingPage />} />
            <Route path="profile/privacy" element={<PrivacyPage />} />
            <Route path="profile/help" element={<HelpPage />} />
            <Route path="profile/premium" element={<PremiumPage />} />
            <Route path="profile/settings" element={<GeneralSettingsPage />} />
          </Route>
          {/* Add Item is full screen, outside layout */}
          <Route path="/add" element={<AddItem />} />
        </Routes>
      </Router>
    </WardrobeProvider>
  );
};

export default App;