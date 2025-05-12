import axios from "axios";

export const getCommentsByBlog = async (blogId) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/comments/${blogId}`,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    },
  );
  return response.data.map((comment) => ({
    _id: comment._id,
    text: comment.content,
    user: {
      _id: comment.userId._id,
      username: comment.userId.username,
      avatar:
        comment.userId.avatarUrl ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    },
    createdAt: comment.createdAt,
  }));
};

export const createComment = async (blogId, content) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/comments`,
    { blogId, content },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    },
  );
  const comment = response.data.comment;
  return {
    _id: comment._id,
    text: comment.content,
    user: {
      _id: comment.userId._id,
      username: comment.userId.username,
      avatar:
        comment.userId.avatarUrl ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    },
    createdAt: comment.createdAt,
  };
};

export const deleteComment = async (commentId) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/comments/${commentId}`, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};

export const updateComment = async (commentId, content) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `${import.meta.env.VITE_API_URL}/comments/${commentId}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const comment = response.data.comment;
  return {
    _id: comment._id,
    text: comment.content,
    user: {
      _id: comment.userId._id,
      username: comment.userId.username,
      avatar:
        comment.userId.avatarUrl ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    },
    createdAt: comment.createdAt,
  };
};