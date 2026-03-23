import axios from "axios";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api",
});

export async function loginRequest(payload: {
  email: string;
  password: string;
}) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}