import { create } from "zustand";

function getStoredUser() {
  const raw = localStorage.getItem("educast_user");
  return raw ? JSON.parse(raw) : null;
}

function getStoredToken() {
  return localStorage.getItem("educast_token") || null;
}

export const useAuthStore = create((set) => ({
  user: getStoredUser(),
  token: getStoredToken(),

  setAuth: ({ user, token }) => {
    localStorage.setItem("educast_user", JSON.stringify(user));
    localStorage.setItem("educast_token", token);

    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("educast_user");
    localStorage.removeItem("educast_token");
    set({ user: null, token: null });
  },
}));