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
  hydrated: boolean;
  setAuth: (payload: { user: User; token: string }) => Promise<void>;
  loadAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

const USER_KEY = "educast_user";
const TOKEN_KEY = "educast_token";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  hydrated: false,

  setAuth: async ({ user, token }) => {
    await AsyncStorage.multiSet([
      [USER_KEY, JSON.stringify(user)],
      [TOKEN_KEY, token],
    ]);

    set({ user, token });
  },

  loadAuth: async () => {
    try {
      const entries = await AsyncStorage.multiGet([USER_KEY, TOKEN_KEY]);
      const rawUser = entries.find(([key]) => key === USER_KEY)?.[1] ?? null;
      const token = entries.find(([key]) => key === TOKEN_KEY)?.[1] ?? null;

      set({
        user: rawUser ? (JSON.parse(rawUser) as User) : null,
        token,
        hydrated: true,
      });
    } catch {
      set({ user: null, token: null, hydrated: true });
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY]);
    set({ user: null, token: null, hydrated: true });
  },
}));
