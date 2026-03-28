import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

export async function loginRequest(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}