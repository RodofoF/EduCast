import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: apiBaseUrl || "http://localhost:3000/api",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

export async function loginRequest(payload: { email: string; password: string }) {
  if (!apiBaseUrl) {
    console.warn(
      "EXPO_PUBLIC_API_URL não definido. No dispositivo físico, localhost não aponta para o backend da sua máquina."
    );
  }

  const { data } = await api.post("/auth/login", payload);
  return data;
}
