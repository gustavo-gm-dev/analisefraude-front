import React, { useState } from 'react';
import { NotificationContainer } from './NotificationContainer';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import PixScreen from './screens/PixScreen';
import ResultScreen from './screens/ResultScreen';
import { useAuth } from '../contexts/AuthContext';

const AppContainer = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [pixResult, setPixResult] = useState(null);
  const { token, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLoginSuccess={() => setCurrentScreen('home')} />;
      case 'home':
        return <HomeScreen onGoToPix={() => setCurrentScreen('pix')} onLogout={handleLogout} />;
      case 'pix':
        return <PixScreen onBack={() => setCurrentScreen('home')} onConfirm={(result) => {
          setPixResult(result);
          setCurrentScreen('resultado');
        }} />;
      case 'resultado':
        return <ResultScreen result={pixResult} onBack={() => setCurrentScreen('home')} onLogout={handleLogout} />;
      default:
        return <LoginScreen onLoginSuccess={() => setCurrentScreen('home')} />;
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="mobile-frame">
        <div className="mobile-frame::before"></div>
        <div className="status-bar">
          <div className="status-bar-left">
            <span>9:41</span>
          </div>
          <div className="status-bar-center">
            🔒 Seguro
          </div>
          <div className="status-bar-right">
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        <NotificationContainer />

        <div className="flex-1 overflow-hidden bg-gray-100 flex flex-col">
          {renderScreen()}
        </div>

        <div className="home-indicator"></div>
      </div>
    </div>
  );
};

export default AppContainer;
