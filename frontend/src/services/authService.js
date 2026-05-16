import api from "./api";

/**
 * Register a new user.
 * POST /api/user/register
 * Body: { name, email, password }
 * Returns: { success, token } or { success: false, message }
 */
export const registerUser = async (name, email, password) => {
  const { data } = await api.post("/user/register", { name, email, password });
  return data;
};

/**
 * Login an existing user.
 * POST /api/user/login
 * Body: { email, password }
 * Returns: { success, token } or { success: false, message }
 */
export const loginUser = async (email, password) => {
  const { data } = await api.post("/user/login", { email, password });
  return data;
};

/**
 * Logout the current user.
 * POST /api/user/logout
 * Returns: { success, message }
 */
export const logoutUser = async () => {
  const { data } = await api.post("/user/logout");
  return data;
};
