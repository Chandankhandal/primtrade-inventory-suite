import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen w-full bg-slate-900 text-slate-100 m-0 p-0">
          <Routes>

            <Route path="/" element={<Navigate to="/auth" />} />

            <Route path="/auth" element={<AuthPage />} />

            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>


      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </AuthProvider>
  );
}

export default App;