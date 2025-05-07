import axios from 'axios';

export const toggleLike = async (blogId) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/likes/toggle/${blogId}`,
    {},
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    }
  );
  return response.data;
};

export const getLikesCount = async (blogId) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/likes/count/${blogId}`,
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    }
  );
  return response.data.totalLikes;
};

export const hasLiked = async (blogId) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/likes/has-liked/${blogId}`,
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    }
  );
  return response.data.liked;
};

export const getUsersWhoLiked = async (blogId) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/likes/users/${blogId}`,
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    }
  );
  return response.data.users;
};