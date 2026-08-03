import api from "./api";

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (payload) => {
  try {
    const response = await api.post("/auth/change-password", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};