import React from 'react';

export const Notification = ({ notification, onClose }) => {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${notification.type}`}>
      <span className="notification-icon">{icons[notification.type] || icons.info}</span>
      <span className="notification-text">{notification.message}</span>
      <button className="notification-close" onClick={onClose}>✕</button>
    </div>
  );
};
