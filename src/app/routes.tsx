import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { RevertsPage } from '../pages/reverts/RevertsPage';
import { AiPage } from '../pages/ai/AiPage';
import { KidsPage } from '../pages/kids/KidsPage'; // [FACTS]: New Import

export const AppRoutes: React.FC<{ session: any }> = ({ session }) => {
  return (
    <Routes>
      <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/" />} />
      
      {/* Protected Routes */}
      <Route path="/" element={session ? <DashboardPage /> : <Navigate to="/login" />} />
      <Route path="/settings" element={session ? <SettingsPage /> : <Navigate to="/login" />} />
      <Route path="/reverts" element={session ? <RevertsPage /> : <Navigate to="/login" />} />
      <Route path="/ai" element={session ? <AiPage /> : <Navigate to="/login" />} />
      
      {/* [ACTION]: The Kids Route */}
      <Route path="/kids" element={session ? <KidsPage /> : <Navigate to="/login" />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};