import api from "./api";

export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const updateProfile = async (payload) => {
  const response = await api.patch("/users/profile", payload);
  return response.data;
};

export const deleteProfile = async () => {
  const response = await api.delete("/users/profile");
  return response.data;
};
export const updateTwoFactor = async (payload) => {
  const response = await api.patch("/users/2fa", payload); // Ensure this path matches your backend route
  return response.data;
};