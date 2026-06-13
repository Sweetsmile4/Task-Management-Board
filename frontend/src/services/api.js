import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export default api;

// React Query cache keys
export const boardsQueryKey = "boards";
export const tasksQueryKey = (boardId, page = 1, limit = 10) => ["tasks", boardId, page, limit];
export const boardDetailsQueryKey = (boardId) => ["board", boardId];
export const taskDetailsQueryKey = (taskId) => ["task", taskId];