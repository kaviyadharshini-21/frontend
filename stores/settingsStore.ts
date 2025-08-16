import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import type { Settings } from "@/types";

type SettingsState = {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (data: Partial<Settings>) => Promise<void>;
  clearError: () => void;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/settings");
      set({ settings: res.data, error: null });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to fetch settings" });
    } finally {
      set({ loading: false });
    }
  },

  updateSettings: async (data: Partial<Settings>) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.put("/settings", data);
      set({ settings: res.data, error: null });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to update settings" });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
