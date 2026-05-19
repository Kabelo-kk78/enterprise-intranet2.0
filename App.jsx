import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Approvals from './pages/Approvals';
import UserManagement from './pages/admin/UserManagement';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={
        <AuthLayout>
          <Login />
        </AuthLayout>
      } />
      
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="documents" element={<Documents />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
