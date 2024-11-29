import { Notification } from "@components/index";
import React, { createContext, useContext, useState } from "react";

// loại thông báo
type NotificationType = "Success" | "Error" | "Info" | "Alert";

type Notification = {
  type: NotificationType;
  message: string;
};

// context dạng function nhận type, message, không return
type NotificationContextType = {
  notify: (type: NotificationType, message: string) => void;
};

//khởi tạo context
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

//cung cấp context
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  //thêm notify vào mảng, loại bỏ notify khỏi mảng sau mỗi x giây
  const notify = (type: NotificationType, message: string) => {
    setNotifications((prev) => [...prev, { type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 5000);
  };

  return (
    // provider cung cấp fn notify(type,msg)
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="notification-anchor">
        {notifications.map((notification, index) => (
          <Notification key={index} type={notification.type} message={notification.message} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// hook cho thông báo
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
