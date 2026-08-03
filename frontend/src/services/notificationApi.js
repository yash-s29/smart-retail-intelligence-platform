// src/services/notificationApi.js

const STORAGE_KEY = "srip_notifications";

/**
 * Get all notifications
 */
export const getNotifications = async () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading notifications:", error);
    return [];
  }
};

/**
 * Save all notifications
 */
export const saveNotifications = async (notifications) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(notifications)
    );

    return true;
  } catch (error) {
    console.error("Error saving notifications:", error);
    return false;
  }
};

/**
 * Add notification
 */
export const createNotification = async ({
  title,
  message,
  type = "info",
}) => {
  const notifications = await getNotifications();

  const newNotification = {
    id: Date.now(),
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  };

  notifications.unshift(newNotification);

  await saveNotifications(notifications);

  return newNotification;
};

/**
 * Delete notification
 */
export const deleteNotification = async (id) => {
  const notifications = await getNotifications();

  const updated = notifications.filter(
    (item) => item.id !== id
  );

  await saveNotifications(updated);

  return true;
};

/**
 * Mark one notification as read
 */
export const markNotificationRead = async (id) => {
  const notifications = await getNotifications();

  const updated = notifications.map((item) =>
    item.id === id
      ? { ...item, read: true }
      : item
  );

  await saveNotifications(updated);

  return true;
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async () => {
  const notifications = await getNotifications();

  const updated = notifications.map((item) => ({
    ...item,
    read: true,
  }));

  await saveNotifications(updated);

  return true;
};

/**
 * Clear all notifications
 */
export const clearNotifications = async () => {
  localStorage.removeItem(STORAGE_KEY);

  return true;
};

/**
 * Get unread count
 */
export const getUnreadCount = async () => {
  const notifications = await getNotifications();

  return notifications.filter(
    (item) => !item.read
  ).length;
};