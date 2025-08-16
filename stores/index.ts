// Export all stores
export { useEmailStore } from './emailStore';
export { useCalendarStore } from './calendarStore';
export { useAnalyticsStore } from './analyticsStore';
export { useHealthStore } from './healthStore';
export { useAIStore } from './aiStore';

// Export types
export type {
  EmailData,
  EmailProcessingResult,
  BatchProcessingResult,
  EmailFeedback,
  EmailStats,
  QuickResponse,
  EmailSearchResult,
  UserPreferences,
  EmailClassification,
  EmailSummary,
  EmailIntent,
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
  CalendarAnalytics,
  LearningAnalytics,
  UserBehaviorAnalytics,
  PerformanceMetrics,
  ComparativeAnalysis,
  ExportReport,
  HealthStatus,
  DetailedHealth,
  SystemMetrics,
  AIProcessingStats,
  CommandParseResult,
  LoadingState,
  PaginationState,
} from '../types/api';


