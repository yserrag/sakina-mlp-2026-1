import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ScrollToTop } from '../components/utils/ScrollToTop'; // Must be the one above

// Page Imports
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { KidsPage } from '../pages/kids/KidsPage'; 
import { RevertJourney } from '../components/widgets/RevertJourney'; 
import { AiAssistant } from '../components/widgets/AiAssistant';     

// Placeholder for Settings
const SettingsPage = () => (
  <div className="min-h-screen bg-slate-950 p-6 pt-12">
    <h1 className="text-2xl font-bold text-white mb-4">Settings</h1>
    <div className="p-8 bg-slate-900 rounded-2xl border border-white/10 text-center text-slate-500">
      <p>Coming Soon</p>
    </div>
  </div>
);

export const App = () => {
  return (
    <BrowserRouter>
      {/* This invisible agent runs on every click to force top alignment */}
      <ScrollToTop />
      
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/reverts" element={<RevertJourney />} />
          <Route path="/kids" element={<KidsPage />} />
          <Route path="/ai" element={<AiAssistant />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};