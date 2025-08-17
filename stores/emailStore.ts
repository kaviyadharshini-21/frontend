import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import type { Email, Thread } from "@/types";
import { Inbox } from "lucide-react";

type EmailState = {
  inbox: Email[];
  selectedThread: Thread | null;
  loading: boolean;
  error: string | null;
  isFetching: boolean; // Add flag to prevent multiple simultaneous calls
  fetchInbox: () => Promise<void>;
  fetchThread: (threadId: string) => Promise<void>;
  sendEmail: (emailData: Partial<Email>) => Promise<void>;
  markAsRead: (emailId: string) => Promise<void>;
  deleteEmail: (emailId: string) => Promise<void>;
  clearError: () => void;
};

export const useEmailStore = create<EmailState>((set, get) => ({
  inbox: [],
  selectedThread: null,
  loading: false,
  error: null,
  isFetching: false,

  fetchInbox: async () => {
    // Prevent multiple simultaneous calls
    if (get().isFetching) {
      return;
    }

    set({ loading: true, error: null, isFetching: true });
    if (get().inbox.length > 0) {
      set({ loading: false, isFetching: false });
      return;
    }
    try {
      // Using the correct endpoint from API documentation
      const res = await axiosInstance.get(
        "/emails/fetch?count=50&enable_ai=true"
      );
      set({ inbox: res.data.emails });
    } catch (err: any) {
      console.log(err);
      set({ error: err.response?.data?.detail || "Failed to fetch inbox" });
    } finally {
      set({ loading: false, isFetching: false });
    }
  },

  fetchThread: async (threadId: string) => {
    set({ loading: true, error: null });
    try {
      // For now, we'll create a mock thread response
      const mockThread: Thread = {
        id: threadId,
        participants: [
          "sarah@company.com",
          "user@company.com",
          "mike@company.com",
        ],
        emails: ["1", "2"],
        lastUpdated: "2024-01-15T10:00:00Z",
      };
      set({ selectedThread: mockThread, error: null });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to fetch thread" });
    } finally {
      set({ loading: false });
    }
  },

  sendEmail: async (emailData: Partial<Email>) => {
    set({ loading: true, error: null });
    try {
      // Using the process email endpoint
      await axiosInstance.post("/emails/process", emailData);
      // Refresh inbox after sending
      await get().fetchInbox();
      set({ error: null });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to send email" });
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: async (emailId: string) => {
    try {
      // For now, we'll update local state since there's no specific endpoint
      set((state) => ({
        inbox: state.inbox.map((email) =>
          email.id === emailId ? { ...email, isRead: true } : email
        ),
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.detail || "Failed to mark email as read",
      });
    }
  },

  deleteEmail: async (emailId: string) => {
    try {
      // For now, we'll update local state since there's no specific endpoint
      set((state) => ({
        inbox: state.inbox.filter((email) => email.id !== emailId),
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to delete email" });
    }
  },

  clearError: () => set({ error: null }),
}));
