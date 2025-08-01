import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForm from './components/Auth/AuthForm';
import Layout from './components/Layout/Layout';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={() => {}} />;
  }

  return <Layout />;
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#1a1a1a] text-white antialiased">
        <AppContent />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#374151',
              color: '#fff',
              border: '1px solid #4B5563'
            }
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App;