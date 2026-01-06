import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';

// Pages
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { KidsPage } from '../pages/kids/KidsPage';
import { RevertJourney } from '../components/widgets/RevertJourney'; // Using the Widget as the page for now
import { SettingsPage } from '../pages/settings/SettingsPage';

export const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* [CRITICAL FIX] Explicitly defining the Home Route */}
          <Route path="/" element={<DashboardPage />} />
          
          {/* Other Routes */}
          <Route path="/kids" element={<KidsPage />} />
          <Route path="/reverts" element={<RevertJourney />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Fallback */}
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;