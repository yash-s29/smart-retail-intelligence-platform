import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getNotifications,
  saveNotifications,
} from "../services/notificationApi";

/* ============================================================
   CONTEXT
   ============================================================ */

const NotificationContext =
  createContext(null);

/* ============================================================
   CONSTANTS
   ============================================================ */

const STORAGE_KEY =
  "smartRetailNotifications";

const CHANNEL_NAME =
  "smart-retail-notifications";

const PREFERENCES_STORAGE_KEY =
  "smartRetailNotificationPreferences";

const WS_URL =
  import.meta.env
    .VITE_NOTIFICATIONS_WS_URL || "";

const MAX_NOTIFICATIONS = 250;

const DEFAULT_PREFERENCES = {
  lowStock: true,
  outOfStock: true,
  systemLogs: true,
  salesUpdates: true,
  forecastUpdates: true,
  desktopNotifications: false,
};

/* ============================================================
   HELPERS
   ============================================================ */

function generateId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function safeReadStorage(
  key,
  fallback = null
) {
  try {
    const value =
      localStorage.getItem(key);

    if (value === null) {
      return fallback;
    }

    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function safeWriteStorage(
  key,
  value
) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch (error) {
    console.warn(
      `Unable to save ${key}`,
      error
    );
  }
}

function normalizeNotification(
  notification
) {
  if (
    !notification ||
    typeof notification !== "object"
  ) {
    return null;
  }

  return {
    id:
      notification.id ??
      notification._id ??
      generateId(),

    title:
      notification.title ||
      "Notification",

    message:
      notification.message ||
      notification.body ||
      "",

    type:
      notification.type ||
      notification.severity ||
      "info",

    severity:
      notification.severity ||
      notification.type ||
      "info",

    category:
      notification.category ||
      "system",

    read:
      Boolean(
        notification.read ??
          notification.isRead ??
          false
      ),

    createdAt:
      notification.createdAt ||
      notification.created_at ||
      new Date().toISOString(),

    link:
      notification.link ||
      null,

    action:
      notification.action ||
      null,

    productId:
      notification.productId ??
      null,

    productName:
      notification.productName ||
      null,

    productSku:
      notification.productSku ||
      null,

    metadata:
      notification.metadata ||
      {},

    source:
      notification.source ||
      "app",
  };
}

function normalizeNotificationList(
  list
) {
  if (!Array.isArray(list)) {
    return [];
  }

  const normalized =
    list
      .map(
        normalizeNotification
      )
      .filter(Boolean);

  return deduplicateNotifications(
    normalized
  );
}

function getNotificationIdentity(
  notification
) {
  return String(
    notification?.id ??
      notification?._id ??
      ""
  );
}

function deduplicateNotifications(
  list
) {
  const seen = new Set();

  return list.filter(
    (notification) => {
      const key =
        getNotificationIdentity(
          notification
        );

      if (!key) {
        return true;
      }

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);

      return true;
    }
  );
}

function sortNotifications(
  list
) {
  return [...list].sort(
    (a, b) => {
      const dateA =
        new Date(
          a.createdAt
        ).getTime() || 0;

      const dateB =
        new Date(
          b.createdAt
        ).getTime() || 0;

      return dateB - dateA;
    }
  );
}

function limitNotifications(
  list
) {
  return sortNotifications(
    list
  ).slice(
    0,
    MAX_NOTIFICATIONS
  );
}

function getCategoryKey(
  notification
) {
  return (
    notification?.category ||
    notification?.type ||
    notification?.severity ||
    "system"
  )
    .toString()
    .toLowerCase();
}

function shouldAcceptNotification(
  notification,
  preferences
) {
  if (!notification) {
    return false;
  }

  const category =
    getCategoryKey(
      notification
    );

  const severity =
    (
      notification.severity ||
      notification.type ||
      ""
    )
      .toString()
      .toLowerCase();

  if (
    category.includes(
      "out_of_stock"
    ) &&
    preferences.outOfStock ===
      false
  ) {
    return false;
  }

  if (
    category.includes(
      "low_stock"
    ) &&
    preferences.lowStock ===
      false
  ) {
    return false;
  }

  if (
    category.includes(
      "sales"
    ) &&
    preferences.salesUpdates ===
      false
  ) {
    return false;
  }

  if (
    category.includes(
      "forecast"
    ) &&
    preferences.forecastUpdates ===
      false
  ) {
    return false;
  }

  if (
    (
      category === "system" ||
      severity === "info"
    ) &&
    preferences.systemLogs ===
      false
  ) {
    return false;
  }

  return true;
}

function readPreferences() {
  const stored =
    safeReadStorage(
      PREFERENCES_STORAGE_KEY,
      DEFAULT_PREFERENCES
    );

  return {
    ...DEFAULT_PREFERENCES,
    ...(stored || {}),
  };
}

/* ============================================================
   PROVIDER
   ============================================================ */

export function NotificationProvider({
  children,
}) {
  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState(null);

  const [
    connectionStatus,
    setConnectionStatus,
  ] = useState(
    WS_URL
      ? "connecting"
      : "offline"
  );

  const [
    preferences,
    setPreferencesState,
  ] = useState(
    readPreferences
  );

  const channelRef =
    useRef(null);

  const socketRef =
    useRef(null);

  const reconnectTimerRef =
    useRef(null);

  const reconnectAttemptRef =
    useRef(0);

  const mountedRef =
    useRef(true);

  const notificationsRef =
    useRef([]);

  const preferencesRef =
    useRef(preferences);

  const loadingRef =
    useRef(true);

  /* ==========================================================
     KEEP REFS SYNCHRONIZED
     ========================================================== */

  useEffect(() => {
    notificationsRef.current =
      notifications;
  }, [notifications]);

  useEffect(() => {
    preferencesRef.current =
      preferences;
  }, [preferences]);

  useEffect(() => {
    loadingRef.current =
      loading;
  }, [loading]);

  /* ==========================================================
     BROADCAST CHANNEL
     ----------------------------------------------------------
     Lets multiple tabs update one another immediately.
     ========================================================== */

  useEffect(() => {
    mountedRef.current =
      true;

    if (
      typeof BroadcastChannel ===
      "undefined"
    ) {
      return () => {
        mountedRef.current =
          false;
      };
    }

    const channel =
      new BroadcastChannel(
        CHANNEL_NAME
      );

    channelRef.current =
      channel;

    channel.onmessage =
      (event) => {
        const payload =
          event?.data;

        if (!payload) {
          return;
        }

        if (
          payload.type ===
          "SET_ALL"
        ) {
          const incoming =
            normalizeNotificationList(
              payload.notifications
            );

          setNotifications(
            limitNotifications(
              incoming
            )
          );

          return;
        }

        if (
          payload.type ===
          "ADD"
        ) {
          const incoming =
            normalizeNotification(
              payload.notification
            );

          if (!incoming) {
            return;
          }

          setNotifications(
            (previous) => {
              const exists =
                previous.some(
                  (item) =>
                    getNotificationIdentity(
                      item
                    ) ===
                    getNotificationIdentity(
                      incoming
                    )
                );

              if (exists) {
                return previous;
              }

              return limitNotifications(
                [
                  incoming,
                  ...previous,
                ]
              );
            }
          );

          return;
        }

        if (
          payload.type ===
          "MARK_READ"
        ) {
          setNotifications(
            (previous) =>
              previous.map(
                (item) =>
                  getNotificationIdentity(
                    item
                  ) ===
                  String(
                    payload.id
                  )
                    ? {
                        ...item,
                        read: true,
                      }
                    : item
              )
          );

          return;
        }

        if (
          payload.type ===
          "MARK_ALL_READ"
        ) {
          setNotifications(
            (previous) =>
              previous.map(
                (item) => ({
                  ...item,
                  read: true,
                })
              )
          );

          return;
        }

        if (
          payload.type ===
          "REMOVE"
        ) {
          setNotifications(
            (previous) =>
              previous.filter(
                (item) =>
                  getNotificationIdentity(
                    item
                  ) !==
                  String(
                    payload.id
                  )
              )
          );

          return;
        }

        if (
          payload.type ===
          "CLEAR_ALL"
        ) {
          setNotifications([]);
        }
      };

    return () => {
      mountedRef.current =
        false;

      channel.close();

      channelRef.current =
        null;
    };
  }, []);

  /* ==========================================================
     BROADCAST HELPER
     ========================================================== */

  const broadcast = useCallback(
    (payload) => {
      try {
        channelRef.current?.postMessage(
          payload
        );
      } catch (channelError) {
        console.warn(
          "Notification broadcast failed:",
          channelError
        );
      }
    },
    []
  );

  /* ==========================================================
     LOAD INITIAL NOTIFICATIONS
     ========================================================== */

  useEffect(() => {
    let cancelled =
      false;

    const loadNotifications =
      async () => {
        setLoading(true);
        setError(null);

        try {
          const cached =
            safeReadStorage(
              STORAGE_KEY,
              []
            );

          if (
            Array.isArray(
              cached
            ) &&
            cached.length >
              0
          ) {
            const normalizedCached =
              limitNotifications(
                normalizeNotificationList(
                  cached
                )
              );

            if (
              !cancelled
            ) {
              setNotifications(
                normalizedCached
              );
            }
          }

          let apiData = [];

          try {
            apiData =
              await getNotifications();
          } catch (apiError) {
            console.warn(
              "Notification API unavailable. Using local notification cache.",
              apiError
            );
          }

          if (
            Array.isArray(
              apiData
            ) &&
            apiData.length >
              0
          ) {
            const normalizedApi =
              limitNotifications(
                normalizeNotificationList(
                  apiData
                )
              );

            if (
              !cancelled
            ) {
              setNotifications(
                normalizedApi
              );

              safeWriteStorage(
                STORAGE_KEY,
                normalizedApi
              );
            }
          } else if (
            (!cached ||
              cached.length ===
                0) &&
            !cancelled
          ) {
            const welcomeNotification =
              normalizeNotification(
                {
                  id:
                    "welcome-notification",
                  title:
                    "Welcome to Smart Retail",
                  message:
                    "Your intelligent retail workspace is ready. Inventory, sales and AI insights will appear here.",
                  type:
                    "info",
                  severity:
                    "info",
                  category:
                    "system",
                  read: false,
                  createdAt:
                    new Date().toISOString(),
                  source:
                    "system",
                }
              );

            setNotifications([
              welcomeNotification,
            ]);

            try {
              await saveNotifications([
                welcomeNotification,
              ]);
            } catch (saveError) {
              console.warn(
                "Could not save welcome notification:",
                saveError
              );
            }

            safeWriteStorage(
              STORAGE_KEY,
              [
                welcomeNotification,
              ]
            );
          }
        } catch (loadError) {
          console.error(
            "Failed to initialize notifications:",
            loadError
          );

          if (
            !cancelled
          ) {
            setError(
              loadError
            );
          }
        } finally {
          if (
            !cancelled
          ) {
            setLoading(false);
          }
        }
      };

    loadNotifications();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ==========================================================
     PERSIST NOTIFICATIONS
     ========================================================== */

  useEffect(() => {
    if (
      loading ||
      !mountedRef.current
    ) {
      return;
    }

    const normalized =
      limitNotifications(
        normalizeNotificationList(
          notifications
        )
      );

    safeWriteStorage(
      STORAGE_KEY,
      normalized
    );

    const persist =
      async () => {
        try {
          await saveNotifications(
            normalized
          );
        } catch (saveError) {
          console.warn(
            "Failed to persist notifications:",
            saveError
          );
        }
      };

    persist();
  }, [
    notifications,
    loading,
  ]);

  /* ==========================================================
     ADD NOTIFICATION
     ========================================================== */

  const addNotification =
    useCallback(
      (
        notificationInput
      ) => {
        const normalized =
          normalizeNotification(
            {
              ...notificationInput,
              id:
                notificationInput?.id ??
                generateId(),
              read:
                notificationInput?.read ??
                false,
              createdAt:
                notificationInput?.createdAt ||
                new Date().toISOString(),
            }
          );

        if (!normalized) {
          return null;
        }

        const allowed =
          shouldAcceptNotification(
            normalized,
            preferencesRef.current
          );

        if (!allowed) {
          return null;
        }

        setNotifications(
          (previous) => {
            const exists =
              previous.some(
                (item) =>
                  getNotificationIdentity(
                    item
                  ) ===
                  getNotificationIdentity(
                    normalized
                  )
              );

            if (exists) {
              return previous;
            }

            return limitNotifications(
              [
                normalized,
                ...previous,
              ]
            );
          }
        );

        broadcast({
          type: "ADD",
          notification:
            normalized,
        });

        return normalized;
      },
      [broadcast]
    );

  /* ==========================================================
     ADD MULTIPLE NOTIFICATIONS
     ========================================================== */

  const addNotifications =
    useCallback(
      (
        notificationList
      ) => {
        if (
          !Array.isArray(
            notificationList
          ) ||
          notificationList.length ===
            0
        ) {
          return;
        }

        const prepared =
          notificationList
            .map(
              (
                item
              ) =>
                normalizeNotification(
                  {
                    ...item,
                    id:
                      item?.id ??
                      generateId(),
                    read:
                      item?.read ??
                      false,
                    createdAt:
                      item?.createdAt ||
                      new Date().toISOString(),
                  }
                )
            )
            .filter(Boolean)
            .filter(
              (
                item
              ) =>
                shouldAcceptNotification(
                  item,
                  preferencesRef.current
                )
            );

        if (
          prepared.length ===
          0
        ) {
          return;
        }

        setNotifications(
          (previous) => {
            const existingIds =
              new Set(
                previous.map(
                  (
                    item
                  ) =>
                    getNotificationIdentity(
                      item
                    )
                )
              );

            const uniqueNew =
              prepared.filter(
                (
                  item
                ) => {
                  const id =
                    getNotificationIdentity(
                      item
                    );

                  if (
                    existingIds.has(
                      id
                    )
                  ) {
                    return false;
                  }

                  existingIds.add(
                    id
                  );

                  return true;
                }
              );

            return limitNotifications(
              [
                ...uniqueNew,
                ...previous,
              ]
            );
          }
        );

        broadcast({
          type: "SET_ALL",
          notifications:
            limitNotifications(
              [
                ...prepared,
                ...notificationsRef.current,
              ]
            ),
        });
      },
      [broadcast]
    );

  /* ==========================================================
     MARK ONE AS READ
     ========================================================== */

  const markAsRead =
    useCallback(
      (id) => {
        if (
          id ===
          undefined ||
          id === null
        ) {
          return;
        }

        setNotifications(
          (previous) =>
            previous.map(
              (notification) =>
                getNotificationIdentity(
                  notification
                ) ===
                String(id)
                  ? {
                      ...notification,
                      read: true,
                    }
                  : notification
            )
        );

        broadcast({
          type: "MARK_READ",
          id: String(id),
        });
      },
      [broadcast]
    );

  /* ==========================================================
     MARK ALL AS READ
     ========================================================== */

  const markAllAsRead =
    useCallback(() => {
      setNotifications(
        (previous) =>
          previous.map(
            (notification) => ({
              ...notification,
              read: true,
            })
          )
      );

      broadcast({
        type: "MARK_ALL_READ",
      });
    }, [broadcast]);

  /* ==========================================================
     REMOVE ONE NOTIFICATION
     ========================================================== */

  const removeNotification =
    useCallback(
      (id) => {
        if (
          id ===
          undefined ||
          id === null
        ) {
          return;
        }

        setNotifications(
          (previous) =>
            previous.filter(
              (notification) =>
                getNotificationIdentity(
                  notification
                ) !==
                String(id)
            )
        );

        broadcast({
          type: "REMOVE",
          id: String(id),
        });
      },
      [broadcast]
    );

  /* ==========================================================
     CLEAR ALL
     ========================================================== */

  const clearAllNotifications =
    useCallback(() => {
      setNotifications([]);

      broadcast({
        type: "CLEAR_ALL",
      });
    }, [broadcast]);

  /* ==========================================================
     REPLACE ALL
     ========================================================== */

  const setAllNotifications =
    useCallback(
      (notificationList) => {
        const normalized =
          limitNotifications(
            normalizeNotificationList(
              notificationList
            )
          );

        setNotifications(
          normalized
        );

        broadcast({
          type: "SET_ALL",
          notifications:
            normalized,
        });
      },
      [broadcast]
    );

  /* ==========================================================
     UPDATE ONE NOTIFICATION
     ========================================================== */

  const updateNotification =
    useCallback(
      (
        id,
        updates
      ) => {
        if (
          id ===
          undefined ||
          id === null
        ) {
          return;
        }

        setNotifications(
          (previous) =>
            previous.map(
              (notification) =>
                getNotificationIdentity(
                  notification
                ) ===
                String(id)
                  ? {
                      ...notification,
                      ...updates,
                    }
                  : notification
            )
        );

        broadcast({
          type: "SET_ALL",
          notifications:
            notificationsRef.current.map(
              (notification) =>
                getNotificationIdentity(
                  notification
                ) ===
                String(id)
                  ? {
                      ...notification,
                      ...updates,
                    }
                  : notification
            ),
        });
      },
      [broadcast]
    );

  /* ==========================================================
     NOTIFICATION PREFERENCES
     ========================================================== */

  const updatePreferences =
    useCallback(
      (
        updates
      ) => {
        setPreferencesState(
          (previous) => {
            const next = {
              ...previous,
              ...updates,
            };

            preferencesRef.current =
              next;

            safeWriteStorage(
              PREFERENCES_STORAGE_KEY,
              next
            );

            return next;
          }
        );
      },
      []
    );

  /* ==========================================================
     WEBSOCKET CONNECTION
     ----------------------------------------------------------
     FastAPI can expose something like:

     ws://localhost:8000/ws/notifications

     Then set:

     VITE_NOTIFICATIONS_WS_URL=ws://localhost:8000/ws/notifications

     The provider handles reconnecting automatically.
     ========================================================== */

  const connectWebSocket =
    useCallback(() => {
      if (
        !WS_URL ||
        typeof window ===
          "undefined"
      ) {
        setConnectionStatus(
          "offline"
        );

        return () =>
          undefined;
      }

      if (
        socketRef.current &&
        (
          socketRef.current.readyState ===
            WebSocket.OPEN ||
          socketRef.current.readyState ===
            WebSocket.CONNECTING
        )
      ) {
        return () =>
          undefined;
      }

      setConnectionStatus(
        "connecting"
      );

      let socket;

      try {
        socket =
          new WebSocket(
            WS_URL
          );
      } catch (socketError) {
        console.error(
          "Could not create notification WebSocket:",
          socketError
        );

        setConnectionStatus(
          "offline"
        );

        return () =>
          undefined;
      }

      socketRef.current =
        socket;

      socket.onopen =
        () => {
          reconnectAttemptRef.current =
            0;

          setConnectionStatus(
            "connected"
          );

          /*
           * Optional authentication hook:
           *
           * If your backend expects a JWT message after
           * connection, send it here.
           *
           * Example:
           *
           * socket.send(
           *   JSON.stringify({
           *     type: "authenticate",
           *     token: token,
           *   })
           * );
           */
        };

      socket.onmessage =
        (event) => {
          try {
            const payload =
              JSON.parse(
                event.data
              );

            /*
             * Supported backend formats:
             *
             * {
             *   type: "notification",
             *   data: {...}
             * }
             *
             * or directly:
             *
             * {...}
             */

            const incoming =
              payload?.type ===
              "notification"
                ? payload.data
                : payload?.notification ??
                  payload;

            const notification =
              normalizeNotification(
                incoming
              );

            if (
              !notification
            ) {
              return;
            }

            const allowed =
              shouldAcceptNotification(
                notification,
                preferencesRef.current
              );

            if (
              !allowed
            ) {
              return;
            }

            setNotifications(
              (previous) => {
                const exists =
                  previous.some(
                    (
                      item
                    ) =>
                      getNotificationIdentity(
                        item
                      ) ===
                      getNotificationIdentity(
                        notification
                      )
                  );

                if (
                  exists
                ) {
                  return previous;
                }

                return limitNotifications(
                  [
                    notification,
                    ...previous,
                  ]
                );
              }
            );

            broadcast({
              type: "ADD",
              notification,
            });
          } catch (
            websocketMessageError
          ) {
            console.error(
              "Invalid notification WebSocket payload:",
              websocketMessageError
            );
          }
        };

      socket.onerror =
        (socketError) => {
          console.warn(
            "Notification WebSocket error:",
            socketError
          );

          setConnectionStatus(
            "error"
          );
        };

      socket.onclose =
        () => {
          socketRef.current =
            null;

          setConnectionStatus(
            "offline"
          );

          if (
            !mountedRef.current ||
            !WS_URL
          ) {
            return;
          }

          const attempt =
            reconnectAttemptRef.current;

          const delay =
            Math.min(
              1000 *
                Math.pow(
                  2,
                  attempt
                ),
              30000
            );

          reconnectAttemptRef.current =
            attempt + 1;

          reconnectTimerRef.current =
            window.setTimeout(
              () => {
                if (
                  mountedRef.current
                ) {
                  connectWebSocket();
                }
              },
              delay
            );
        };

      return () => {
        try {
          socket.close();
        } catch {
          // Ignore close errors.
        }
      };
    }, [broadcast]);

  /* ==========================================================
     START WEBSOCKET
     ========================================================== */

  useEffect(() => {
    const cleanup =
      connectWebSocket();

    return () => {
      if (
        reconnectTimerRef.current
      ) {
        window.clearTimeout(
          reconnectTimerRef.current
        );
      }

      cleanup?.();

      if (
        socketRef.current
      ) {
        try {
          socketRef.current.close();
        } catch {
          // Ignore.
        }
      }

      socketRef.current =
        null;
    };
  }, [
    connectWebSocket,
  ]);

  /* ==========================================================
     UNREAD COUNT
     ========================================================== */

  const unreadCount =
    useMemo(
      () =>
        notifications.reduce(
          (count, notification) =>
            count +
            (notification.read
              ? 0
              : 1),
          0
        ),
      [notifications]
    );

  /* ==========================================================
     CONNECTION LABEL
     ========================================================== */

  const isRealtime =
    Boolean(WS_URL);

  /* ==========================================================
     CONTEXT VALUE
     ========================================================== */

  const value =
    useMemo(
      () => ({
        notifications,

        unreadCount,

        loading,

        error,

        connectionStatus,

        isRealtime,

        preferences,

        addNotification,

        addNotifications,

        markAsRead,

        markAllAsRead,

        removeNotification,

        clearAllNotifications,

        setAllNotifications,

        updateNotification,

        updatePreferences,

        refreshRealtimeConnection:
          connectWebSocket,
      }),
      [
        notifications,
        unreadCount,
        loading,
        error,
        connectionStatus,
        isRealtime,
        preferences,
        addNotification,
        addNotifications,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        setAllNotifications,
        updateNotification,
        updatePreferences,
        connectWebSocket,
      ]
    );

  /* ==========================================================
     PROVIDER
     ========================================================== */

  return (
    <NotificationContext.Provider
      value={value}
    >
      {children}
    </NotificationContext.Provider>
  );
}

/* ============================================================
   HOOK
   ============================================================ */

export function useNotifications() {
  const context =
    useContext(
      NotificationContext
    );

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
}
