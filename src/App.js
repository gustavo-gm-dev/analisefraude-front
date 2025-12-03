import React, { useCallback } from 'react';
import { NotificationProvider } from './contexts/NotificationContext';
import AppContainer from './components/AppContainer';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AppContainer />
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
