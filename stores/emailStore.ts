import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../utils/api';
import {
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
  LoadingState,
  PaginationState,
} from '../types/api';

interface EmailState extends LoadingState {
  // Data
  processedEmails: EmailProcessingResult[];
  reviewEmails: EmailProcessingResult[];
  emailStats: EmailStats | null;
  quickResponses: QuickResponse | null;
  searchResults: EmailSearchResult | null;
  userPreferences: UserPreferences | null;
  
  // Pagination
  pagination: PaginationState;
  
  // Cache
  emailCache: Map<string, EmailProcessingResult>;
  
  // Actions
  processSingleEmail: (emailData: EmailData) => Promise<EmailProcessingResult>;
  batchProcessEmails: (emails: EmailData[], parallel?: boolean) => Promise<BatchProcessingResult>;
  fetchEmails: (count?: number, enableAI?: boolean) => Promise<void>;
  getReviewEmails: (limit?: number) => Promise<void>;
  provideFeedback: (feedback: EmailFeedback) => Promise<void>;
  getEmailStats: (days?: number) => Promise<void>;
  getQuickResponses: (emailId: string) => Promise<void>;
  updateUserPreferences: (preferences: UserPreferences) => Promise<void>;
  searchEmails: (query: string, filters?: Record<string, any>, limit?: number) => Promise<void>;
  
  // AI Processing
  classifyEmail: (emailData: EmailData) => Promise<EmailClassification>;
  summarizeEmail: (emailData: EmailData) => Promise<EmailSummary>;
  analyzeIntent: (emailData: EmailData) => Promise<EmailIntent>;
  generateDraft: (emailData: EmailData) => Promise<{ generated_draft: string; confidence: number }>;
  
  // Utility
  clearError: () => void;
  clearCache: () => void;
  getCachedEmail: (emailId: string) => EmailProcessingResult | null;
}

export const useEmailStore = create<EmailState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isLoading: false,
      error: null,
      processedEmails: [],
      reviewEmails: [],
      emailStats: null,
      quickResponses: null,
      searchResults: null,
      userPreferences: null,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        hasMore: false,
      },
      emailCache: new Map(),

      // Process single email
      processSingleEmail: async (emailData: EmailData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<EmailProcessingResult>('/emails/process', emailData);
          const result = response.data;
          
          // Cache the result
          const { emailCache } = get();
          emailCache.set(emailData.email_id, result);
          
          set((state) => ({
            processedEmails: [result, ...state.processedEmails],
            emailCache: new Map(emailCache),
            isLoading: false,
          }));
          
          return result;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to process email';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Batch process emails
      batchProcessEmails: async (emails: EmailData[], parallel = true) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<BatchProcessingResult>('/emails/batch-process', {
            emails,
            parallel_processing: parallel,
          });
          const result = response.data;
          
          // Cache successful results
          const { emailCache } = get();
          result.results.forEach((emailResult) => {
            emailCache.set(emailResult.email_id, emailResult);
          });
          
          set((state) => ({
            processedEmails: [...result.results, ...state.processedEmails],
            emailCache: new Map(emailCache),
            isLoading: false,
          }));
          
          return result;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to batch process emails';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Fetch emails from IMAP
      fetchEmails: async (count = 20, enableAI = true) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get('/emails/fetch', {
            params: { count, enable_ai: enableAI },
          });
          
          // The API returns a success message, but we need to get the actual emails
          // Let's also fetch the processed emails to display them
          const processedResponse = await api.get('/emails/review', {
            params: { limit: count },
          });
          
          // Transform the API response to match the expected EmailProcessingResult structure
          const transformedEmails = (processedResponse.data.emails || []).map((email: any) => ({
            email_id: email.id,
            processing_status: email.classification ? 'completed' : 'pending',
            classification: email.classification || {
              category: 'fyi',
              urgency: 'medium',
              actionability: 'low',
              sender_importance: 'normal',
              confidence_score: 0.0,
              reasoning: email.reasoning || 'No classification available',
              requires_human_review: true
            },
            summary: email.summary || {
              brief_summary: email.subject || 'No subject',
              key_points: [],
              action_items: [],
              deadlines: [],
              mentioned_people: [],
              mentioned_dates: [],
              sentiment: 'neutral',
              confidence: 0.0
            },
            intent: {
              primary_intent: 'fyi',
              secondary_intents: [],
              confidence: 0.0,
              requires_response: false,
              expected_response_time: 'none'
            },
            generated_response: '',
            response_confidence: 0.0,
            requires_human_review: true,
            processing_time: 0,
            recommendations: [],
            error_message: null
          }));
          
          set({
            processedEmails: transformedEmails,
            isLoading: false,
          });
          
          return response.data;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to fetch emails';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Get emails for review
      getReviewEmails: async (limit = 10) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get('/emails/review', {
            params: { limit },
          });
          
          // Transform the API response to match the expected EmailProcessingResult structure
          const transformedEmails = (response.data.emails || []).map((email: any) => ({
            email_id: email.id,
            processing_status: email.classification ? 'completed' : 'pending',
            classification: email.classification || {
              category: 'fyi',
              urgency: 'medium',
              actionability: 'low',
              sender_importance: 'normal',
              confidence_score: 0.0,
              reasoning: email.reasoning || 'No classification available',
              requires_human_review: true
            },
            summary: email.summary || {
              brief_summary: email.subject || 'No subject',
              key_points: [],
              action_items: [],
              deadlines: [],
              mentioned_people: [],
              mentioned_dates: [],
              sentiment: 'neutral',
              confidence: 0.0
            },
            intent: {
              primary_intent: 'fyi',
              secondary_intents: [],
              confidence: 0.0,
              requires_response: false,
              expected_response_time: 'none'
            },
            generated_response: '',
            response_confidence: 0.0,
            requires_human_review: true,
            processing_time: 0,
            recommendations: [],
            error_message: null
          }));
          
          set({
            reviewEmails: transformedEmails,
            pagination: {
              ...get().pagination,
              total: response.data.total_count,
            },
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to get review emails';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Provide feedback
      provideFeedback: async (feedback: EmailFeedback) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/emails/feedback', feedback);
          set({ isLoading: false });
          return response.data;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to provide feedback';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Get email statistics
      getEmailStats: async (days = 7) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<EmailStats>('/emails/stats', {
            params: { days },
          });
          
          set({
            emailStats: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to get email statistics';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Get quick responses
      getQuickResponses: async (emailId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<QuickResponse>('/emails/quick-responses', {
            params: { email_id: emailId },
          });
          
          set({
            quickResponses: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to get quick responses';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Update user preferences
      updateUserPreferences: async (preferences: UserPreferences) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.put('/emails/preferences', preferences);
          
          set({
            userPreferences: preferences,
            isLoading: false,
          });
          
          return response.data;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to update preferences';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Search emails
      searchEmails: async (query: string, filters: Record<string, any> = {}, limit = 20) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<EmailSearchResult>('/emails/search', {
            params: { query, ...filters, limit },
          });
          
          set({
            searchResults: response.data,
            pagination: {
              ...get().pagination,
              total: response.data.total_count,
              limit: response.data.limit,
            },
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to search emails';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // AI Processing Methods
      classifyEmail: async (emailData: EmailData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<EmailClassification>('/ai/classify-email', emailData);
          set({ isLoading: false });
          return response.data;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to classify email';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      summarizeEmail: async (emailData: EmailData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<EmailSummary>('/ai/summarize-email', emailData);
          set({ isLoading: false });
          return response.data;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to summarize email';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      analyzeIntent: async (emailData: EmailData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<EmailIntent>('/ai/analyze-intent', emailData);
          set({ isLoading: false });
          return response.data;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to analyze intent';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      generateDraft: async (emailData: EmailData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/ai/generate-draft', emailData);
          set({ isLoading: false });
          return {
            generated_draft: response.data.generated_draft,
            confidence: response.data.confidence,
          };
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to generate draft';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Utility methods
      clearError: () => set({ error: null }),
      clearCache: () => set({ emailCache: new Map() }),
      getCachedEmail: (emailId: string) => {
        const { emailCache } = get();
        return emailCache.get(emailId) || null;
      },
    }),
    {
      name: 'email-store',
    }
  )
);

