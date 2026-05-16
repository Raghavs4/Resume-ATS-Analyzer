import axios from "axios";

/**
 * Central Axios instance.
 * Base URL is pulled from the .env file:
 *   REACT_APP_API_URL=http://localhost:5000/api
 *
 * The Authorization header is set dynamically by AuthContext
 * whenever the token changes.
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
