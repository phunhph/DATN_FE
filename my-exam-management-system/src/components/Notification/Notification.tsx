import React, { useState, useEffect } from "react";
import "./Notification.scss";

type NotificationProps = {
  notifications: Array<{ message: string; isSuccess: boolean }>;
  clearNotifications: () => void;
};

const Notification: React.FC<NotificationProps> = ({ notifications, clearNotifications }) => {
  const [currentNotification, setCurrentNotification] = useState<{ message: string; isSuccess: boolean } | null>(null);

  useEffect(() => {
    if (notifications.length > 0) {
      setCurrentNotification(notifications[0]);
    }
  }, [notifications]);

  useEffect(() => {
    if (currentNotification) {
      const timer = setTimeout(() => {
        setCurrentNotification(null);
        clearNotifications();
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [currentNotification, clearNotifications]);

  if (!currentNotification) {
    return null;
  }

  return (
    <div
      className={`notification ${
        currentNotification.isSuccess ? "notification-success" : "notification-error"
      }`}
    >
      <div className="notification-message">{currentNotification.message}</div>
      <div className="notification-progress-container">
        <div className="notification-progress"></div>
      </div>
    </div>
  );
};

export default Notification;
