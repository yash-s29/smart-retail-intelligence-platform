import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getNotifications, saveNotifications } from "../services/notificationApi"; // Adjust path as needed

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load notifications from localStorage or API
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await getNotifications();

        if (data && data.length > 0) {
          setNotifications(data);
        } else {
          const defaultNotifications = [
            {
              id: 1,
              title: "Welcome",
              message: "Welcome to Smart Retail Intelligence Platform.",
              type: "info",
              read: false,
              createdAt: new Date().toISOString(),
            },
          ];

          setNotifications(defaultNotifications);
          await saveNotifications(defaultNotifications);
        }
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  // Save automatically whenever notifications change
  useEffect(() => {
    if (!loading) {
      saveNotifications(notifications);
    }
  }, [notifications, loading]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const addNotification = ({ title, message, type = "info", category = "system" }) => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      type,
      category,
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAllNotifications,
    }),
    [notifications, unreadCount, loading]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }
  return context;
}