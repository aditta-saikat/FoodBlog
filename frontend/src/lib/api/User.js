import axios from "axios";

export const getUser = async (userId) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/users/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch user");
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/users/${userId}`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update user");
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/users/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete user");
  }
};