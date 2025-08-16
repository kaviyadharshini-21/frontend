import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import type { Reminder } from "@/types";

type ReminderState = {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
  fetchReminders: () => Promise<void>;
  addReminder: (reminderData: Partial<Reminder>) => Promise<void>;
  updateReminder: (
    reminderId: string,
    data: Partial<Reminder>
  ) => Promise<void>;
  deleteReminder: (reminderId: string) => Promise<void>;
  clearError: () => void;
};

export const useReminderStore = create<ReminderState>((set, get) => ({
  reminders: [],
  loading: false,
  error: null,

  fetchReminders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/reminders");
      set({ reminders: res.data || [], error: null });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to fetch reminders" });
    } finally {
      set({ loading: false });
    }
  },

  addReminder: async (reminderData: Partial<Reminder>) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post("/reminders", reminderData);
      set((state) => ({
        reminders: [...state.reminders, res.data],
        error: null,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to add reminder" });
    } finally {
      set({ loading: false });
    }
  },

  updateReminder: async (reminderId: string, data: Partial<Reminder>) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.put(`/reminders/${reminderId}`, data);
      set((state) => ({
        reminders: state.reminders.map((reminder) =>
          reminder.id === reminderId ? { ...reminder, ...res.data } : reminder
        ),
        error: null,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to update reminder" });
    } finally {
      set({ loading: false });
    }
  },

  deleteReminder: async (reminderId: string) => {
    try {
      await axiosInstance.delete(`/reminders/${reminderId}`);
      set((state) => ({
        reminders: state.reminders.filter(
          (reminder) => reminder.id !== reminderId
        ),
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to delete reminder" });
    }
  },

  clearError: () => set({ error: null }),
}));
