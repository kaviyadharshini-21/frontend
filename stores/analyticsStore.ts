import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../utils/api';
import {
  EmailStats,
  CalendarAnalytics,
  LearningAnalytics,
  UserBehaviorAnalytics,
  PerformanceMetrics,
  ComparativeAnalysis,
  ExportReport,
  LoadingState,
} from '../types/api';

interface AnalyticsState extends LoadingState {
  // Data
  emailStats: EmailStats | null;
  calendarAnalytics: CalendarAnalytics | null;
  learningAnalytics: LearningAnalytics | null;
  userBehaviorAnalytics: UserBehaviorAnalytics | null;
  performanceMetrics: PerformanceMetrics | null;
  comparativeAnalysis: ComparativeAnalysis | null;
  exportReport: ExportReport | null;
  
  // Actions
  getEmailAnalytics: (days?: number) => Promise<void>;
  getCalendarAnalytics: (days?: number, calendarId?: string) => Promise<void>;
  getLearningAnalytics: (days?: number) => Promise<void>;
  getUserBehaviorAnalytics: (days?: number) => Promise<void>;
  getPerformanceMetrics: (days?: number) => Promise<void>;
  getComparativeAnalysis: (period1Days?: number, period2Days?: number) => Promise<void>;
  exportAnalyticsReport: (reportType: string, format?: string, days?: number) => Promise<void>;
  
  // Utility
  clearError: () => void;
  clearAllData: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isLoading: false,
      error: null,
      emailStats: null,
      calendarAnalytics: null,
      learningAnalytics: null,
      userBehaviorAnalytics: null,
      performanceMetrics: null,
      comparativeAnalysis: null,
      exportReport: null,

      // Get email analytics
      getEmailAnalytics: async (days = 7) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<EmailStats>('/analytics/email-stats', {
            params: { days },
          });
          
          set({
            emailStats: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to get email analytics';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Get calendar analytics
      getCalendarAnalytics: async (days = 30, calendarId = 'primary') => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<CalendarAnalytics>('/analytics/calendar-stats', {
            params: { days, calendar_id: calendarId },
          });
          
          set({
            calendarAnalytics: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to get calendar analytics';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Get learning analytics
      getLearningAnalytics: async (days = 30) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<LearningAnalytics>('/analytics/learning-insights', {
            params: { days },
          });
          
          set({
            learningAnalytics: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to get learning analytics';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Get user behavior analytics
      getUserBehaviorAnalytics: async (days = 30) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<UserBehaviorAnalytics>('/analytics/user-behavior', {
            params: { days },
          });
          
          set({
            userBehaviorAnalytics: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to get user behavior analytics';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Get performance metrics
      getPerformanceMetrics: async (days = 7) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<PerformanceMetrics>('/analytics/performance-metrics', {
            params: { days },
          });
          
          set({
            performanceMetrics: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to get performance metrics';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Get comparative analysis
      getComparativeAnalysis: async (period1Days = 7, period2Days = 7) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<ComparativeAnalysis>('/analytics/comparative-analysis', {
            params: { period1_days: period1Days, period2_days: period2Days },
          });
          
          set({
            comparativeAnalysis: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to get comparative analysis';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Export analytics report
      exportAnalyticsReport: async (reportType: string, format = 'json', days = 30) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<ExportReport>('/analytics/export-report', {
            params: { report_type: reportType, format, days },
          });
          
          set({
            exportReport: response.data,
            isLoading: false,
          });
          
          return response.data;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to export report';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Utility methods
      clearError: () => set({ error: null }),
      clearAllData: () => set({
        emailStats: null,
        calendarAnalytics: null,
        learningAnalytics: null,
        userBehaviorAnalytics: null,
        performanceMetrics: null,
        comparativeAnalysis: null,
        exportReport: null,
      }),
    }),
    {
      name: 'analytics-store',
    }
  )
);


