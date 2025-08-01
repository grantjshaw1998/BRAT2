import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BibleProvider } from '../../contexts/BibleContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from '../Dashboard/Dashboard';
import BibleReader from '../Bible/BibleReader';
import SearchInterface from '../Search/SearchInterface';
import NotesManager from '../Notes/NotesManager';
import CirclesManager from '../Circles/CirclesManager';
import ReadingPlansManager from '../ReadingPlans/ReadingPlansManager';
import Settings from '../Settings/Settings';

function LayoutContent() {
  const { user } = useAuth();
  const [activeView, setActiveView] = React.useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'bible':
        return <BibleReader />;
      case 'search':
        return <SearchInterface />;
      case 'notes':
        return <NotesManager />;
      case 'circles':
        return <CirclesManager />;
      case 'reading-plans':
        return <ReadingPlansManager />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function Layout() {
  return (
    <BibleProvider>
      <LayoutContent />
    </BibleProvider>
  );
}

export default Layout;