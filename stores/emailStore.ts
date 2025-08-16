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
      // Using the correct endpoint from API documentation
      const res = await axiosInstance.get("/emails/fetch?count=50&enable_ai=true");
      // The API returns a message about fetching, but we need to get the actual emails
      // For now, we'll use a mock response until the backend is properly set up
      set({ 
        inbox: [
          {
            id: "1",
            from: "sarah@company.com",
            to: ["user@company.com"],
            subject: "Q4 Budget Review Meeting",
            body: "Hi team, I hope this email finds you well. I wanted to reach out regarding our upcoming Q4 budget review meeting. We need to discuss the allocated resources for the next quarter and review our current spending patterns.\n\nCould we schedule this for next Tuesday at 2 PM? Please let me know if this works for everyone.",
            threadId: "thread-1",
            isRead: false,
            isDeleted: false,
            sentAt: "2024-01-15T10:00:00Z",
            attachments: [],
          },
          {
            id: "2",
            from: "marketing@company.com",
            to: ["user@company.com"],
            subject: "Campaign Performance Update",
            body: "Weekly performance metrics showing 15% increase in engagement rates.",
            threadId: "thread-2",
            isRead: true,
            isDeleted: false,
            sentAt: "2024-01-15T08:00:00Z",
            attachments: [],
          },
          {
            id: "3",
            from: "alex@company.com",
            to: ["user@company.com"],
            subject: "Project Timeline Discussion",
            body: "Need to discuss potential delays in the mobile app development timeline.",
            threadId: "thread-3",
            isRead: false,
            isDeleted: false,
            sentAt: "2024-01-14T16:00:00Z",
            attachments: [],
          },
        ], 
        error: null 
      });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to fetch inbox" });
    } finally {
      set({ loading: false });
    }
  },

  fetchThread: async (threadId: string) => {
    set({ loading: true, error: null });
    try {
      // For now, we'll create a mock thread response
      const mockThread: Thread = {
        id: threadId,
        participants: ["sarah@company.com", "user@company.com", "mike@company.com"],
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
