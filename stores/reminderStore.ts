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
      // Fetch reminders from backend API
      const res = await axiosInstance.get("/reminders");
      set({ reminders: res.data, error: null });
    } catch (err: any) {
      console.error("Failed to fetch reminders:", err);
      set({ error: err.response?.data?.detail || "Failed to fetch reminders" });
    } finally {
      set({ loading: false });
    }
  },

  addReminder: async (reminderData: Partial<Reminder>) => {
    set({ loading: true, error: null });
    try {
      // Prepare data for backend API
      const reminderPayload = {
        emailId: reminderData.emailId || "",
        type: reminderData.type || "follow-up",
        title: reminderData.title || "New Reminder",
        context: reminderData.context || "",
        sender: reminderData.sender || "",
        urgency: reminderData.urgency || "medium",
        timestamp: reminderData.timestamp || "Now",
        remindAt: reminderData.remindAt || new Date().toISOString(),
      };

      // Create reminder via backend API
      const res = await axiosInstance.post("/reminders", reminderPayload);

      // Refresh reminders list
      await get().fetchReminders();

      set({ error: null });
    } catch (err: any) {
      console.error("Failed to add reminder:", err);
      set({ error: err.response?.data?.detail || "Failed to add reminder" });
    } finally {
      set({ loading: false });
    }
  },

  updateReminder: async (reminderId: string, data: Partial<Reminder>) => {
    set({ loading: true, error: null });
    try {
      // For now, we'll update local state since there's no PUT endpoint for reminders
      set((state) => ({
        reminders: state.reminders.map((reminder) =>
          reminder.id === reminderId ? { ...reminder, ...data } : reminder
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
      // Delete reminder via backend API
      await axiosInstance.delete(`/reminders/${reminderId}`);

      // Refresh reminders list
      await get().fetchReminders();
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to delete reminder" });
    }
  },

  clearError: () => set({ error: null }),
}));
