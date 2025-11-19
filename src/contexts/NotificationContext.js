import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'info', duration = 4000) => {
    const id = Math.random();
    const notification = { id, message, type };

    setNotifications(prev => [...prev, notification]);

    if (duration) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const success = useCallback((message, duration) => showNotification(message, 'success', duration), [showNotification]);
  const error = useCallback((message, duration) => showNotification(message, 'error', duration), [showNotification]);
  const warning = useCallback((message, duration) => showNotification(message, 'warning', duration), [showNotification]);
  const info = useCallback((message, duration) => showNotification(message, 'info', duration), [showNotification]);
  const clearAll = useCallback(() => setNotifications([]), []);

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification, success, error, warning, info, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de NotificationProvider');
  }
  return context;
};
