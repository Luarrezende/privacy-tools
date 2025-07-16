import React, { useEffect } from 'react';
import { useNotifications } from '../../../context/NotificationContext';
import styles from './NotificationContainer.module.css';

const NotificationContainer = () => {
  const { notifications, removeNotification, addNotification } = useNotifications();

  useEffect(() => {
    const handleCustomNotification = (event) => {
      const { message, type, duration } = event.detail;
      addNotification(message, type, duration);
    };

    window.addEventListener('showNotification', handleCustomNotification);
    
    return () => {
      window.removeEventListener('showNotification', handleCustomNotification);
    };
  }, [addNotification]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-times-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-info-circle';
    }
  };

  const handleClose = (id) => {
    removeNotification(id);
  };

  if (notifications.length === 0) return null;

  return (
    <div className={styles.container}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${styles.notification} ${styles[notification.type]}`}
        >
          <div className={styles.content}>
            <i className={getIcon(notification.type)}></i>
            <span className={styles.message}>{notification.message}</span>
          </div>
          
          <button
            className={styles.closeBtn}
            onClick={() => handleClose(notification.id)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
