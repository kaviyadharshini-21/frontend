import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import type { Meeting } from "@/types";

// Mock data for development
const mockMeetings: Meeting[] = [
  {
    id: "1",
    organizerId: "user-1",
    participants: ["user-1", "user-2"],
    title: "Team Standup",
    description: "Daily team standup meeting",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    endTime: new Date(
      Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000
    ).toISOString(), // Tomorrow + 30 min
    status: "scheduled",
  },
  {
    id: "2",
    organizerId: "user-1",
    participants: ["user-1", "user-3", "user-4"],
    title: "Project Review",
    description: "Monthly project review meeting",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
    endTime: new Date(
      Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000
    ).toISOString(), // Day after tomorrow + 1 hour
    status: "scheduled",
  },
  {
    id: "3",
    organizerId: "user-1",
    participants: ["user-1", "user-2", "user-5"],
    title: "Weekly Planning",
    description: "Weekly team planning and goal setting",
    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
    endTime: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000
    ).toISOString(), // Next week + 1 hour
    status: "scheduled",
  },
];

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
      const meetingsData = Array.isArray(res.data.meetings)
        ? res.data.meetings
        : [];
      set({ meetings: meetingsData, error: null, loading: false });
    } catch (err: any) {
      console.error("Failed to fetch meetings:", err);
      // In development, fall back to mock data if API fails
      set({
        error: "Using mock data (API unavailable)",
        meetings: mockMeetings,
        loading: false,
      });
    }
  },

  createMeeting: async (data: Partial<Meeting>) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post("/meetings", data);
      const newMeeting = res.data;

      // Ensure the new meeting has all required fields
      if (newMeeting && newMeeting.id) {
        set((state) => ({
          meetings: [...state.meetings, newMeeting],
          error: null,
        }));
      } else {
        throw new Error("Invalid meeting data received");
      }
    } catch (err: any) {
      console.error("Failed to create meeting:", err);

      // In development, create mock meeting if API fails
      const mockMeeting: Meeting = {
        id: Date.now().toString(),
        organizerId: "user-1",
        participants: data.participants || [],
        title: data.title || "New Meeting",
        description: data.description || "",
        startTime: data.startTime || new Date().toISOString(),
        endTime:
          data.endTime || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        status: "scheduled",
      };

      set((state) => ({
        meetings: [...state.meetings, mockMeeting],
        error: "Meeting created locally (API unavailable)",
      }));
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
      console.error("Failed to fetch meeting:", err);
      // Try to find meeting in local state
      const localMeeting = get().meetings.find((m) => m.id === meetingId);
      if (localMeeting) {
        set({ selectedMeeting: localMeeting, error: null });
      } else {
        set({ error: "Meeting not found" });
      }
    } finally {
      set({ loading: false });
    }
  },

  updateMeeting: async (meetingId: string, data: Partial<Meeting>) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.put(`/meetings/${meetingId}`, data);
      const updatedMeeting = res.data;

      set((state) => ({
        meetings: state.meetings.map((meeting) =>
          meeting.id === meetingId ? { ...meeting, ...updatedMeeting } : meeting
        ),
        selectedMeeting:
          state.selectedMeeting?.id === meetingId
            ? updatedMeeting
            : state.selectedMeeting,
        error: null,
      }));
    } catch (err: any) {
      console.error("Failed to update meeting:", err);

      // In development, update locally if API fails
      set((state) => ({
        meetings: state.meetings.map((meeting) =>
          meeting.id === meetingId ? { ...meeting, ...data } : meeting
        ),
        selectedMeeting:
          state.selectedMeeting?.id === meetingId
            ? { ...state.selectedMeeting, ...data }
            : state.selectedMeeting,
        error: "Meeting updated locally (API unavailable)",
      }));
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
      console.error("Failed to delete meeting:", err);

      // In development, delete locally if API fails
      set((state) => ({
        meetings: state.meetings.filter((meeting) => meeting.id !== meetingId),
        selectedMeeting:
          state.selectedMeeting?.id === meetingId
            ? null
            : state.selectedMeeting,
        error: "Meeting deleted locally (API unavailable)",
      }));
    }
  },

  clearError: () => set({ error: null }),
}));
