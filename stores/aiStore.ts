import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../utils/api';
import {
  EmailData,
  EmailClassification,
  EmailSummary,
  EmailIntent,
  EmailProcessingResult,
  BatchProcessingResult,
  EmailFeedback,
  AIProcessingStats,
  CommandParseResult,
  AIScheduleRequest,
  AIScheduleResult,
  MeetingSummaryRequest,
  MeetingSummary,
  LoadingState,
  PaginationState,
} from '../types/api';

interface AIState extends LoadingState {
  // Data
  processingResults: EmailProcessingResult[];
  batchResults: BatchProcessingResult | null;
  processingStats: AIProcessingStats | null;
  commandParseResult: CommandParseResult | null;
  meetingSummary: MeetingSummary | null;
  
  // Pagination
  pagination: PaginationState;
  
  // Cache
  aiCache: Map<string, any>;
  
  // Actions
  classifyEmail: (emailData: EmailData) => Promise<EmailClassification>;
  summarizeEmail: (emailData: EmailData) => Promise<EmailSummary>;
  analyzeIntent: (emailData: EmailData) => Promise<EmailIntent>;
  generateDraft: (emailData: EmailData) => Promise<{ generated_draft: string; confidence: number }>;
  batchProcess: (emails: EmailData[], parallel?: boolean) => Promise<BatchProcessingResult>;
  parseCommand: (command: string) => Promise<CommandParseResult>;
  getQuickResponses: (emailId: string) => Promise<{ suggestions: string[]; total_suggestions: number }>;
  learnFromFeedback: (feedback: EmailFeedback) => Promise<void>;
  getProcessingStats: (days?: number) => Promise<void>;
  aiSchedule: (command: string) => Promise<AIScheduleResult>;
  summarizeMeeting: (meetingNotes: string) => Promise<void>;
  
  // Utility
  clearError: () => void;
  clearCache: () => void;
  getCachedResult: (key: string) => any;
}

export const useAIStore = create<AIState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isLoading: false,
      error: null,
      processingResults: [],
      batchResults: null,
      processingStats: null,
      commandParseResult: null,
      meetingSummary: null,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        hasMore: false,
      },
      aiCache: new Map(),

      // Classify email
      classifyEmail: async (emailData: EmailData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<EmailClassification>('/ai/classify-email', emailData);
          const result = response.data;
          
          // Cache the result
          const { aiCache } = get();
          aiCache.set(`classification_${emailData.email_id}`, result);
          
          set({
            aiCache: new Map(aiCache),
            isLoading: false,
          });
          
          return result;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to classify email';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Summarize email
      summarizeEmail: async (emailData: EmailData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<EmailSummary>('/ai/summarize-email', emailData);
          const result = response.data;
          
          // Cache the result
          const { aiCache } = get();
          aiCache.set(`summary_${emailData.email_id}`, result);
          
          set({
            aiCache: new Map(aiCache),
            isLoading: false,
          });
          
          return result;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to summarize email';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Analyze intent
      analyzeIntent: async (emailData: EmailData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<EmailIntent>('/ai/analyze-intent', emailData);
          const result = response.data;
          
          // Cache the result
          const { aiCache } = get();
          aiCache.set(`intent_${emailData.email_id}`, result);
          
          set({
            aiCache: new Map(aiCache),
            isLoading: false,
          });
          
          return result;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to analyze intent';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Generate draft
      generateDraft: async (emailData: EmailData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/ai/generate-draft', emailData);
          const result = {
            generated_draft: response.data.generated_draft,
            confidence: response.data.confidence,
          };
          
          // Cache the result
          const { aiCache } = get();
          aiCache.set(`draft_${emailData.email_id}`, result);
          
          set({
            aiCache: new Map(aiCache),
            isLoading: false,
          });
          
          return result;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to generate draft';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Batch process
      batchProcess: async (emails: EmailData[], parallel = true) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<BatchProcessingResult>('/ai/batch-process', emails, {
            params: { parallel_processing: parallel },
          });
          const result = response.data;
          
          set({
            batchResults: result,
            processingResults: [...result.results, ...get().processingResults],
            isLoading: false,
          });
          
          return result;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to batch process';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Parse command
      parseCommand: async (command: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<CommandParseResult>('/ai/parse-command', {
            params: { command },
          });
          
          set({
            commandParseResult: response.data,
            isLoading: false,
          });
          
          return response.data;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to parse command';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Get quick responses
      getQuickResponses: async (emailId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get('/ai/quick-responses', {
            params: { email_id: emailId },
          });
          
          set({ isLoading: false });
          return {
            suggestions: response.data.suggestions,
            total_suggestions: response.data.total_suggestions,
          };
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to get quick responses';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Learn from feedback
      learnFromFeedback: async (feedback: EmailFeedback) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/ai/learn-from-feedback', null, {
            params: {
              email_id: feedback.email_id,
              feedback_type: feedback.feedback_type,
              original_result: feedback.original_result,
              corrected_result: feedback.corrected_result,
              rating: feedback.rating,
            },
          });
          
          set({ isLoading: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to learn from feedback';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Get processing stats
      getProcessingStats: async (days = 7) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<AIProcessingStats>('/ai/processing-stats', {
            params: { days },
          });
          
          set({
            processingStats: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to get processing stats';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // AI Schedule
      aiSchedule: async (command: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AIScheduleResult>('/ai/schedule', { command });
          
          set({ isLoading: false });
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
          const response = await api.post<MeetingSummary>('/ai/summarize-meeting', {
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

      // Utility methods
      clearError: () => set({ error: null }),
      clearCache: () => set({ aiCache: new Map() }),
      getCachedResult: (key: string) => {
        const { aiCache } = get();
        return aiCache.get(key) || null;
      },
    }),
    {
      name: 'ai-store',
    }
  )
);


