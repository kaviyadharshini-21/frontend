import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axiosInstance";
import type { User } from "@/types";

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  signup: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      signup: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          set({ error: null });
          // After successful signup, automatically log in the user
          await get().login(data.email, data.password);
        } catch (err: any) {
          console.error("Signup error:", err);
          set({ error: err.response?.data?.detail || "Signup failed" });
        } finally {
          set({ loading: false });
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await axiosInstance.post("/auth/login", {
            email,
            password,
          });

          const token = res.data.access_token;
          localStorage.setItem("token", token);

          set({ token, error: null });

          // Get user profile after successful login
          await get().getProfile();
        } catch (err: any) {
          console.error("Login error:", err);
          set({ error: err.response?.data?.detail || "Login failed" });
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ user: null, token: null, error: null });
      },

      getProfile: async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
          const res = await axiosInstance.get("/auth/profile");
          set({ user: res.data, error: null });
        } catch (err: any) {
          console.error("GetProfile error:", err);
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
