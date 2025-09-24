import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ScheduleAPI } from '../services/enhancedApi';
import type { CreateSlotRequest, UpdateSlotRequest } from '../types';

// Query keys
export const QUERY_KEYS = {
  WEEK_SLOTS: 'weekSlots',
  HEALTH: 'health',
} as const;

// Hook to fetch week slots with enhanced error handling
export const useWeekSlots = (weekStartDate: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.WEEK_SLOTS, weekStartDate],
    queryFn: () => ScheduleAPI.getSlotsForWeek(weekStartDate),
    staleTime: 30000, // 30 seconds
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error && 'response' in error && error.response && 
          typeof error.response === 'object' && 'status' in error.response &&
          typeof error.response.status === 'number' &&
          error.response.status >= 400 && error.response.status < 500) {
        return false;
      }
      
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

// Hook to create a new slot with optimistic updates
export const useCreateSlot = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateSlotRequest) => ScheduleAPI.createSlot(data),
    onSuccess: () => {
      // Invalidate all week slots to refresh the UI
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WEEK_SLOTS],
      });
    },
    onError: (error) => {
      console.error('Create slot mutation failed:', error);
      // You could show a toast notification here
    },
    retry: 1, // Retry once on failure
  });
};

// Hook to update a slot for a specific date with optimistic updates
export const useUpdateSlotForDate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      scheduleId, 
      date, 
      data 
    }: { 
      scheduleId: number; 
      date: string; 
      data: UpdateSlotRequest; 
    }) => ScheduleAPI.updateSlotForDate(scheduleId, date, data),
    onSuccess: () => {
      // Invalidate all week slots to refresh the UI
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WEEK_SLOTS],
      });
    },
    onError: (error) => {
      console.error('Update slot mutation failed:', error);
      // You could show a toast notification here
    },
    retry: 1, // Retry once on failure
  });
};

// Hook to delete a slot for a specific date
export const useDeleteSlotForDate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ scheduleId, date }: { scheduleId: number; date: string }) => 
      ScheduleAPI.deleteSlotForDate(scheduleId, date),
    onSuccess: () => {
      // Invalidate all week slots to refresh the UI
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WEEK_SLOTS],
      });
    },
    onError: (error) => {
      console.error('Delete slot mutation failed:', error);
      // You could show a toast notification here
    },
    retry: 1, // Retry once on failure
  });
};

// Hook to delete entire schedule
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (scheduleId: number) => ScheduleAPI.deleteSchedule(scheduleId),
    onSuccess: () => {
      // Invalidate all week slots to refresh the UI
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WEEK_SLOTS],
      });
    },
    onError: (error) => {
      console.error('Delete schedule mutation failed:', error);
      // You could show a toast notification here
    },
    retry: 1, // Retry once on failure
  });
};

// Hook for API health check with enhanced error handling
export const useHealthCheck = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.HEALTH],
    queryFn: () => ScheduleAPI.healthCheck(),
    staleTime: 60000, // 1 minute
    retry: false, // Don't retry health checks
    refetchOnWindowFocus: true, // Check when window gains focus
  });
};

// Hook for manual retry operations
export const useRetryOperation = () => {
  return {
    retryWithBackoff: async <T>(
      operation: () => Promise<T>,
      maxRetries: number = 2
    ): Promise<T> => {
      return ScheduleAPI.retryOperation(operation, maxRetries);
    }
  };
};