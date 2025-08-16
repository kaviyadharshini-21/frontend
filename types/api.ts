// Base API Response Types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface ErrorResponse {
  detail: string;
  status?: number;
}

// Health & Status Types
export interface HealthStatus {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}

export interface DetailedHealth {
  status: string;
  timestamp: string;
  services: {
    database: string;
    learning_engine: string;
    email_processor: string;
  };
  uptime: string;
  version: string;
}

export interface SystemMetrics {
  timestamp: string;
  metrics: {
    email_processing: any;
    system: {
      memory_usage: string;
      cpu_usage: string;
      disk_usage: string;
    };
  };
}

// Email Types
export interface EmailData {
  email_id: string;
  sender: string;
  recipients?: string[];
  subject: string;
  body: string;
  html_body?: string;
  include_draft?: boolean;
  user_preferences?: UserPreferences;
}

export interface UserPreferences {
  preferred_response_tone: string;
  auto_categorization: boolean;
  urgency_threshold: number;
  requires_confirmation: boolean;
  signature: string;
}

export interface EmailClassification {
  category: string;
  urgency: string;
  actionability: string;
  sender_importance: string;
  confidence_score: number;
  reasoning: string;
  requires_human_review: boolean;
}

export interface EmailSummary {
  brief_summary: string;
  key_points: string[];
  action_items: string[];
  deadlines: string[];
  mentioned_people: string[];
  mentioned_dates: string[];
  sentiment: string;
  confidence: number;
}

export interface EmailIntent {
  primary_intent: string;
  secondary_intents: string[];
  confidence: number;
  requires_response: boolean;
  expected_response_time: string;
}

export interface EmailProcessingResult {
  email_id: string;
  processing_status: string;
  classification: EmailClassification;
  summary: EmailSummary;
  intent: EmailIntent;
  generated_response: string;
  response_confidence: number;
  requires_human_review: boolean;
  processing_time: number;
  recommendations: string[];
  error_message: string | null;
}

export interface BatchProcessingResult {
  total_emails: number;
  successful: number;
  failed: number;
  results: EmailProcessingResult[];
  processing_time: number;
}

export interface EmailFeedback {
  email_id: string;
  feedback_type: string;
  original_result: string;
  corrected_result: string;
  rating: number;
}

export interface EmailStats {
  period_days: number;
  total_emails_processed: number;
  average_processing_time: number;
  confidence_scores: Record<string, number>;
  human_review_rate: number;
  error_rate: number;
  category_distribution: Record<string, number>;
  urgency_distribution: Record<string, number>;
}

export interface QuickResponse {
  email_id: string;
  quick_responses: string[];
  context: any;
}

export interface EmailSearchResult {
  query: string;
  filters: Record<string, any>;
  results: EmailProcessingResult[];
  total_count: number;
  limit: number;
}

// Calendar Types
export interface Calendar {
  id: string;
  summary: string;
  description?: string;
  primary?: boolean;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start_time: string;
  end_time: string;
  attendees?: string[];
  location?: string;
  timezone: string;
  status: string;
  created: string;
  updated: string;
  link: string;
}

export interface CreateEventRequest {
  summary: string;
  description?: string;
  start_time: string;
  end_time: string;
  attendees?: string[];
  location?: string;
  timezone?: string;
  recurrence?: any;
  reminders?: number[];
}

export interface FreeTimeRequest {
  start_date: string;
  end_date: string;
  duration_minutes: number;
  calendars?: string[];
  working_hours_only?: boolean;
  timezone?: string;
}

export interface FreeTimeSlot {
  start: string;
  end: string;
  duration_minutes: number;
}

export interface FreeTimeResult {
  request_duration: number;
  search_period: {
    start: string;
    end: string;
  };
  free_slots: FreeTimeSlot[];
  total_slots: number;
}

export interface ConflictDetectionRequest {
  event: CreateEventRequest;
  calendars?: string[];
}

export interface Conflict {
  event_id: string;
  summary: string;
  start_time: string;
  end_time: string;
  conflict_type: string;
}

export interface ConflictResult {
  has_conflicts: boolean;
  conflicts: Conflict[];
  suggestions: string[];
}

export interface AIScheduleRequest {
  command: string;
}

export interface AIScheduleResult {
  success: boolean;
  message: string;
  created_event?: CalendarEvent;
  suggestions: string[];
  confidence: number;
  requires_confirmation: boolean;
}

export interface MeetingSummaryRequest {
  meeting_notes: string;
}

export interface MeetingSummary {
  summary: string;
  key_points: string[];
  action_items: string[];
  decisions: string[];
  next_steps: string[];
  follow_up_date: string;
  confidence: number;
}

export interface TodayEvents {
  date: string;
  total_events: number;
  events: CalendarEvent[];
}

export interface UpcomingEvents {
  period_days: number;
  total_events: number;
  events_by_day: Record<string, CalendarEvent[]>;
}

// AI Processing Types
export interface AIProcessingStats {
  period_days: number;
  total_emails_processed: number;
  average_processing_time: number;
  confidence_scores: Record<string, number>;
  human_review_rate: number;
  error_rate: number;
  category_distribution: Record<string, number>;
  urgency_distribution: Record<string, number>;
  learning_progress: any;
}

export interface CommandParseResult {
  command: string;
  parsed_data: any;
  confidence: number;
  validation: any;
}

// Analytics Types
export interface CalendarAnalytics {
  period_days: number;
  calendar_id: string;
  total_events: number;
  total_duration_hours: number;
  average_duration_hours: number;
  average_attendees: number;
  event_types: Record<string, number>;
  busiest_hours: any[];
  productivity_metrics: any;
}

export interface LearningAnalytics {
  period_days: number;
  feedback_count: number;
  model_updates: number;
  improvement_metrics: any;
  learning_patterns: any;
  performance_trends: any;
}

export interface UserBehaviorAnalytics {
  period_days: number;
  total_emails_analyzed: number;
  processing_patterns: any;
  response_patterns: any;
  user_preferences: any;
  productivity_insights: any;
}

export interface PerformanceMetrics {
  period_days: number;
  email_metrics: any;
  calendar_metrics: any;
  performance_metrics: any;
  trends: any;
}

export interface ComparativeAnalysis {
  period1: any;
  period2: any;
  improvements: any;
  insights: any;
}

export interface ExportReport {
  format: string;
  content: any;
}

// Store State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}


