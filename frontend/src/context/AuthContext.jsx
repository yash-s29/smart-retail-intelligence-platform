import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import { AuthContext } from "./AuthContextBase";
import { loginUser, registerUser } from "../services/authApi";
import { getProfile } from "../services/userApi";

const TOKEN_KEY = "access_token";
const USER_KEY = "srip_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  // -----------------------------------------
  // Save Token
  // -----------------------------------------

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  // -----------------------------------------
  // Save User
  // -----------------------------------------

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  // -----------------------------------------
  // Initial Authentication
  // -----------------------------------------

  useEffect(() => {
    let mounted = true;

    const bootstrapAuth = async () => {
      if (!token) {
        if (mounted) {
          setUser(null);
          setReady(true);
        }
        return;
      }

      // User already loaded
      if (user) {
        if (mounted) {
          setReady(true);
        }
        return;
      }

      try {
        const profile = await getProfile();

        if (mounted) {
          setUser(profile);
        }
      } catch (error) {
        if (mounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    };

    bootstrapAuth();

    return () => {
      mounted = false;
    };
  }, [token]);

  // -----------------------------------------
  // Artificial Delay
  // -----------------------------------------

  const minDelay = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // -----------------------------------------
  // Login
  // -----------------------------------------

  const login = useCallback(async (credentials) => {
    setLoading(true);

    try {
      const [data] = await Promise.all([
        loginUser(credentials),
        minDelay(650),
      ]);

      setToken(data.access_token);
      setUser(data.user);

      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  // -----------------------------------------
  // Register
  // -----------------------------------------

  const register = useCallback(async (payload) => {
    setLoading(true);

    try {
      const [data] = await Promise.all([
        registerUser(payload),
        minDelay(700),
      ]);

      setToken(data.access_token);
      setUser(data.user);

      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  // -----------------------------------------
  // Logout
  // -----------------------------------------

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
    setReady(true);
  }, []);

  // -----------------------------------------
  // Refresh Profile
  // -----------------------------------------

  const refreshProfile = useCallback(async () => {
    if (!token) return null;

    try {
      const profile = await getProfile();

      setUser((prev) => {
        if (
          JSON.stringify(prev) === JSON.stringify(profile)
        ) {
          return prev;
        }

        return profile;
      });

      return profile;
    } catch (error) {
      console.error("Profile refresh failed:", error);
      throw error;
    }
  }, [token]);

  // -----------------------------------------
  // Context Value
  // -----------------------------------------

  const value = useMemo(
    () => ({
      token,
      user,
      ready,
      loading,
      isAuthenticated: !!token,

      login,
      register,
      logout,
      refreshProfile,
    }),
    [
      token,
      user,
      ready,
      loading,
      login,
      register,
      logout,
      refreshProfile,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}