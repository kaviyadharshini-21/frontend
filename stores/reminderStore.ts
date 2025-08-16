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
      // For now, we'll use mock data since the backend endpoints might not be fully implemented
      const mockReminders: Reminder[] = [
        {
          id: "1",
          userId: "user-1",
          emailId: "email-1",
          type: "overdue",
          title: "Response needed: Project Timeline Discussion",
          context: "Alex Chen is waiting for your input on potential delays in mobile app development.",
          sender: "Alex Chen",
          urgency: "high",
          daysOverdue: 2,
          timestamp: "2 days overdue",
          remindAt: "2024-01-13T10:00:00Z",
          createdAt: "2024-01-11T10:00:00Z",
        },
        {
          id: "2",
          userId: "user-1",
          emailId: "email-2",
          type: "follow-up",
          title: "Follow up: Budget approval request",
          context: "You requested budget approval for Q4 marketing campaigns. No response yet.",
          sender: "Finance Team",
          urgency: "medium",
          timestamp: "5 days ago",
          remindAt: "2024-01-16T14:00:00Z",
          createdAt: "2024-01-10T14:00:00Z",
        },
        {
          id: "3",
          userId: "user-1",
          emailId: "email-3",
          type: "meeting",
          title: "Meeting reminder: Client presentation",
          context: "Presentation scheduled for tomorrow at 3 PM with Acme Corp.",
          sender: "Calendar",
          urgency: "high",
          timestamp: "Tomorrow at 3 PM",
          remindAt: "2024-01-16T15:00:00Z",
          createdAt: "2024-01-15T15:00:00Z",
        },
      ];
      set({ reminders: mockReminders, error: null });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to fetch reminders" });
    } finally {
      set({ loading: false });
    }
  },

  addReminder: async (reminderData: Partial<Reminder>) => {
    set({ loading: true, error: null });
    try {
      // For now, we'll add to local state since the backend endpoint might not be implemented
      const newReminder: Reminder = {
        id: Date.now().toString(),
        userId: "user-1",
        emailId: reminderData.emailId || "",
        type: reminderData.type || "follow-up",
        title: reminderData.title || "New Reminder",
        context: reminderData.context || "",
        sender: reminderData.sender || "",
        urgency: reminderData.urgency || "medium",
        timestamp: reminderData.timestamp || "Now",
        remindAt: reminderData.remindAt || new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      set((state) => ({
        reminders: [...state.reminders, newReminder],
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
      // For now, we'll update local state
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
      // For now, we'll update local state
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
