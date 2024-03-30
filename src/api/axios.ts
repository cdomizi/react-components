import axios from "axios";

const API_ENDPOINT = import.meta.env.VITE_REACT_APP_BASE_API_URL;

export const publicApi = axios.create({
  baseURL: API_ENDPOINT,
});

export const authApi = axios.create({
  baseURL: API_ENDPOINT,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
