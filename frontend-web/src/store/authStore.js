import { create } from "zustand";

function safeReadJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getStoredToken() {
  return localStorage.getItem("educast_token") || null;
}

export const useAuthStore = create((set) => ({
  user: safeReadJSON("educast_user"),
  token: getStoredToken(),

  setAuth: ({ user, token }) => {
    if (user) localStorage.setItem("educast_user", JSON.stringify(user));
    if (token) localStorage.setItem("educast_token", token);
    set({ user: user || null, token: token || null });
  },

  logout: () => {
    localStorage.removeItem("educast_user");
    localStorage.removeItem("educast_token");
    set({ user: null, token: null });
  },
}));
