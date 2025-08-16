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
      const res = await axiosInstance.get("/meetings");
      set({ meetings: res.data || [], error: null });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to fetch meetings" });
    } finally {
      set({ loading: false });
    }
  },

  createMeeting: async (data: Partial<Meeting>) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post("/meetings", data);
      set((state) => ({
        meetings: [...state.meetings, res.data],
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
      const res = await axiosInstance.get(`/meetings/${meetingId}`);
      set({ selectedMeeting: res.data, error: null });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Failed to fetch meeting" });
    } finally {
      set({ loading: false });
    }
  },

  updateMeeting: async (meetingId: string, data: Partial<Meeting>) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.put(`/meetings/${meetingId}`, data);
      set((state) => ({
        meetings: state.meetings.map((meeting) =>
          meeting.id === meetingId ? { ...meeting, ...res.data } : meeting
        ),
        selectedMeeting:
          state.selectedMeeting?.id === meetingId
            ? res.data
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
      await axiosInstance.delete(`/meetings/${meetingId}`);
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
