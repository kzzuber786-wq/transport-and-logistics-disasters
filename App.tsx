import React, { useState, useEffect } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import { SplashScreen } from '@/components/SplashScreen';
import { Landing } from '@/pages/Landing';
import { RoleSelection } from '@/components/RoleSelection';
import { UserDashboard } from '@/pages/UserDashboard';
import { RescueDashboard } from '@/pages/RescueDashboard';
import { useApp } from '@/contexts/AppContext';

type AppScreen = 'splash' | 'landing' | 'role-selection' | 'dashboard';

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const { userRole, setUserRole, setUserName } = useApp();

  useEffect(() => {
    if (userRole) {
      setCurrentScreen('dashboard');
    }
  }, [userRole]);

  const handleSplashComplete = () => {
    setCurrentScreen('landing');
  };

  const handleLandingContinue = () => {
    setCurrentScreen('role-selection');
  };

  const handleRoleSelect = (role: 'civilian' | 'rescue') => {
    // Get user name
    const name = prompt(`Enter your name (${role === 'civilian' ? 'Civilian' : 'Rescue Team'}):`) || 
                 (role === 'civilian' ? 'Anonymous' : 'Rescue Operator');
    setUserName(name);
    setUserRole(role);
    setCurrentScreen('dashboard');
  };

  return (
    <>
      {currentScreen === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}
      {currentScreen === 'landing' && <Landing onContinue={handleLandingContinue} />}
      {currentScreen === 'role-selection' && <RoleSelection onSelectRole={handleRoleSelect} />}
      {currentScreen === 'dashboard' && (
        <>
          {userRole === 'civilian' && <UserDashboard />}
          {userRole === 'rescue' && <RescueDashboard />}
        </>
      )}
    </>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
