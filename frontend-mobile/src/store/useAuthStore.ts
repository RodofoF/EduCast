import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: number;
  username: string;
  email: string;
  userGroups: number[];
  createdAt?: string;
  updatedAt?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (payload: { user: User; token: string }) => Promise<void>;
  loadAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  setAuth: async ({ user, token }) => {
    await AsyncStorage.setItem("educast_user", JSON.stringify(user));
    await AsyncStorage.setItem("educast_token", token);
    set({ user, token });
  },

  loadAuth: async () => {
    const rawUser = await AsyncStorage.getItem("educast_user");
    const token = await AsyncStorage.getItem("educast_token");

    set({
      user: rawUser ? JSON.parse(rawUser) : null,
      token: token || null,
    });
  },

  logout: async () => {
    await AsyncStorage.removeItem("educast_user");
    await AsyncStorage.removeItem("educast_token");
    set({ user: null, token: null });
  },
}));