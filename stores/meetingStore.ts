import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import type { Meeting } from "@/types";

type MeetingState = {
  meetings: Meeting[];
  selectedMeeting: Meeting | null;
  loading: boolean;
  error: string | null;
  fetchMeetings: () => Promise<void>;
  createMeeting: (data: Partial<Meeting>) => Promise<void>;
  getMeeting: (meetingId: string) => Promise<void>;
  updateMeeting: (meetingId: string, data: Partial<Meeting>) => Promise<void>;
  deleteMeeting: (meetingId: string) => Promise<void>;
  clearError: () => void;
};

export const useMeetingStore = create<MeetingState>((set, get) => ({
  meetings: [],
  selectedMeeting: null,
  loading: false,
  error: null,

  fetchMeetings: async () => {
    set({ loading: true, error: null });
    try {
      // For now, we'll use mock data since the backend endpoints might not be fully implemented
      const mockMeetings: Meeting[] = [
        {
          id: "1",
          organizerId: "user-1",
          participants: ["Sarah Johnson", "Mike Davis", "You"],
          title: "Q4 Budget Review Meeting",
          description: "Quarterly budget review and resource allocation discussion",
          startTime: "2024-01-16T14:00:00Z",
          endTime: "2024-01-16T15:30:00Z",
          status: "scheduled",
        },
        {
          id: "2",
          organizerId: "user-1",
          participants: ["Acme Corp Team", "You"],
          title: "Client Presentation - Acme Corp",
          description: "Presentation of Q4 results and Q1 plans",
          startTime: "2024-01-17T15:00:00Z",
          endTime: "2024-01-17T16:00:00Z",
          status: "scheduled",
        },
        {
          id: "3",
          organizerId: "user-1",
          participants: ["Marketing Team", "You"],
          title: "Follow up: Marketing Campaign",
          description: "Review campaign performance and discuss next steps",
          startTime: "2024-01-18T10:00:00Z",
          endTime: "2024-01-18T10:30:00Z",
          status: "pending",
        },
      ];
      set({ meetings: mockMeetings, error: null });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to fetch meetings" });
    } finally {
      set({ loading: false });
    }
  },

  createMeeting: async (data: Partial<Meeting>) => {
    set({ loading: true, error: null });
    try {
      // For now, we'll add to local state since the backend endpoint might not be implemented
      const newMeeting: Meeting = {
        id: Date.now().toString(),
        organizerId: "user-1",
        participants: data.participants || [],
        title: data.title || "New Meeting",
        description: data.description || "",
        startTime: data.startTime || new Date().toISOString(),
        endTime: data.endTime || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        status: "pending",
      };
      set((state) => ({
        meetings: [...state.meetings, newMeeting],
        error: null,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to create meeting" });
    } finally {
      set({ loading: false });
    }
  },

  getMeeting: async (meetingId: string) => {
    set({ loading: true, error: null });
    try {
      // For now, we'll find the meeting in local state
      const meeting = get().meetings.find(m => m.id === meetingId);
      if (meeting) {
        set({ selectedMeeting: meeting, error: null });
      } else {
        set({ error: "Meeting not found" });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to fetch meeting" });
    } finally {
      set({ loading: false });
    }
  },

  updateMeeting: async (meetingId: string, data: Partial<Meeting>) => {
    set({ loading: true, error: null });
    try {
      // For now, we'll update local state
      set((state) => ({
        meetings: state.meetings.map((meeting) =>
          meeting.id === meetingId ? { ...meeting, ...data } : meeting
        ),
        selectedMeeting:
          state.selectedMeeting?.id === meetingId
            ? { ...state.selectedMeeting, ...data }
            : state.selectedMeeting,
        error: null,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to update meeting" });
    } finally {
      set({ loading: false });
    }
  },

  deleteMeeting: async (meetingId: string) => {
    try {
      // For now, we'll update local state
      set((state) => ({
        meetings: state.meetings.filter((meeting) => meeting.id !== meetingId),
        selectedMeeting:
          state.selectedMeeting?.id === meetingId
            ? null
            : state.selectedMeeting,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to delete meeting" });
    }
  },

  clearError: () => set({ error: null }),
}));
