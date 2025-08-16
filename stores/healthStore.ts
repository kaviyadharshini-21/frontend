import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../utils/api';
import {
  HealthStatus,
  DetailedHealth,
  SystemMetrics,
  LoadingState,
} from '../types/api';

interface HealthState extends LoadingState {
  // Data
  healthStatus: HealthStatus | null;
  detailedHealth: DetailedHealth | null;
  systemMetrics: SystemMetrics | null;
  
  // Actions
  checkHealth: () => Promise<void>;
  getDetailedHealth: () => Promise<void>;
  getSystemMetrics: () => Promise<void>;
  
  // Utility
  clearError: () => void;
  clearAllData: () => void;
}

export const useHealthStore = create<HealthState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isLoading: false,
      error: null,
      healthStatus: null,
      detailedHealth: null,
      systemMetrics: null,

      // Check basic health
      checkHealth: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<HealthStatus>('/health/status');
          
          set({
            healthStatus: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to check health status';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Get detailed health
      getDetailedHealth: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<DetailedHealth>('/health/detailed');
          
          set({
            detailedHealth: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to get detailed health';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Get system metrics
      getSystemMetrics: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<SystemMetrics>('/health/metrics');
          
          set({
            systemMetrics: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Failed to get system metrics';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Utility methods
      clearError: () => set({ error: null }),
      clearAllData: () => set({
        healthStatus: null,
        detailedHealth: null,
        systemMetrics: null,
      }),
    }),
    {
      name: 'health-store',
    }
  )
);


