import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import type { Email, Thread } from "@/types";

type EmailState = {
  inbox: Email[];
  selectedThread: Thread | null;
  loading: boolean;
  error: string | null;
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

  fetchInbox: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/emails/fetch");
      set({ inbox: res.data.emails || [], error: null });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to fetch inbox" });
    } finally {
      set({ loading: false });
    }
  },

  fetchThread: async (threadId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/emails/thread/${threadId}`);
      set({ selectedThread: res.data, error: null });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to fetch thread" });
    } finally {
      set({ loading: false });
    }
  },

  sendEmail: async (emailData: Partial<Email>) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.post("/emails/send", emailData);
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
      await axiosInstance.put(`/emails/${emailId}/read`);
      // Update local state
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
      await axiosInstance.delete(`/emails/${emailId}`);
      // Update local state
      set((state) => ({
        inbox: state.inbox.filter((email) => email.id !== emailId),
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to delete email" });
    }
  },

  clearError: () => set({ error: null }),
}));
