import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../utils/api';
import {
  Calendar,
  CalendarEvent,
  CreateEventRequest,
  FreeTimeRequest,
  FreeTimeResult,
  ConflictDetectionRequest,
  ConflictResult,
  AIScheduleRequest,
  AIScheduleResult,
  MeetingSummaryRequest,
  MeetingSummary,
  TodayEvents,
  UpcomingEvents,
  LoadingState,
  PaginationState,
} from '../types/api';

interface CalendarState extends LoadingState {
  // Data
  calendars: Calendar[];
  events: CalendarEvent[];
  todayEvents: TodayEvents | null;
  upcomingEvents: UpcomingEvents | null;
  freeTimeSlots: FreeTimeResult | null;
  conflicts: ConflictResult | null;
  meetingSummary: MeetingSummary | null;
  
  // Pagination
  pagination: PaginationState;
  
  // Cache
  eventCache: Map<string, CalendarEvent>;
  calendarCache: Map<string, Calendar>;
  
  // Actions
  listCalendars: () => Promise<void>;
  createEvent: (eventData: CreateEventRequest) => Promise<CalendarEvent>;
  listEvents: (params?: {
    startDate?: string;
    endDate?: string;
    calendarId?: string;
    maxResults?: number;
  }) => Promise<void>;
  getEvent: (eventId: string, calendarId?: string) => Promise<CalendarEvent>;
  updateEvent: (eventId: string, eventData: CreateEventRequest) => Promise<CalendarEvent>;
  deleteEvent: (eventId: string, calendarId?: string) => Promise<void>;
  findFreeTime: (request: FreeTimeRequest) => Promise<void>;
  detectConflicts: (request: ConflictDetectionRequest) => Promise<void>;
  aiSchedule: (command: string) => Promise<AIScheduleResult>;
  summarizeMeeting: (meetingNotes: string) => Promise<void>;
  getTodayEvents: (calendarId?: string) => Promise<void>;
  getUpcomingEvents: (days?: number, calendarId?: string) => Promise<void>;
  
  // Utility
  clearError: () => void;
  clearCache: () => void;
  getCachedEvent: (eventId: string) => CalendarEvent | null;
  getCachedCalendar: (calendarId: string) => Calendar | null;
}

export const useCalendarStore = create<CalendarState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isLoading: false,
      error: null,
      calendars: [],
      events: [],
      todayEvents: null,
      upcomingEvents: null,
      freeTimeSlots: null,
      conflicts: null,
      meetingSummary: null,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        hasMore: false,
      },
      eventCache: new Map(),
      calendarCache: new Map(),

      // List calendars
      listCalendars: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<{ calendars: Calendar[] }>('/calendar/calendars');
          
          // Cache calendars
          const { calendarCache } = get();
          response.data.calendars.forEach((calendar) => {
            calendarCache.set(calendar.id, calendar);
          });
          
          set({
            calendars: response.data.calendars,
            calendarCache: new Map(calendarCache),
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to list calendars';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Create event
      createEvent: async (eventData: CreateEventRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<CalendarEvent>('/calendar/events', eventData);
          const event = response.data;
          
          // Cache the event
          const { eventCache } = get();
          eventCache.set(event.id, event);
          
          set((state) => ({
            events: [event, ...state.events],
            eventCache: new Map(eventCache),
            isLoading: false,
          }));
          
          return event;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to create event';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // List events
      listEvents: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<CalendarEvent[]>('/calendar/events', {
            params: {
              start_date: params.startDate,
              end_date: params.endDate,
              calendar_id: params.calendarId || 'primary',
              max_results: params.maxResults || 100,
            },
          });
          
          // Cache events
          const { eventCache } = get();
          response.data.forEach((event) => {
            eventCache.set(event.id, event);
          });
          
          set({
            events: response.data,
            eventCache: new Map(eventCache),
            pagination: {
              ...get().pagination,
              total: response.data.length,
            },
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to list events';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Get specific event
      getEvent: async (eventId: string, calendarId = 'primary') => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<CalendarEvent>(`/calendar/events/${eventId}`, {
            params: { calendar_id: calendarId },
          });
          const event = response.data;
          
          // Cache the event
          const { eventCache } = get();
          eventCache.set(event.id, event);
          
          set({
            eventCache: new Map(eventCache),
            isLoading: false,
          });
          
          return event;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to get event';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Update event
      updateEvent: async (eventId: string, eventData: CreateEventRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.put<CalendarEvent>(`/calendar/events/${eventId}`, eventData);
          const event = response.data;
          
          // Update cache
          const { eventCache } = get();
          eventCache.set(event.id, event);
          
          set((state) => ({
            events: state.events.map((e) => (e.id === eventId ? event : e)),
            eventCache: new Map(eventCache),
            isLoading: false,
          }));
          
          return event;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to update event';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Delete event
      deleteEvent: async (eventId: string, calendarId = 'primary') => {
        set({ isLoading: true, error: null });
        try {
          await api.delete(`/calendar/events/${eventId}`, {
            params: { calendar_id: calendarId },
          });
          
          // Remove from cache and state
          const { eventCache } = get();
          eventCache.delete(eventId);
          
          set((state) => ({
            events: state.events.filter((e) => e.id !== eventId),
            eventCache: new Map(eventCache),
            isLoading: false,
          }));
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to delete event';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Find free time
      findFreeTime: async (request: FreeTimeRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<FreeTimeResult>('/calendar/free-time', request);
          
          set({
            freeTimeSlots: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to find free time';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Detect conflicts
      detectConflicts: async (request: ConflictDetectionRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<ConflictResult>('/calendar/conflicts', request);
          
          set({
            conflicts: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to detect conflicts';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // AI Schedule
      aiSchedule: async (command: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AIScheduleResult>('/calendar/ai-schedule', { command });
          
          // If an event was created, add it to the cache and state
          if (response.data.created_event) {
            const { eventCache } = get();
            eventCache.set(response.data.created_event.id, response.data.created_event);
            
            set((state) => ({
              events: [response.data.created_event!, ...state.events],
              eventCache: new Map(eventCache),
              isLoading: false,
            }));
          } else {
            set({ isLoading: false });
          }
          
          return response.data;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to schedule with AI';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Summarize meeting
      summarizeMeeting: async (meetingNotes: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<MeetingSummary>('/calendar/summarize-meeting', {
            meeting_notes: meetingNotes,
          });
          
          set({
            meetingSummary: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to summarize meeting';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Get today's events
      getTodayEvents: async (calendarId = 'primary') => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<TodayEvents>('/calendar/today', {
            params: { calendar_id: calendarId },
          });
          
          set({
            todayEvents: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to get today\'s events';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Get upcoming events
      getUpcomingEvents: async (days = 7, calendarId = 'primary') => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<UpcomingEvents>('/calendar/upcoming', {
            params: { days, calendar_id: calendarId },
          });
          
          set({
            upcomingEvents: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to get upcoming events';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Utility methods
      clearError: () => set({ error: null }),
      clearCache: () => set({ eventCache: new Map(), calendarCache: new Map() }),
      getCachedEvent: (eventId: string) => {
        const { eventCache } = get();
        return eventCache.get(eventId) || null;
      },
      getCachedCalendar: (calendarId: string) => {
        const { calendarCache } = get();
        return calendarCache.get(calendarId) || null;
      },
    }),
    {
      name: 'calendar-store',
    }
  )
);


